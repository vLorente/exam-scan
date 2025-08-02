"""
Servicio de lógica de negocio para preguntas y opciones
Maneja validaciones complejas y operaciones de negocio
"""

from sqlmodel import Session, select
from app.models.question import Question, Option, QuestionType
from app.models.exam import Exam
from fastapi import HTTPException
from typing import List, Dict, Any, Sequence


class QuestionService:
    
    @staticmethod
    def validate_question_structure(question_id: int, session: Session) -> Dict[str, Any]:
        """
        Valida la estructura completa de una pregunta
        Retorna un diccionario con el resultado de la validación
        """
        question = session.get(Question, question_id)
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        
        options = list(session.exec(
            select(Option).where(Option.question_id == question_id)
        ).all())
        
        errors = []
        warnings = []
        
        # Validaciones específicas por tipo de pregunta
        if question.question_type == QuestionType.MULTIPLE_CHOICE:
            errors.extend(QuestionService._validate_multiple_choice(options))
        elif question.question_type == QuestionType.SINGLE_CHOICE:
            errors.extend(QuestionService._validate_single_choice(options))
        elif question.question_type == QuestionType.TRUE_FALSE:
            errors.extend(QuestionService._validate_true_false(options))
        
        # Validaciones generales
        if len(question.text.strip()) < 10:
            warnings.append("Question text is very short (less than 10 characters)")
        
        if question.points <= 0:
            errors.append("Question must have positive points")
        
        # Verificar explicación
        if not question.explanation:
            warnings.append("Question lacks explanation for students")
        
        return {
            "question_id": question_id,
            "is_valid": len(errors) == 0,
            "errors": errors,
            "warnings": warnings,
            "question_type": question.question_type,
            "options_count": len(options),
            "correct_options_count": len([opt for opt in options if opt.is_correct])
        }
    
    @staticmethod
    def _validate_multiple_choice(options: List[Option]) -> List[str]:
        """Validaciones específicas para preguntas de opción múltiple"""
        errors = []
        
        if len(options) < 2:
            errors.append("Multiple choice question must have at least 2 options")
        
        if len(options) > 6:
            errors.append("Multiple choice question should not have more than 6 options")
        
        correct_options = [opt for opt in options if opt.is_correct]
        if len(correct_options) == 0:
            errors.append("Multiple choice question must have at least 1 correct option")
        
        return errors
    
    @staticmethod
    def _validate_single_choice(options: List[Option]) -> List[str]:
        """Validaciones específicas para preguntas de opción única"""
        errors = []
        
        if len(options) < 2:
            errors.append("Single choice question must have at least 2 options")
        
        if len(options) > 5:
            errors.append("Single choice question should not have more than 5 options")
        
        correct_options = [opt for opt in options if opt.is_correct]
        if len(correct_options) != 1:
            errors.append("Single choice question must have exactly 1 correct option")
        
        return errors
    
    @staticmethod
    def _validate_true_false(options: List[Option]) -> List[str]:
        """Validaciones específicas para preguntas verdadero/falso"""
        errors = []
        
        if len(options) != 2:
            errors.append("True/false question must have exactly 2 options")
        
        correct_options = [opt for opt in options if opt.is_correct]
        if len(correct_options) != 1:
            errors.append("True/false question must have exactly 1 correct option")
        
        # Verificar que las opciones sean "True" y "False"
        option_texts = {opt.text.lower().strip() for opt in options}
        expected = {"true", "false", "verdadero", "falso", "sí", "no", "si", "no"}
        
        if not any(text in expected for text in option_texts):
            errors.append("True/false question options should be variations of True/False")
        
        return errors
    
    @staticmethod
    def auto_fix_question(question_id: int, session: Session) -> Dict[str, Any]:
        """
        Intenta corregir automáticamente problemas comunes en una pregunta
        """
        question = session.get(Question, question_id)
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
        
        options = list(session.exec(
            select(Option).where(Option.question_id == question_id)
        ).all())
        
        fixes_applied = []
        
        # Fijar índices de orden si están desordenados
        for i, option in enumerate(sorted(options, key=lambda x: x.order_index)):
            if option.order_index != i:
                option.order_index = i
                session.add(option)
                fixes_applied.append(f"Fixed order index for option: {option.text[:30]}...")
        
        # Para True/False, asegurar que tengamos exactamente 2 opciones
        if question.question_type == QuestionType.TRUE_FALSE:
            if len(options) == 0:
                # Crear opciones True/False
                true_opt = Option(question_id=question_id, text="True", is_correct=True, order_index=0)
                false_opt = Option(question_id=question_id, text="False", is_correct=False, order_index=1)
                session.add_all([true_opt, false_opt])
                fixes_applied.append("Created True/False options")
            elif len(options) == 1:
                # Agregar la opción faltante
                existing_text = options[0].text.lower()
                if "true" in existing_text or "verdad" in existing_text:
                    new_opt = Option(question_id=question_id, text="False", is_correct=False, order_index=1)
                else:
                    new_opt = Option(question_id=question_id, text="True", is_correct=True, order_index=1)
                session.add(new_opt)
                fixes_applied.append("Added missing True/False option")
        
        session.commit()
        
        return {
            "question_id": question_id,
            "fixes_applied": fixes_applied,
            "fixes_count": len(fixes_applied)
        }
    
    @staticmethod
    def bulk_validate_exam_questions(exam_id: int, session: Session) -> Dict[str, Any]:
        """
        Valida todas las preguntas de un examen
        """
        exam = session.get(Exam, exam_id)
        if not exam:
            raise HTTPException(status_code=404, detail="Exam not found")
        
        questions = session.exec(
            select(Question).where(Question.exam_id == exam_id)
        ).all()
        
        if not questions:
            return {
                "exam_id": exam_id,
                "is_valid": False,
                "total_questions": 0,
                "valid_questions": 0,
                "errors": ["Exam has no questions"],
                "question_validations": []
            }
        
        question_validations = []
        total_errors = 0
        
        for question in questions:
            if question.id is not None:
                validation = QuestionService.validate_question_structure(question.id, session)
                question_validations.append(validation)
                if not validation["is_valid"]:
                    total_errors += len(validation["errors"])
        
        valid_questions = sum(1 for v in question_validations if v["is_valid"])
        
        return {
            "exam_id": exam_id,
            "is_valid": total_errors == 0,
            "total_questions": len(questions),
            "valid_questions": valid_questions,
            "invalid_questions": len(questions) - valid_questions,
            "total_errors": total_errors,
            "question_validations": question_validations
        }
    
    @staticmethod
    def reorder_questions(exam_id: int, question_ids: List[int], session: Session) -> Dict[str, Any]:
        """
        Reordena las preguntas de un examen según la lista proporcionada
        """
        exam = session.get(Exam, exam_id)
        if not exam:
            raise HTTPException(status_code=404, detail="Exam not found")
        
        # Verificar que todas las preguntas pertenecen al examen
        questions = {}
        for question_id in question_ids:
            question = session.get(Question, question_id)
            if not question:
                raise HTTPException(status_code=404, detail=f"Question {question_id} not found")
            if question.exam_id != exam_id:
                raise HTTPException(status_code=400, detail=f"Question {question_id} does not belong to exam {exam_id}")
            questions[question_id] = question
        
        # Aplicar nuevo orden
        for i, question_id in enumerate(question_ids):
            questions[question_id].order_index = i
            session.add(questions[question_id])
        
        session.commit()
        
        return {
            "exam_id": exam_id,
            "reordered_questions": len(question_ids),
            "new_order": question_ids
        }

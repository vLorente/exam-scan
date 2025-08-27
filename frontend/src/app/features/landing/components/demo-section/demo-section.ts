import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DemoStep {
  id: number;
  title: string;
  description: string;
  visual: string;
}

@Component({
  selector: 'app-demo-section',
  templateUrl: './demo-section.html',
  styleUrls: ['./demo-section.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class DemoSectionComponent {

  activeStep = signal(1);

  steps: DemoStep[] = [
    {
      id: 1,
      title: 'Sube tu PDF',
      description: 'Arrastra y suelta tu archivo PDF de examen. Soportamos hasta 200 páginas y 20MB.',
      visual: 'upload'
    },
    {
      id: 2,
      title: 'IA extrae preguntas',
      description: 'Nuestros algoritmos analizan el contenido y identifican preguntas y respuestas automáticamente.',
      visual: 'processing'
    },
    {
      id: 3,
      title: 'Revisa y edita',
      description: 'Valida las preguntas extraídas, realiza ajustes y añade tus propias preguntas.',
      visual: 'editing'
    },
    {
      id: 4,
      title: 'Publica y comparte',
      description: 'Configura tu examen, establece tiempos y compártelo con tus estudiantes.',
      visual: 'sharing'
    }
  ];

  selectStep(stepId: number): void {
    this.activeStep.set(stepId);
  }

  getVisualDescription(): string {
    const step = this.steps.find(s => s.id === this.activeStep());
    switch (step?.visual) {
      case 'upload':
        return 'Demostración visual del proceso de subida de archivo PDF con barra de progreso';
      case 'processing':
        return 'Animación del cerebro artificial procesando el documento con ondas de actividad';
      case 'editing':
        return 'Interfaz de edición mostrando preguntas extraídas con opciones de respuesta';
      case 'sharing':
        return 'Tarjeta de examen publicado con estadísticas y opciones de compartir';
      default:
        return 'Demostración visual del paso actual del proceso';
    }
  }
}

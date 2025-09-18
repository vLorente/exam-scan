import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-features-section',
  templateUrl: './features-section.html',
  styleUrls: ['./features-section.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class FeaturesSectionComponent {

  features: Feature[] = [
    {
      icon: '🤖',
      title: 'Extracción con IA',
      description: 'Nuestros modelos de IA extraen automáticamente preguntas y respuestas de tus PDFs con 95% de precisión.',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: '✏️',
      title: 'Edición Colaborativa',
      description: 'Crea y edita exámenes en equipo con comentarios en tiempo real y control de versiones.',
      color: 'from-green-500 to-blue-500'
    },
    {
      icon: '📊',
      title: 'Análisis Avanzado',
      description: 'Obtén estadísticas detalladas sobre el rendimiento de los estudiantes y la dificultad de las preguntas.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '🎯',
      title: 'Exámenes Interactivos',
      description: 'Diseña exámenes con temporizador, navegación intuitiva y feedback inmediato.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: '🔒',
      title: 'Seguridad Total',
      description: 'Protección de datos con cifrado TLS, autenticación JWT y control de acceso granular.',
      color: 'from-indigo-500 to-blue-600'
    },
    {
      icon: '📱',
      title: 'Multiplataforma',
      description: 'Accede desde cualquier dispositivo con nuestra interfaz responsive y optimizada.',
      color: 'from-pink-500 to-rose-500'
    }
  ];
}

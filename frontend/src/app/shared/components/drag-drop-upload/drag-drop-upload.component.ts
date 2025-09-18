import { Component, ChangeDetectionStrategy, signal, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-drag-drop-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './drag-drop-upload.component.html',
  styleUrl: './drag-drop-upload.component.css'
})
export class DragDropUploadComponent {
  // Inputs
  title = input('Arrastra tu archivo PDF aquí');
  description = input('o haz clic para seleccionar un archivo');
  accept = input('.pdf');
  maxSizeInMB = input(10);
  allowedFormats = input('PDF');
  ariaLabel = input('Zona de carga de archivos PDF');
  processingMessage = input('Procesando archivo...');

  // Outputs
  fileSelected = output<File>();
  fileRemoved = output<void>();
  processingComplete = output<any>();
  errorOccurred = output<string>();

  // State
  selectedFile = signal<File | null>(null);
  isDragOver = signal(false);
  isProcessing = signal(false);
  errorMessage = signal<string | null>(null);

  // Unique component ID for accessibility
  componentId = Math.random().toString(36).substr(2, 9);

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const fileInput = document.querySelector('.file-input') as HTMLInputElement;
      fileInput?.click();
    }
  }

  removeFile(event: Event): void {
    event.stopPropagation();
    this.selectedFile.set(null);
    this.errorMessage.set(null);
    this.fileRemoved.emit();
  }

  private handleFile(file: File): void {
    this.errorMessage.set(null);

    // Validate file type
    if (!this.isValidFileType(file)) {
      this.errorMessage.set(`Tipo de archivo no válido. Solo se permiten archivos ${this.allowedFormats()}.`);
      return;
    }

    // Validate file size
    if (!this.isValidFileSize(file)) {
      this.errorMessage.set(`El archivo es demasiado grande. Tamaño máximo: ${this.maxSizeInMB()}MB.`);
      return;
    }

    this.selectedFile.set(file);
    this.fileSelected.emit(file);

    // Simulate processing for demo
    this.startProcessing();
  }

  private isValidFileType(file: File): boolean {
    const acceptedTypes = this.accept().split(',').map(type => type.trim());
    return acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return file.name.toLowerCase().endsWith(type.toLowerCase());
      }
      return file.type.match(type);
    });
  }

  private isValidFileSize(file: File): boolean {
    const maxSizeInBytes = this.maxSizeInMB() * 1024 * 1024;
    return file.size <= maxSizeInBytes;
  }

  private startProcessing(): void {
    this.isProcessing.set(true);

    // Simulate PDF processing
    setTimeout(() => {
      this.isProcessing.set(false);
      // Emit mock data for now
      this.processingComplete.emit({
        questionsExtracted: 5,
        content: 'Mock extracted content from PDF'
      });
    }, 2000);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

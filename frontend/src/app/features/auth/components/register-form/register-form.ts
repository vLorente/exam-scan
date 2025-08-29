import { Component, output, input, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RegisterRequest } from '@core/models/auth.model';
import { SubmitButtonComponent } from '@shared/components/submit-button/submit-button';
import { PasswordMatchValidatorDirective } from "@shared/directives/password-match/password-match.directive";

@Component({
  selector: 'app-register-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    SubmitButtonComponent,
    PasswordMatchValidatorDirective
],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css'
})
export class RegisterFormComponent {

  loading = input<boolean>(false);
  submitRegister = output<RegisterRequest>();

  showPassword = signal(false);
  showConfirmPassword = signal(false);

  registerForm: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...registerData } = this.registerForm.value;
      // MVP: Automatically set role as 'student' - registration is student-only
      const registerPayload = {
        ...registerData,
        role: 'student' as const
      };
      this.submitRegister.emit(registerPayload);
    }
  }
}

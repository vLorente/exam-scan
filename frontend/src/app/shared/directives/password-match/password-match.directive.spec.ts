import { PasswordMatchValidatorDirective } from './password-match.directive';
import { FormControl, FormGroup } from '@angular/forms';

describe('PasswordMatchValidatorDirective', () => {
  let directive: PasswordMatchValidatorDirective;

  beforeEach(() => {
    directive = new PasswordMatchValidatorDirective();
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  describe('validate', () => {
    it('should return null when passwords match', () => {
      const formGroup = new FormGroup({
        password: new FormControl('password123'),
        confirmPassword: new FormControl('password123')
      });

      const result = directive.validate(formGroup);
      expect(result).toBeNull();
    });

    it('should return { passwordMismatch: true } when passwords do not match', () => {
      const formGroup = new FormGroup({
        password: new FormControl('password123'),
        confirmPassword: new FormControl('differentPassword')
      });

      const result = directive.validate(formGroup);
      expect(result).toEqual({ passwordMismatch: true });
    });

    it('should return null when password control is missing', () => {
      const formGroup = new FormGroup({
        confirmPassword: new FormControl('password123')
      });

      const result = directive.validate(formGroup);
      expect(result).toBeNull();
    });

    it('should return null when confirmPassword control is missing', () => {
      const formGroup = new FormGroup({
        password: new FormControl('password123')
      });

      const result = directive.validate(formGroup);
      expect(result).toBeNull();
    });

    it('should return null when both controls are missing', () => {
      const formGroup = new FormGroup({});

      const result = directive.validate(formGroup);
      expect(result).toBeNull();
    });
  });
});

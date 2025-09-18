import { PasswordMatchValidator } from '../password-match-validator';

describe('PasswordMatchValidator', () => {
  it('should create an instance', () => {
    const directive = new PasswordMatchValidator();
    expect(directive).toBeTruthy();
  });
});

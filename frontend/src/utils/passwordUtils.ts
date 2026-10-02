export interface PasswordRequirement {
  id: string;
  label: string;
  met: boolean;
}

export interface PasswordValidationResult {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
  score: number; // 0 to 5
  requirements: PasswordRequirement[];
}

export const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]).{8,}$/;

export const PASSWORD_REQUIREMENT_TEXT =
  'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character (!@#$%^&*...).';

export function validatePassword(password: string): PasswordValidationResult {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password);

  const requirements: PasswordRequirement[] = [
    { id: 'length', label: 'At least 8 characters', met: hasMinLength },
    { id: 'uppercase', label: 'At least 1 uppercase letter (A–Z)', met: hasUppercase },
    { id: 'lowercase', label: 'At least 1 lowercase letter (a–z)', met: hasLowercase },
    { id: 'number', label: 'At least 1 number (0–9)', met: hasNumber },
    { id: 'special', label: 'At least 1 special character (!@#$%^&*)', met: hasSpecialChar },
  ];

  const score = requirements.filter((r) => r.met).length;
  const isValid = score === 5;

  return {
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
    isValid,
    score,
    requirements,
  };
}

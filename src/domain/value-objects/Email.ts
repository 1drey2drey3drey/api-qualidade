import { ValidationError } from "../../shared/errors/ValidationError";

export class Email {
  private readonly value: string;


  private static readonly MAX_LENGTH = 254;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(email: string): Email {

    if (!email?.trim()) {
      throw new ValidationError("Email is required");
    }

    if (email.length > this.MAX_LENGTH) {
      throw new ValidationError(`Email must not exceed ${this.MAX_LENGTH} characters`);
    }

    const normalized = email.trim().toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalized)) {
      throw new ValidationError("Invalid email format");
    }

    return new Email(normalized);
  }

  public getValue(): string {
    return this.value;
  }
}
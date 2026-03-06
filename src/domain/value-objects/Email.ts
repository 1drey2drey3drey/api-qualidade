import { ValidationError } from "../../shared/errors/ValidationError";

export class Email {
  private readonly value: string;

  // Limite da RFC 5321 para prevenir ataques de negação de serviço (DoS)
  private static readonly MAX_LENGTH = 254;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(email: string): Email {
    // 1. Fail Fast: Verifica existência
    if (!email?.trim()) {
      throw new ValidationError("Email is required");
    }

    // 2. Defesa ReDoS: Trava o tamanho antes da Regex
    if (email.length > this.MAX_LENGTH) {
      throw new ValidationError(`Email must not exceed ${this.MAX_LENGTH} characters`);
    }

    const normalized = email.trim().toLowerCase();

    // 3. Regex Linear: Segura contra backtracking catastrófico
    const emailRegex =  /^[^\s@]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(normalized)) {
      throw new ValidationError("Invalid email format");
    }

    return new Email(normalized);
  }

  public getValue(): string {
    return this.value;
  }
}
import bcrypt from "bcrypt";
import type { PasswordHasher } from "../../../application/ports/PasswordHasher";

const DEFAULT_SALT_ROUNDS = 10;

export class BcryptPasswordHasher implements PasswordHasher {
  private readonly pepper: string;

  constructor(private readonly saltRounds: number = DEFAULT_SALT_ROUNDS) {

    this.pepper = process.env.BCRYPT_PEPPER || "";
  }

  public async hash(plainValue: string): Promise<string> {

    const valueWithPepper = `${plainValue}${this.pepper}`;
    
 
    return bcrypt.hash(valueWithPepper, this.saltRounds);
  }

  public async compare(plainValue: string, hashedValue: string): Promise<boolean> {
    const valueWithPepper = `${plainValue}${this.pepper}`;
    return bcrypt.compare(valueWithPepper, hashedValue);
  }
}
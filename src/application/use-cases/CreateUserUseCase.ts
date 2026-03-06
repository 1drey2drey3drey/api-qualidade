import type { CreateUserInputDto } from "../dto/requests";
import type { PasswordHasher } from "../ports/PasswordHasher";
import type { UserRepository } from "../ports/UserRepository";
import { User } from "../../domain/entities/User";
import { Email } from "../../domain/value-objects/Email"; // 1. Importe o novo Value Object
import type { IdGenerator } from "../ports/IdGenerator";
import { MIN_PASSWORD_LENGTH } from "../../shared/constants/business-rules";
import { BusinessRuleError } from "../../shared/errors/BusinessRuleError";
import { ValidationError } from "../../shared/errors/ValidationError";
import { assertNonEmptyString } from "../validators/common";

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly idGenerator: IdGenerator
  ) {}

  public async execute(input: CreateUserInputDto): Promise<User> {

    assertNonEmptyString(input.name, "name");
    assertNonEmptyString(input.password, "password");


    const emailVO = Email.create(input.email);

    if (input.password.length < MIN_PASSWORD_LENGTH) {
      throw new ValidationError(`Password must have at least ${MIN_PASSWORD_LENGTH} characters`);
    }


    const existingUser = await this.userRepository.findByEmail(emailVO.getValue());
    
    if (existingUser) {
      throw new BusinessRuleError("User with this email already exists");
    }


    const passwordHash = await this.passwordHasher.hash(input.password);

    const user = User.create({
      id: this.idGenerator.generate(),
      name: input.name.trim(),
      email: emailVO.getValue(), 
      passwordHash,
      createdAt: new Date()
    });

    await this.userRepository.save(user);

    return user;
  }
}
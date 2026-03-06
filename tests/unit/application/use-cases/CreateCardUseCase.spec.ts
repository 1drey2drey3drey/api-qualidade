import { describe, expect, it, vi, beforeEach } from "vitest";
import { CreateCardUseCase } from "../../../../src/application/use-cases/CreateCardUseCase";
import type { UserRepository } from "../../../../src/application/ports/UserRepository";
import type { CardRepository } from "../../../../src/application/ports/CardRepository";
import type { IdGenerator } from "../../../../src/application/ports/IdGenerator";
import { User } from "../../../../src/domain/entities/User";
import { NotFoundError } from "../../../../src/shared/errors/NotFoundError";
import { ValidationError } from "../../../../src/shared/errors/ValidationError";

const DUMMY_HASH = "any_hash_value";

describe("CreateCardUseCase", () => {
  // 1. Centralização de tipos e mocks para evitar duplicação
  let userRepository: UserRepository;
  let cardRepository: CardRepository;
  let idGenerator: IdGenerator;
  let useCase: CreateCardUseCase;

  // Fábrica de usuário para evitar strings de senha repetidas no código
  const createMockUser = () => User.create({
    id: "user-1",
    name: "Alice",
    email: "alice@mail.com",
    passwordHash: DUMMY_HASH, // Valor neutro para testes
    createdAt: new Date()
  });

  beforeEach(() => {
    userRepository = {
      findById: vi.fn().mockResolvedValue(createMockUser()),
      findByEmail: vi.fn(),
      save: vi.fn()
    };

    cardRepository = {
      findById: vi.fn(),
      findByUserId: vi.fn(),
      save: vi.fn()
    };

    idGenerator = { generate: vi.fn().mockReturnValue("card-1") };

    useCase = new CreateCardUseCase(userRepository, cardRepository, idGenerator);
  });

  it("should create card for existing user", async () => {
    const card = await useCase.execute({
      userId: "user-1",
      cardNumber: "1234123412341234",
      limitCents: 1000
    });

    expect(card.id).toBe("card-1");
    expect(card.toJSON().last4).toBe("1234");
    expect(cardRepository.save).toHaveBeenCalledOnce();
  });

  it("should fail when user does not exist", async () => {
    // 2. Sobrescrita específica para o cenário de falha
    vi.mocked(userRepository.findById).mockResolvedValue(null);

    await expect(
      useCase.execute({
        userId: "user-1",
        cardNumber: "1234123412341234",
        limitCents: 1000
      })
    ).rejects.toThrow(NotFoundError);
  });

  it("should fail when card number is invalid", async () => {
    await expect(
      useCase.execute({
        userId: "user-1",
        cardNumber: "1234",
        limitCents: 1000
      })
    ).rejects.toThrow(ValidationError);
  });
});
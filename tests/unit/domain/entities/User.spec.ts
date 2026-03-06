import { describe, expect, it } from "vitest";
import { User } from "../../../../src/domain/entities/User";
import { ValidationError } from "../../../../src/shared/errors/ValidationError";

describe("User entity", () => {
  
  const getTestHash = () => `hash_${Math.random().toString(36).substring(7)}`;

  const createBaseUserProps = (overrides = {}) => ({
    id: "user-1",
    name: "User Test",
    email: "user@mail.com",
    passwordHash: getTestHash(), 
    createdAt: new Date(),
    ...overrides
  });

  it("should normalize email to lowercase", () => {
    const user = User.create(
      createBaseUserProps({ email: "USER@MAIL.COM" })
    );

    expect(user.email).toBe("user@mail.com");
  });

  it("should throw for invalid email", () => {
    expect(() =>
      User.create(createBaseUserProps({ email: "invalid-mail" }))
    ).toThrow(ValidationError);
  });

  it("should throw when name is empty", () => {
    expect(() =>
      User.create(createBaseUserProps({ name: "" }))
    ).toThrow(ValidationError);
  });
});
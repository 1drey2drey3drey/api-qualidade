import type { Request, Response } from "express";
import { HTTP_STATUS } from "../../../../shared/constants/http-status";
import type { CreateUserUseCase } from "../../../../application/use-cases/CreateUserUseCase";

export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  public async create(request: Request, response: Response): Promise<void> {
    const user = await this.createUserUseCase.execute({
      name: String(request.body.name ?? ""),
      email: String(request.body.email ?? ""),
      password: String(request.body.password ?? "")
    });

    // Ao extrair o passwordHash aqui, ele "sobra" fora do safeUser
    // Não precisamos de void ou qualquer outra operação com ele.
    const { passwordHash, ...safeUser } = user.toJSON();

    response.status(HTTP_STATUS.CREATED).json(safeUser);
  }
}
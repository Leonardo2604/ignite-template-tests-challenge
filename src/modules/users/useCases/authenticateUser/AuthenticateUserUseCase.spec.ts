import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let userRepository: InMemoryUsersRepository;

describe('authenticate', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();

    authenticateUserUseCase = new AuthenticateUserUseCase(
      userRepository
    );
  })

  it('should be able to authenticate an user', async () => {
    const password = await hash('123', 8);

    const user = await userRepository.create({
      email: 'leonardo@gmail.com',
      name: 'leonardo',
      password
    });

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: '123'
    });

    expect(result).toHaveProperty('token');
    expect(result).toHaveProperty('user');
    expect(result.user.id).toBe(user.id);
  })
})

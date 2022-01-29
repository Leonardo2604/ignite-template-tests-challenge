import { compare } from "bcryptjs";
import { validate } from "uuid";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let userRepository: InMemoryUsersRepository;

describe('create user', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();

    createUserUseCase = new CreateUserUseCase(
      userRepository
    );
  })

  it('should be able to create an user', async () => {
    const data = {
      email: 'leonardo@gmail.com',
      name: 'leonardo',
      password: '123'
    }

    const user = await createUserUseCase.execute(data);

    expect(user).toHaveProperty('id');
    expect(true).toBe(validate(user.id as string));
    expect(user.email).toBe(data.email);
    expect(user.name).toBe(data.name);
    expect(true).toBe(await compare(data.password, user.password));
  })
})

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let userRepository: InMemoryUsersRepository;

describe('show user profile', () => {
  beforeEach(() => {
    userRepository = new InMemoryUsersRepository();

    showUserProfileUseCase = new ShowUserProfileUseCase(
      userRepository
    );
  })

  it('should be able to show an user profile', async () => {
    const data = {
      email: 'leonardo@gmail.com',
      name: 'leonardo',
      password: '123'
    }

    const user = await userRepository.create(data);

    const profile = await showUserProfileUseCase.execute(user.id as string);

    expect(profile).toEqual(user);
  })
})

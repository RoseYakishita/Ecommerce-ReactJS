import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
<<<<<<< HEAD
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {},
        },
      ],
=======
      providers: [UsersService],
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

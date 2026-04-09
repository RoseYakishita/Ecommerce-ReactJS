import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
<<<<<<< HEAD
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {},
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn() },
        },
      ],
=======
      providers: [AuthService],
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

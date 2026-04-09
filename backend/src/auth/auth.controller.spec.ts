import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
<<<<<<< HEAD
import { AuthService } from './auth.service';
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
<<<<<<< HEAD
      providers: [
        {
          provide: AuthService,
          useValue: {},
        },
      ],
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

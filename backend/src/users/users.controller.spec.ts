import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
<<<<<<< HEAD
import { UsersService } from './users.service';
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
<<<<<<< HEAD
      providers: [
        {
          provide: UsersService,
          useValue: {},
        },
      ],
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

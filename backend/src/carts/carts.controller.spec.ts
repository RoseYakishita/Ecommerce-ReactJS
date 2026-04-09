import { Test, TestingModule } from '@nestjs/testing';
import { CartsController } from './carts.controller';
<<<<<<< HEAD
import { CartsService } from './carts.service';
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344

describe('CartsController', () => {
  let controller: CartsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartsController],
<<<<<<< HEAD
      providers: [
        {
          provide: CartsService,
          useValue: {},
        },
      ],
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
    }).compile();

    controller = module.get<CartsController>(CartsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

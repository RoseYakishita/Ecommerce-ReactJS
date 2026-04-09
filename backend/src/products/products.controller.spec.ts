import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
<<<<<<< HEAD
import { ProductsService } from './products.service';
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344

describe('ProductsController', () => {
  let controller: ProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
<<<<<<< HEAD
      providers: [
        {
          provide: ProductsService,
          useValue: {},
        },
      ],
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

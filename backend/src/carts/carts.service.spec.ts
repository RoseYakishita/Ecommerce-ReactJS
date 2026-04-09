import { Test, TestingModule } from '@nestjs/testing';
import { CartsService } from './carts.service';
<<<<<<< HEAD
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsService } from '../products/products.service';
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344

describe('CartsService', () => {
  let service: CartsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [
        CartsService,
        {
          provide: getRepositoryToken(Cart),
          useValue: {},
        },
        {
          provide: getRepositoryToken(CartItem),
          useValue: {},
        },
        {
          provide: ProductsService,
          useValue: {},
        },
      ],
=======
      providers: [CartsService],
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
    }).compile();

    service = module.get<CartsService>(CartsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

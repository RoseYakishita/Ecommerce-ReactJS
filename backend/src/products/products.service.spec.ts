import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
<<<<<<< HEAD
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: {},
        },
      ],
=======
      providers: [ProductsService],
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

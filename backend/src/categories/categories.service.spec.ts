import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
<<<<<<< HEAD
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
<<<<<<< HEAD
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: {},
        },
      ],
=======
      providers: [CategoriesService],
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

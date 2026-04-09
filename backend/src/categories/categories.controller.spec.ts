import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
<<<<<<< HEAD
import { CategoriesService } from './categories.service';
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
<<<<<<< HEAD
      providers: [
        {
          provide: CategoriesService,
          useValue: {},
        },
      ],
=======
>>>>>>> 35a7c14142a8e3e8c898c99bb4a8ffdb59299344
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

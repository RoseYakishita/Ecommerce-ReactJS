import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoriesRepository.create(createCategoryDto);
    const saved = await this.categoriesRepository.save(category);
    this.logger.log(`[Category Audit] Created category #${saved.id} (${saved.name})`);
    return saved;
  }

  findAll() {
    return this.categoriesRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoriesRepository.findOne({ where: { id }, relations: ['products'] });
    if (!category) {
      throw new NotFoundException(`Category #${id} not found`);
    }
    return category;
  }

  async update(id: number, updateCategoryDto: Partial<CreateCategoryDto>) {
    const category = await this.findOne(id);
    Object.assign(category, updateCategoryDto);
    const saved = await this.categoriesRepository.save(category);
    this.logger.log(`[Category Audit] Updated category #${saved.id} (${saved.name})`);
    return saved;
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    this.logger.warn(`[Category Audit] Deleted category #${category.id} (${category.name})`);
    return this.categoriesRepository.remove(category);
  }
}

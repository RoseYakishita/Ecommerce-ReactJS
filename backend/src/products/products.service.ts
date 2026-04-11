import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productsRepository.create(createProductDto);
    const saved = await this.productsRepository.save(product);
    this.logger.log(`[Product Audit] Created product #${saved.id} (${saved.name})`);
    return saved;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    categoryId?: number,
    sort: string = 'featured',
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (search) {
      where.name = Like(`%${search}%`);
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    let order: any = { id: 'DESC' };
    if (sort === 'price-asc') order = { price: 'ASC' };
    if (sort === 'price-desc') order = { price: 'DESC' };
    if (sort === 'newest') order = { createdAt: 'DESC' };

    const [data, total] = await this.productsRepository.findAndCount({
      where,
      skip,
      take: limit,
      relations: ['category'],
      order,
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const product = await this.productsRepository.findOne({ 
      where: { id }, 
      relations: ['category']
    });
    
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    
    return product;
  }

  async update(id: number, updateProductDto: Partial<CreateProductDto>) {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    const saved = await this.productsRepository.save(product);
    this.logger.log(`[Product Audit] Updated product #${saved.id} (${saved.name})`);
    return saved;
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    this.logger.warn(`[Product Audit] Deleted product #${product.id} (${product.name})`);
    return this.productsRepository.remove(product);
  }
}

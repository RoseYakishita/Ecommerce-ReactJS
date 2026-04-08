import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = this.productsRepository.create(createProductDto);
    

    
    return this.productsRepository.save(product);
  }

  async findAll(page: number = 1, limit: number = 10, search?: string, categoryId?: number) {
    const skip = (page - 1) * limit;
    const where: any = {};
    
    if (search) {
      where.name = Like(`%${search}%`);
    }
    
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [data, total] = await this.productsRepository.findAndCount({
      where,
      skip,
      take: limit,
      relations: ['category'],
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit)
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
    return this.productsRepository.save(product);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    return this.productsRepository.remove(product);
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from './entities/wishlist-item.entity';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private readonly wishlistRepo: Repository<WishlistItem>,
  ) {}

  async list(userId: number) {
    return this.wishlistRepo.find({
      where: { userId },
      relations: ['product', 'product.category'],
      order: { createdAt: 'DESC' },
    });
  }

  async add(userId: number, productId: number) {
    if (!productId || Number.isNaN(productId)) {
      throw new BadRequestException('productId must be a number');
    }

    const existing = await this.wishlistRepo.findOne({ where: { userId, productId } });
    if (existing) return existing;

    const item = this.wishlistRepo.create({ userId, productId });
    return this.wishlistRepo.save(item);
  }

  async remove(userId: number, productId: number) {
    if (!productId || Number.isNaN(productId)) {
      throw new BadRequestException('productId must be a number');
    }

    const item = await this.wishlistRepo.findOne({ where: { userId, productId } });
    if (!item) throw new NotFoundException('Wishlist item not found');
    await this.wishlistRepo.remove(item);
    return { success: true };
  }
}

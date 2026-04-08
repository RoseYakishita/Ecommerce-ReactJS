import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { ProductsService } from '../products/products.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartsService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
    private productsService: ProductsService,
  ) {}

  async getCart(userId: number) {
    let cart = await this.cartsRepository.findOne({ 
      where: { userId }, 
      relations: ['items', 'items.product'] 
    });

    if (!cart) {
      cart = this.cartsRepository.create({ userId });
      cart = await this.cartsRepository.save(cart);
      cart.items = [];
    }
    return cart;
  }

  async addToCart(userId: number, addToCartDto: AddToCartDto) {
    const cart = await this.getCart(userId);
    const product = await this.productsService.findOne(addToCartDto.productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let existingItem = cart.items.find(item => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity += addToCartDto.quantity;
      await this.cartItemsRepository.save(existingItem);
    } else {
      const newItem = this.cartItemsRepository.create({
        cartId: cart.id,
        productId: product.id,
        quantity: addToCartDto.quantity,
      });
      await this.cartItemsRepository.save(newItem);
    }

    return this.getCart(userId);
  }

  async updateItemQuantity(userId: number, itemId: number, quantity: number) {
    const cart = await this.getCart(userId);
    const item = cart.items.find(i => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    item.quantity = quantity;
    await this.cartItemsRepository.save(item);
    return this.getCart(userId);
  }

  async removeItem(userId: number, itemId: number) {
    const cart = await this.getCart(userId);
    const item = cart.items.find(i => i.id === itemId);

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.cartItemsRepository.remove(item);
    return this.getCart(userId);
  }

  async clearCart(userId: number) {
    const cart = await this.getCart(userId);
    await this.cartItemsRepository.remove(cart.items);
    return { success: true };
  }
}

import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { WishlistService } from './wishlist.service';

@ApiTags('wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: 'Get current user wishlist' })
  list(@CurrentUser() user: any) {
    return this.wishlistService.list(user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add product to wishlist' })
  add(@CurrentUser() user: any, @Body('productId') productId: number) {
    return this.wishlistService.add(user.userId, Number(productId));
  }

  @Delete()
  @ApiOperation({ summary: 'Remove product from wishlist' })
  remove(@CurrentUser() user: any, @Body('productId') productId: number) {
    return this.wishlistService.remove(user.userId, Number(productId));
  }
}

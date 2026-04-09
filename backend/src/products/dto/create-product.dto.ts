import { IsString, IsNumber, IsOptional, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Nordic Sofa' })
  @IsString()
  name: string;

  @ApiProperty({ example: 899.00 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'Comfortable sofa' })
  @IsString()
  description: string;

  @ApiProperty({ example: ['image1.jpg'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiProperty({ example: 10, required: false })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({ example: '84" W x 35" D x 34" H', required: false })
  @IsString()
  @IsOptional()
  dimensions?: string;

  @ApiProperty({ example: 'Genuine Leather, Hardwood Frame', required: false })
  @IsString()
  @IsOptional()
  material?: string;


}

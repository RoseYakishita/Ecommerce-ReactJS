import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Sofas' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Comfortable living room sofas', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}

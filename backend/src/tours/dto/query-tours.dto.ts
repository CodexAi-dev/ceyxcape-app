import { IsOptional, IsString, IsIn, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryToursDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ enum: ['1-3', '4-7', '8-14', '15+'] })
  @IsOptional()
  @IsIn(['1-3', '4-7', '8-14', '15+'])
  duration?: string;

  @ApiPropertyOptional({ enum: ['0-500', '500-1000', '1000-2000', '2000+'] })
  @IsOptional()
  @IsIn(['0-500', '500-1000', '1000-2000', '2000+'])
  price?: string;

  @ApiPropertyOptional({ enum: ['featured', 'price_low', 'price_high', 'rating', 'newest'] })
  @IsOptional()
  @IsIn(['featured', 'price_low', 'price_high', 'rating', 'newest'])
  sort?: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 12;
}

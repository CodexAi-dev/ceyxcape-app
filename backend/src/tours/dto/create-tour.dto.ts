import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  IsArray,
  IsBoolean,
  IsIn,
  MaxLength,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Admin payload for creating a tour. Uses snake_case to match the public API
// shape; the service maps it to the (camelCase) entity columns.
export class CreateTourDto {
  @ApiProperty({ example: 'Sigiriya Rock Fortress' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({ example: 'CX-002' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  tour_code?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'Cultural' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;

  @ApiPropertyOptional({ example: 'Colombo' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  start_location?: string;

  @ApiPropertyOptional({ example: 'Sigiriya' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  location?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(0)
  duration?: number;

  @ApiPropertyOptional({ example: 130 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ example: 110 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discount_price?: number;

  @ApiPropertyOptional({ description: 'Main image filename' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  image?: string;

  @ApiPropertyOptional({ type: [String], description: 'Gallery image filenames' })
  @IsOptional()
  @IsArray()
  gallery?: string[];

  @ApiPropertyOptional({ description: 'Itinerary days' })
  @IsOptional()
  @IsArray()
  itinerary?: any[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  includes?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  excludes?: string[];

  @ApiPropertyOptional({ enum: ['active', 'inactive'] })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}

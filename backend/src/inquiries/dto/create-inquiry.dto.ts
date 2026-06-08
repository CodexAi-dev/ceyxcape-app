import {
  IsEmail,
  IsString,
  IsOptional,
  IsIn,
  IsInt,
  MinLength,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInquiryDto {
  @ApiPropertyOptional({ enum: ['general', 'tour'], default: 'general' })
  @IsOptional()
  @IsIn(['general', 'tour'])
  type?: 'general' | 'tour';

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MinLength(2)
  @MaxLength(150)
  name!: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: '+94771234567' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ example: 'Question about the Sigiriya tour' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  subject?: string;

  @ApiProperty({ example: 'I would like more details about this tour...' })
  @IsString()
  @MinLength(5)
  @MaxLength(2000)
  message!: string;

  // ── Tour context (optional) ──
  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  tour_id?: number;

  @ApiPropertyOptional({ example: 'Sigiriya Rock Fortress' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  tour_name?: string;

  @ApiPropertyOptional({ example: '2026-07-15' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  tour_date?: string;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  participants?: number;
}

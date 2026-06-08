import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateGalleryDto {
  @ApiPropertyOptional({ example: 'Sigiriya Rock Fortress' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ example: 'Heritage' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  category?: string;
}

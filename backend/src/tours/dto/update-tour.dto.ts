import { PartialType } from '@nestjs/swagger';
import { CreateTourDto } from './create-tour.dto';

// Every field optional for partial updates.
export class UpdateTourDto extends PartialType(CreateTourDto) {}

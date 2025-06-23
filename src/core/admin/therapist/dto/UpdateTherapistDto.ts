import { PartialType } from '@nestjs/swagger';
import { CreateTherapistDto } from './CreateTherapistDto';

export class UpdateTherapistDto extends PartialType(CreateTherapistDto) {}

import {
  IsUUID,
  IsOptional,
  IsDateString,
  IsString,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignAssessmentDto {
  @ApiProperty({
    description: 'Assessment ID to assign',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  assessmentId: string;

  @ApiProperty({
    description: 'Array of user IDs to assign the assessment to',
    example: [
      '550e8400-e29b-41d4-a716-446655440001',
      '550e8400-e29b-41d4-a716-446655440002',
    ],
  })
  @IsArray()
  @IsUUID('4', { each: true })
  userIds: string[];

  @ApiPropertyOptional({
    description: 'Due date for completing the assessment (ISO string)',
    example: '2024-01-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({
    description: 'Notes about this assignment',
    example: 'Focus on exploring technology career paths',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Priority level of this assignment',
    example: 'high',
  })
  @IsOptional()
  @IsString()
  priority?: string;
}

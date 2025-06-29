import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsArray,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';
import { QuestionnaireType } from '../../../../lib/enums';
import { Question, ScoringRule } from '../../../entities/Questionnaire.Entity';

export class CreateQuestionnaireDto {
  @ApiProperty({
    description: 'Title of the questionnaire',
    example: 'Patient Health Questionnaire-9 (PHQ-9)',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of the questionnaire',
    example:
      'A 9-question instrument for screening, diagnosing, monitoring and measuring the severity of depression.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Type of questionnaire',
    enum: QuestionnaireType,
    example: QuestionnaireType.PHQ9,
  })
  @IsEnum(QuestionnaireType)
  type: QuestionnaireType;

  @ApiProperty({
    description: 'Version of the questionnaire',
    example: '1.0',
    required: false,
  })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiProperty({
    description: 'Array of questions in the questionnaire',
    type: 'array',
    items: {
      type: 'object',
    },
  })
  @IsArray()
  questions: Question[];

  @ApiProperty({
    description: 'Scoring rules for the questionnaire',
    type: 'array',
    items: {
      type: 'object',
    },
  })
  @IsArray()
  scoringRules: ScoringRule[];

  @ApiProperty({
    description: 'Instructions for taking the questionnaire',
    example:
      'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
    required: false,
  })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiProperty({
    description: 'Estimated time to complete in minutes',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  estimatedTimeMinutes?: number;

  @ApiProperty({
    description: 'Whether the questionnaire is currently active',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({
    description: 'Whether the questionnaire is published',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiProperty({
    description: 'Additional metadata for the questionnaire',
    required: false,
  })
  @IsOptional()
  metadata?: Record<string, any>;
}

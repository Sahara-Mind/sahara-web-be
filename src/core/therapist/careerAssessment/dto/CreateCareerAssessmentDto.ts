import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsNumber,
  IsBoolean,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  QuestionType,
  AssessmentStatus,
} from '../../../entities/CareerAssessment.Entity';

export class CreateQuestionDto {
  @ApiProperty({
    description: 'Question text',
    example: 'What are your primary career interests?',
  })
  @IsString()
  question: string;

  @ApiProperty({
    description: 'Type of question',
    enum: QuestionType,
    example: QuestionType.MULTIPLE_CHOICE,
  })
  @IsEnum(QuestionType)
  type: QuestionType;

  @ApiPropertyOptional({
    description: 'Options for multiple choice questions',
    example: ['Technology', 'Healthcare', 'Education', 'Business'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @ApiProperty({
    description: 'Whether this question is required',
    example: true,
  })
  @IsBoolean()
  required: boolean;

  @ApiProperty({
    description: 'Order of the question in the assessment',
    example: 1,
  })
  @IsNumber()
  @Min(1)
  order: number;

  @ApiPropertyOptional({
    description: 'Category of the question',
    example: 'career_goals',
  })
  @IsOptional()
  @IsString()
  category?: string;
}

export class CreateCareerAssessmentDto {
  @ApiProperty({
    description: 'Title of the assessment',
    example: 'Career Path Discovery Assessment',
  })
  @IsString()
  title: string;

  @ApiPropertyOptional({
    description: 'Description of the assessment',
    example: 'This assessment helps identify your career interests and goals',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'Instructions for taking the assessment',
    example: 'Please answer all questions honestly and thoughtfully',
  })
  @IsOptional()
  @IsString()
  instructions?: string;

  @ApiProperty({
    description: 'Array of questions in the assessment',
    type: [CreateQuestionDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[];

  @ApiPropertyOptional({
    description: 'Status of the assessment',
    enum: AssessmentStatus,
    default: AssessmentStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(AssessmentStatus)
  status?: AssessmentStatus;

  @ApiPropertyOptional({
    description: 'Estimated time to complete in minutes',
    example: 30,
  })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(180)
  estimatedTimeMinutes?: number;

  @ApiPropertyOptional({
    description: 'Categories covered in this assessment',
    example: ['career_goals', 'life_goals', 'skills'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @ApiPropertyOptional({
    description: 'Tags for organizing assessments',
    example: ['career', 'development', 'goals'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

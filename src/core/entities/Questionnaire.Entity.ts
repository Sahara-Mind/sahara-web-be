import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { QuestionnaireType, QuestionType } from '../../lib/enums';

export interface QuestionOption {
  value: number | string;
  label: string;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: QuestionOption[];
  required: boolean;
  minValue?: number;
  maxValue?: number;
}

export interface ScoringRule {
  condition: string;
  range: {
    min: number;
    max: number;
  };
  interpretation: string;
  severity?: string;
}

@Entity('questionnaires')
export class Questionnaire {
  @ApiProperty({
    description: 'Unique identifier for the questionnaire',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Title of the questionnaire',
    example: 'Patient Health Questionnaire-9 (PHQ-9)',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Description of the questionnaire',
    example:
      'A 9-question instrument for screening, diagnosing, monitoring and measuring the severity of depression.',
  })
  @Column('text')
  description: string;

  @ApiProperty({
    description: 'Type of questionnaire',
    enum: QuestionnaireType,
    example: QuestionnaireType.PHQ9,
  })
  @Column({
    type: 'enum',
    enum: QuestionnaireType,
    default: QuestionnaireType.CUSTOM,
  })
  type: QuestionnaireType;

  @ApiProperty({
    description: 'Version of the questionnaire',
    example: '1.0',
  })
  @Column({ default: '1.0' })
  version: string;

  @ApiProperty({
    description: 'Array of questions in the questionnaire',
    type: 'array',
    items: {
      type: 'object',
    },
  })
  @Column('jsonb')
  questions: Question[];

  @ApiProperty({
    description: 'Scoring rules for the questionnaire',
    type: 'array',
    items: {
      type: 'object',
    },
  })
  @Column('jsonb')
  scoringRules: ScoringRule[];

  @ApiProperty({
    description: 'Instructions for taking the questionnaire',
    example:
      'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
  })
  @Column('text', { nullable: true })
  instructions?: string;

  @ApiProperty({
    description: 'Estimated time to complete in minutes',
    example: 5,
  })
  @Column({ nullable: true })
  estimatedTimeMinutes?: number;

  @ApiProperty({
    description: 'Whether the questionnaire is currently active',
    example: true,
  })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({
    description: 'Whether the questionnaire is published',
    example: true,
  })
  @Column({ default: false })
  isPublished: boolean;

  @ApiProperty({
    description: 'Additional metadata for the questionnaire',
    required: false,
  })
  @Column('jsonb', { nullable: true })
  metadata?: Record<string, any>;

  @ApiProperty({
    description: 'Questionnaire creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Questionnaire last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}

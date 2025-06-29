import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Therapist } from './Therapist.Entity';

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  SINGLE_CHOICE = 'single_choice',
  TEXT = 'text',
  SCALE = 'scale',
  YES_NO = 'yes_no',
}

export enum AssessmentStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[]; // For multiple choice questions
  required: boolean;
  order: number;
  category?: string; // e.g., 'career_goals', 'life_goals', 'skills', 'interests'
}

@Entity('career_assessments')
@Index(['therapistId', 'status'])
export class CareerAssessment {
  @ApiProperty({
    description: 'Unique identifier for the career assessment',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Title of the assessment',
    example: 'Career Path Discovery Assessment',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Description of the assessment',
    example: 'This assessment helps identify your career interests and goals',
  })
  @Column('text', { nullable: true })
  description: string;

  @ApiProperty({
    description: 'Instructions for taking the assessment',
    example: 'Please answer all questions honestly and thoughtfully',
  })
  @Column('text', { nullable: true })
  instructions: string;

  @ApiProperty({
    description: 'Therapist ID who created the assessment',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column('uuid')
  therapistId: string;

  @ApiProperty({
    description: 'Therapist who created the assessment',
    type: () => Therapist,
  })
  @ManyToOne(() => Therapist, { eager: true })
  therapist: Therapist;

  @ApiProperty({
    description: 'Array of structured questions',
    example: [
      {
        id: 'q1',
        question: 'What are your primary career goals for the next 5 years?',
        type: 'text',
        required: true,
        order: 1,
        category: 'career_goals',
      },
    ],
  })
  @Column('json')
  questions: AssessmentQuestion[];

  @ApiProperty({
    description: 'Status of the assessment',
    enum: AssessmentStatus,
    example: AssessmentStatus.ACTIVE,
  })
  @Column({
    type: 'enum',
    enum: AssessmentStatus,
    default: AssessmentStatus.DRAFT,
  })
  status: AssessmentStatus;

  @ApiProperty({
    description: 'Estimated time to complete in minutes',
    example: 30,
  })
  @Column('int', { nullable: true })
  estimatedTimeMinutes: number;

  @ApiProperty({
    description: 'Categories covered in this assessment',
    example: ['career_goals', 'life_goals', 'skills'],
  })
  @Column('json', { nullable: true })
  categories: string[];

  @ApiProperty({
    description: 'Tags for organizing assessments',
    example: ['career', 'development', 'goals'],
  })
  @Column('json', { nullable: true })
  tags: string[];

  @ApiProperty({
    description: 'Assessment creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Assessment last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}

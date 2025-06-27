import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Index,
  Unique,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { CareerAssessment } from './CareerAssessment.Entity';
import { User } from './User.Entity';
import { Therapist } from './Therapist.Entity';

export enum AssignmentStatus {
  ASSIGNED = 'assigned',
  STARTED = 'started',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
}

@Entity('career_assessment_assignments')
@Index(['userId', 'status'])
@Index(['therapistId', 'status'])
@Index(['assessmentId', 'status'])
@Unique(['assessmentId', 'userId']) // One assignment per user per assessment
export class CareerAssessmentAssignment {
  @ApiProperty({
    description: 'Unique identifier for the assignment',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Assessment ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column('uuid')
  assessmentId: string;

  @ApiProperty({
    description: 'Career assessment details',
    type: () => CareerAssessment,
  })
  @ManyToOne(() => CareerAssessment, { eager: true })
  assessment: CareerAssessment;

  @ApiProperty({
    description: 'User ID who is assigned the assessment',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column('uuid')
  userId: string;

  @ApiProperty({
    description: 'User who is assigned the assessment',
    type: () => User,
  })
  @ManyToOne(() => User, { eager: true })
  user: User;

  @ApiProperty({
    description: 'Therapist who assigned the assessment',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @Column('uuid')
  therapistId: string;

  @ApiProperty({
    description: 'Therapist details',
    type: () => Therapist,
  })
  @ManyToOne(() => Therapist, { eager: true })
  therapist: Therapist;

  @ApiProperty({
    description: 'Status of the assignment',
    enum: AssignmentStatus,
    example: AssignmentStatus.ASSIGNED,
  })
  @Column({
    type: 'enum',
    enum: AssignmentStatus,
    default: AssignmentStatus.ASSIGNED,
  })
  status: AssignmentStatus;

  @ApiProperty({
    description: 'Due date for completing the assessment',
    example: '2024-01-31T23:59:59.000Z',
  })
  @Column('timestamp', { nullable: true })
  dueDate: Date;

  @ApiProperty({
    description: 'Date when user started the assessment',
    example: '2024-01-15T10:30:00.000Z',
  })
  @Column('timestamp', { nullable: true })
  startedAt: Date;

  @ApiProperty({
    description: 'Date when user completed the assessment',
    example: '2024-01-16T14:45:00.000Z',
  })
  @Column('timestamp', { nullable: true })
  completedAt: Date;

  @ApiProperty({
    description: 'Notes from therapist about this assignment',
    example: 'Focus on exploring technology career paths',
  })
  @Column('text', { nullable: true })
  notes: string;

  @ApiProperty({
    description: 'Priority level of this assignment',
    example: 'high',
  })
  @Column({ nullable: true })
  priority: string;

  @ApiProperty({
    description: 'Assignment creation timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Assignment last update timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}

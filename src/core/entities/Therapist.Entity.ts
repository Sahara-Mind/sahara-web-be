import { TherapistSpecialization } from '../../lib/enums/TherapistEnum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('therapists')
export class Therapist {
  @ApiProperty({
    description: 'Unique identifier for the therapist',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Therapist first name',
    example: 'Dr. John',
  })
  @Column()
  firstName: string;

  @ApiProperty({
    description: 'Therapist last name',
    example: 'Smith',
  })
  @Column()
  lastName: string;

  @ApiProperty({
    description: 'Therapist email address (unique)',
    example: 'john.smith@therapy.com',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Therapist specialization',
    enum: TherapistSpecialization,
    example: TherapistSpecialization.PSYCHOLOGIST,
  })
  @Column({
    type: 'enum',
    enum: TherapistSpecialization,
  })
  specialization: TherapistSpecialization;

  @ApiProperty({
    description: 'Therapist phone number',
    example: '+1234567890',
    required: false,
  })
  @Column({ nullable: true })
  phoneNumber: string;

  @ApiProperty({
    description: 'Therapist gender',
    example: 'Male',
    required: false,
  })
  @Column({ nullable: true })
  gender: string;

  @ApiProperty({
    description: 'Languages spoken by therapist',
    example: ['English', 'Spanish'],
    type: [String],
    required: false,
  })
  @Column('text', { array: true, nullable: true })
  languages: string[];

  @ApiProperty({
    description: 'Years of experience',
    example: 5,
    default: 0,
  })
  @Column({ type: 'int', default: 0 })
  yearsOfExperience: number;

  @ApiProperty({
    description: 'Therapist creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Therapist last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Therapist } from './Therapist.Entity';
import { User } from './User.Entity';

@Entity('appointments')
export class Appointment {
  @ApiProperty({
    description: 'Unique identifier for the appointment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'User ID for the appointment',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @Column({ type: 'varchar', nullable: false })
  userId: string;

  @ApiProperty({
    description: 'User details for the appointment',
    type: User,
  })
  @ManyToOne(() => User, { eager: true })
  user: User;

  @ApiProperty({
    description: 'Therapist ID for the appointment',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  @Column({ type: 'varchar', nullable: false })
  therapistId: string;

  @ApiProperty({
    description: 'Therapist details for the appointment',
    type: Therapist,
  })
  @ManyToOne(() => Therapist, {
    eager: true,
  })
  therapist: Therapist;

  @ApiProperty({
    description: 'Appointment date',
    example: '2023-12-25',
  })
  @Column()
  appointmentDate: Date;

  @ApiProperty({
    description: 'Appointment start time',
    example: '09:00',
  })
  @Column({ type: 'time' })
  startTime: string;

  @ApiProperty({
    description: 'Appointment end time',
    example: '10:00',
  })
  @Column({ type: 'time' })
  endTime: string;

  @ApiProperty({
    description: 'Appointment creation timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Appointment last update timestamp',
    example: '2023-01-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}

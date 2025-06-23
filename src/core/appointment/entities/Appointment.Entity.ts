import { Therapist } from '../../../core/therapist/entities/Therapist.Entity';
import { User } from '../../../core/user/entities/User.Entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  userId: string;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @Column({ type: 'varchar', nullable: false })
  therapistId: string;

  @ManyToOne(() => Therapist, {
    eager: true,
  })
  therapist: Therapist;

  @Column()
  appointmentDate: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

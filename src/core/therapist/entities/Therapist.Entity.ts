import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TherapistSpecialization } from './TherapistEnum';

@Entity('therapists')
export class Therapist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: TherapistSpecialization,
  })
  specialization: TherapistSpecialization;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  gender: string;

  @Column('text', { array: true, nullable: true })
  languages: string[];

  @Column({ type: 'int', default: 0 })
  yearsOfExperience: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

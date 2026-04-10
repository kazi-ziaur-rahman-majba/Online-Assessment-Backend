import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Exam } from '../../exams/entities/exam.entity';
import { Submission } from '../../submissions/entities/submission.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['employer', 'candidate'] })
  role: 'employer' | 'candidate';

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Exam, (exam) => exam.employer)
  exams: Exam[];

  @OneToMany(() => Submission, (submission) => submission.candidate)
  submissions: Submission[];
}

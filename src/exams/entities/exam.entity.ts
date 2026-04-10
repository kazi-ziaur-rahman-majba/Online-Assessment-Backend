import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Question } from './question.entity';
import { Submission } from '../../submissions/entities/submission.entity';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ default: 0 })
  totalCandidates: number;

  @Column({ default: 0 })
  totalSlots: number;

  @Column({ default: 0 })
  questionSets: number;

  @Column({ nullable: true })
  questionType: string;

  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ type: 'int', default: 60 })
  duration: number; // in minutes

  @Column({ default: false })
  negativeMarking: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.exams, { onDelete: 'CASCADE' })
  employer: User;

  @OneToMany(() => Question, (question) => question.exam, { cascade: true })
  questions: Question[];

  @OneToMany(() => Submission, (submission) => submission.exam)
  submissions: Submission[];
}

import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Exam } from '../../exams/entities/exam.entity';
import { User } from '../../users/entities/user.entity';
import { Answer } from './answer.entity';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isAutoSubmit: boolean;

  @CreateDateColumn()
  submittedAt: Date;

  @ManyToOne(() => Exam, (exam) => exam.submissions, { onDelete: 'CASCADE' })
  exam: Exam;

  @ManyToOne(() => User, (user) => user.submissions, { onDelete: 'CASCADE' })
  candidate: User;

  @OneToMany(() => Answer, (answer) => answer.submission, { cascade: true })
  answers: Answer[];
}

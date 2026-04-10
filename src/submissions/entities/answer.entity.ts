import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Submission } from './submission.entity';
import { Question } from '../../exams/entities/question.entity';
import { Option } from '../../exams/entities/option.entity';

@Entity('answers')
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'text' })
  answerText: string;

  @ManyToOne(() => Submission, (submission) => submission.answers, { onDelete: 'CASCADE' })
  submission: Submission;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  question: Question;

  @ManyToMany(() => Option)
  @JoinTable()
  selectedOptions: Option[];
}

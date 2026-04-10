import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Exam } from './exam.entity';
import { Option } from './option.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'enum', enum: ['radio', 'checkbox', 'text'] })
  type: 'radio' | 'checkbox' | 'text';

  @ManyToOne(() => Exam, (exam) => exam.questions, { onDelete: 'CASCADE' })
  exam: Exam;

  @OneToMany(() => Option, (option) => option.question, { cascade: true })
  options: Option[];
}

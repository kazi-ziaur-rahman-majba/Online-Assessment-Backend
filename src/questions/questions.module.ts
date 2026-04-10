import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { Question } from '../exams/entities/question.entity';
import { Option } from '../exams/entities/option.entity';
import { Exam } from '../exams/entities/exam.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Question, Option, Exam])],
  controllers: [QuestionsController],
  providers: [QuestionsService],
})
export class QuestionsModule {}

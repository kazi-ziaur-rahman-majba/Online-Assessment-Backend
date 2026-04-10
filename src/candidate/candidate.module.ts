import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CandidateService } from './candidate.service';
import { CandidateController } from './candidate.controller';
import { Exam } from '../exams/entities/exam.entity';
import { Question } from '../exams/entities/question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, Question])],
  controllers: [CandidateController],
  providers: [CandidateService],
})
export class CandidateModule {}

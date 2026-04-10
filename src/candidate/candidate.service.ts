import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Exam } from '../exams/entities/exam.entity';
import { Question } from '../exams/entities/question.entity';

@Injectable()
export class CandidateService {
  constructor(
    @InjectRepository(Exam) private examRepo: Repository<Exam>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
  ) {}

  async getActiveExams() {
    const now = new Date();
    return this.examRepo.find({
      where: {
        startTime: LessThanOrEqual(now),
        endTime: MoreThanOrEqual(now),
      },
      select: ['id', 'title', 'duration', 'questionSets', 'negativeMarking', 'startTime', 'endTime'],
      order: { createdAt: 'DESC' },
    });
  }

  async getExamQuestions(examId: string) {
    const now = new Date();
    const exam = await this.examRepo.findOne({
      where: {
        id: examId,
        startTime: LessThanOrEqual(now),
        endTime: MoreThanOrEqual(now),
      },
    });

    if (!exam) throw new BadRequestException('Exam not found or is not currently active');

    const questions = await this.questionRepo.find({
      where: { exam: { id: examId } },
      relations: ['options'],
    });

    return questions.map(q => {
      const qObj = q;
      qObj.options = qObj.options.map(opt => {
        const { isCorrect, ...rest } = opt;
        return rest as any;
      });
      return qObj;
    });
  }
}

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { Answer } from './entities/answer.entity';
import { Exam } from '../exams/entities/exam.entity';
import { Question } from '../exams/entities/question.entity';
import { Option } from '../exams/entities/option.entity';
import { CreateSubmissionDto } from './dto/submission.dto';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission) private submissionRepo: Repository<Submission>,
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
    @InjectRepository(Exam) private examRepo: Repository<Exam>,
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Option) private optionRepo: Repository<Option>,
  ) {}

  async create(createSubmissionDto: CreateSubmissionDto, candidateId: string) {
    const { examId, isAutoSubmit, answers } = createSubmissionDto;
    const now = new Date();
    
    // check if exam is active
    const exam = await this.examRepo.findOne({
      where: {
        id: examId,
        startTime: LessThanOrEqual(now),
        endTime: MoreThanOrEqual(now),
      },
    });

    if (!exam) throw new BadRequestException('Exam is not active');

    // check multiple submission
    const existing = await this.submissionRepo.findOne({
      where: { exam: { id: examId }, candidate: { id: candidateId } },
    });
    if (existing) throw new BadRequestException('You have already submitted this exam');

    // Make submission
    const submission = this.submissionRepo.create({
      exam: { id: examId },
      candidate: { id: candidateId },
      isAutoSubmit,
    });
    
    const savedSubmission = await this.submissionRepo.save(submission);

    // Make answers
    const answersToSave: Answer[] = [];
    for (const ans of answers) {
      const answerEnt = this.answerRepo.create({
        submission: { id: savedSubmission.id },
        question: { id: ans.questionId },
        answerText: ans.answerText,
      });

      if (ans.selectedOptionIds && ans.selectedOptionIds.length > 0) {
        answerEnt.selectedOptions = ans.selectedOptionIds.map(oId => ({ id: oId })) as any;
      }
      answersToSave.push(answerEnt);
    }
    
    await this.answerRepo.save(answersToSave);

    return {
      submissionId: savedSubmission.id,
      submittedAt: savedSubmission.submittedAt,
      isAutoSubmit: savedSubmission.isAutoSubmit,
    };
  }

  async getMySubmissions(candidateId: string) {
    return this.submissionRepo.find({
      where: { candidate: { id: candidateId } },
      relations: ['exam'],
      select: {
        id: true,
        submittedAt: true,
        isAutoSubmit: true,
        exam: {
          id: true,
          title: true,
        },
      },
    });
  }
}

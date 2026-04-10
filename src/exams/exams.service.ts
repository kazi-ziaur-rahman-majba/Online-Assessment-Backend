import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './entities/exam.entity';
import { Submission } from '../submissions/entities/submission.entity';
import { CreateExamDto, UpdateExamDto } from './dto/exam.dto';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(Submission)
    private submissionRepository: Repository<Submission>,
  ) {}

  async findAll(employerId: string) {
    return this.examRepository.find({
      where: { employer: { id: employerId } },
      select: ['id', 'title', 'totalCandidates', 'questionSets', 'totalSlots', 'duration', 'startTime', 'endTime'],
    });
  }

  async create(createExamDto: CreateExamDto, employerId: string) {
    const exam = this.examRepository.create({
      ...createExamDto,
      employer: { id: employerId },
    });
    return this.examRepository.save(exam);
  }

  async findOne(id: string, employerId: string) {
    const exam = await this.examRepository.findOne({
      where: { id },
      relations: ['employer', 'questions', 'questions.options'],
    });
    if (!exam) throw new NotFoundException('Exam not found');
    if (exam.employer.id !== employerId) throw new ForbiddenException('You do not own this exam');
    return exam;
  }

  async update(id: string, updateExamDto: UpdateExamDto, employerId: string) {
    const exam = await this.findOne(id, employerId);
    Object.assign(exam, updateExamDto);
    return this.examRepository.save(exam);
  }

  async remove(id: string, employerId: string) {
    const exam = await this.findOne(id, employerId);
    return this.examRepository.remove(exam);
  }

  async getCandidates(id: string, employerId: string) {
    // verify ownership
    await this.findOne(id, employerId);
    
    return this.submissionRepository.find({
      where: { exam: { id } },
      relations: ['candidate'],
      select: {
        id: true,
        submittedAt: true,
        isAutoSubmit: true,
        candidate: {
          id: true,
          name: true,
          email: true,
        },
      },
    });
  }
}

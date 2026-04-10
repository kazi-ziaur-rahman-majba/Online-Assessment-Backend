import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../exams/entities/question.entity';
import { Option } from '../exams/entities/option.entity';
import { Exam } from '../exams/entities/exam.entity';
import { CreateQuestionDto } from './dto/question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    @InjectRepository(Option) private optionRepo: Repository<Option>,
    @InjectRepository(Exam) private examRepo: Repository<Exam>,
  ) {}

  async create(examId: string, createQuestionDto: CreateQuestionDto, employerId: string) {
    const exam = await this.examRepo.findOne({ where: { id: examId }, relations: ['employer'] });
    if (!exam) throw new NotFoundException('Exam not found');
    if (exam.employer.id !== employerId) throw new ForbiddenException('Not your exam');

    if (['radio', 'checkbox'].includes(createQuestionDto.type) && (!createQuestionDto.options || createQuestionDto.options.length === 0)) {
      throw new BadRequestException('Options are required for radio/checkbox questions');
    }

    const question = this.questionRepo.create({
      title: createQuestionDto.title,
      type: createQuestionDto.type,
      exam: { id: examId },
    });
    
    const savedQuestion = await this.questionRepo.save(question);

    if (createQuestionDto.options && createQuestionDto.options.length > 0) {
      const options = createQuestionDto.options.map((opt) => 
        this.optionRepo.create({ text: opt.text, isCorrect: opt.isCorrect, question: { id: savedQuestion.id } })
      );
      await this.optionRepo.save(options);
    }
    
    return this.questionRepo.findOne({ where: { id: savedQuestion.id }, relations: ['options'] });
  }

  async verifyQuestionOwnership(questionId: string, employerId: string) {
    const question = await this.questionRepo.findOne({ where: { id: questionId }, relations: ['exam', 'exam.employer', 'options'] });
    if (!question) throw new NotFoundException('Question not found');
    if (question.exam.employer.id !== employerId) throw new ForbiddenException('Not your question');
    return question;
  }

  async update(id: string, updateQuestionDto: CreateQuestionDto, employerId: string) {
    const question = await this.verifyQuestionOwnership(id, employerId);
    
    question.title = updateQuestionDto.title;
    question.type = updateQuestionDto.type;
    await this.questionRepo.save(question);

    // Replace options: simple way is to delete old and insert new.
    await this.optionRepo.delete({ question: { id } });

    if (updateQuestionDto.options && updateQuestionDto.options.length > 0) {
      const options = updateQuestionDto.options.map((opt) => 
        this.optionRepo.create({ text: opt.text, isCorrect: opt.isCorrect, question: { id } })
      );
      await this.optionRepo.save(options);
    }

    return this.questionRepo.findOne({ where: { id }, relations: ['options'] });
  }

  async remove(id: string, employerId: string) {
    const question = await this.verifyQuestionOwnership(id, employerId);
    return this.questionRepo.remove(question);
  }
}

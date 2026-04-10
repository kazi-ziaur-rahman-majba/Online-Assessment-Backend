import { Controller, Get, Param } from '@nestjs/common';
import { CandidateService } from './candidate.service';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('candidate/exams')
@Roles('candidate')
export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  @Get()
  getActiveExams() {
    return this.candidateService.getActiveExams();
  }

  @Get(':id/questions')
  getExamQuestions(@Param('id') id: string) {
    return this.candidateService.getExamQuestions(id);
  }
}

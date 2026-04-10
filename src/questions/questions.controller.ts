import { Controller, Post, Body, Put, Param, Delete, Req } from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/question.dto';
import { Roles } from '../common/decorators/roles.decorator';

@Controller()
@Roles('employer')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post('exams/:examId/questions')
  create(@Param('examId') examId: string, @Body() createQuestionDto: CreateQuestionDto, @Req() req) {
    return this.questionsService.create(examId, createQuestionDto, req.user.id);
  }

  @Put('questions/:id')
  update(@Param('id') id: string, @Body() updateQuestionDto: CreateQuestionDto, @Req() req) {
    return this.questionsService.update(id, updateQuestionDto, req.user.id);
  }

  @Delete('questions/:id')
  remove(@Param('id') id: string, @Req() req) {
    return this.questionsService.remove(id, req.user.id);
  }
}

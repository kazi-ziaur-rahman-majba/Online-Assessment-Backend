import { Controller, Get, Post, Body, Put, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { CreateExamDto, UpdateExamDto } from './dto/exam.dto';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('exams')
@Roles('employer')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  findAll(@Req() req) {
    return this.examsService.findAll(req.user.id);
  }

  @Post()
  create(@Body() createExamDto: CreateExamDto, @Req() req) {
    return this.examsService.create(createExamDto, req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.examsService.findOne(id, req.user.id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto, @Req() req) {
    return this.examsService.update(id, updateExamDto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.examsService.remove(id, req.user.id);
  }

  @Get(':id/candidates')
  getCandidates(@Param('id') id: string, @Req() req) {
    return this.examsService.getCandidates(id, req.user.id);
  }
}

import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/submission.dto';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('submissions')
@Roles('candidate')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  create(@Body() createSubmissionDto: CreateSubmissionDto, @Req() req) {
    return this.submissionsService.create(createSubmissionDto, req.user.id);
  }

  @Get('my')
  getMySubmissions(@Req() req) {
    return this.submissionsService.getMySubmissions(req.user.id);
  }
}

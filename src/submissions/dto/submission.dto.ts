import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerDto {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsOptional()
  answerText?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  selectedOptionIds?: string[];
}

export class CreateSubmissionDto {
  @IsString()
  @IsNotEmpty()
  examId: string;

  @IsBoolean()
  isAutoSubmit: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}

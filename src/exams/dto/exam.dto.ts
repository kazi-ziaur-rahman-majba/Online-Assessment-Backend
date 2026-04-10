import { IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateExamDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  totalCandidates: number;

  @IsInt()
  totalSlots: number;

  @IsInt()
  questionSets: number;

  @IsString()
  @IsOptional()
  questionType?: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsInt()
  duration: number;

  @IsBoolean()
  @IsOptional()
  negativeMarking?: boolean;
}

export class UpdateExamDto {
  @IsString()
  @IsOptional()
  title?: string;
  @IsInt()
  @IsOptional()
  totalCandidates?: number;
  @IsInt()
  @IsOptional()
  totalSlots?: number;
  @IsInt()
  @IsOptional()
  questionSets?: number;
  @IsString()
  @IsOptional()
  questionType?: string;
  @IsDateString()
  @IsOptional()
  startTime?: string;
  @IsDateString()
  @IsOptional()
  endTime?: string;
  @IsInt()
  @IsOptional()
  duration?: number;
  @IsBoolean()
  @IsOptional()
  negativeMarking?: boolean;
}

import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ExamsModule } from './exams/exams.module';
import { QuestionsModule } from './questions/questions.module';
import { CandidateModule } from './candidate/candidate.module';
import { SubmissionsModule } from './submissions/submissions.module';

import { User } from './users/entities/user.entity';
import { Exam } from './exams/entities/exam.entity';
import { Question } from './exams/entities/question.entity';
import { Option } from './exams/entities/option.entity';
import { Submission } from './submissions/entities/submission.entity';
import { Answer } from './submissions/entities/answer.entity';

import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        entities: [User, Exam, Question, Option, Submission, Answer],
        synchronize: true,
        ssl: { rejectUnauthorized: false }, 
      }),
    }),
    UsersModule,
    AuthModule,
    ExamsModule,
    QuestionsModule,
    CandidateModule,
    SubmissionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}

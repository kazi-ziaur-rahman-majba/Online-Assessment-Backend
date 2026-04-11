import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './users/entities/user.entity';
import { Exam } from './exams/entities/exam.entity';
import { Question } from './exams/entities/question.entity';
import { Option } from './exams/entities/option.entity';
import { Submission } from './submissions/entities/submission.entity';
import { Answer } from './submissions/entities/answer.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  try {
    const passwordHash = await bcrypt.hash('123456', 10);

    console.log('Checking for existing employer...');
    let employer = await dataSource.manager.findOne(User, {
      where: { email: 'employer@example.com' },
    });
    if (!employer) {
      console.log('Seeding employer...');
      employer = new User();
      employer.name = 'Employer User';
      employer.email = 'employer@example.com';
      employer.password = passwordHash;
      employer.role = 'employer';
      await dataSource.manager.save(employer);
    } else {
      console.log('Employer already exists, skipping...');
    }

    console.log('Checking for existing candidate...');
    let candidate = await dataSource.manager.findOne(User, {
      where: { email: 'candidate@example.com' },
    });
    if (!candidate) {
      console.log('Seeding candidate...');
      candidate = new User();
      candidate.name = 'Candidate User';
      candidate.email = 'candidate@example.com';
      candidate.password = passwordHash;
      candidate.role = 'candidate';
      await dataSource.manager.save(candidate);
    } else {
      console.log('Candidate already exists, skipping...');
    }

    console.log('Seeding Candidate Two...');
    const existingCandidateTwo = await dataSource.manager.findOne(User, {
      where: { email: 'candidatetwo@gmail.com' },
    });
    if (!existingCandidateTwo) {
      const candidateTwo = new User();
      candidateTwo.name = 'Candidate Two';
      candidateTwo.email = 'candidatetwo@gmail.com';
      candidateTwo.password = passwordHash;
      candidateTwo.role = 'candidate';
      await dataSource.manager.save(candidateTwo);
      console.log('Created Candidate Two');
    } else {
      console.log('Candidate Two already exists, skipping...');
    }

    console.log('Seeding exam...');
    const existingExam = await dataSource.manager.findOne(Exam, {
      where: { title: 'General Knowledge Test' },
    });
    if (!existingExam) {
      const exam = new Exam();
      exam.title = 'General Knowledge Test';
      exam.totalCandidates = 100;
      exam.totalSlots = 50;
      exam.questionSets = 1;
      exam.questionType = 'mixed';
      exam.startTime = new Date();
      exam.endTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      exam.duration = 60;
      exam.negativeMarking = true;
      exam.employer = employer;
      await dataSource.manager.save(exam);

      console.log('Seeding questions & options...');
      const q1 = new Question();
      q1.title = 'What is the capital of France?';
      q1.type = 'radio';
      q1.exam = exam;
      await dataSource.manager.save(q1);

      const opt1 = new Option();
      opt1.text = 'London';
      opt1.isCorrect = false;
      opt1.question = q1;

      const opt2 = new Option();
      opt2.text = 'Paris';
      opt2.isCorrect = true;
      opt2.question = q1;

      await dataSource.manager.save([opt1, opt2]);

      const q2 = new Question();
      q2.title = 'Select prime numbers';
      q2.type = 'checkbox';
      q2.exam = exam;
      await dataSource.manager.save(q2);

      const opt3 = new Option();
      opt3.text = '2';
      opt3.isCorrect = true;
      opt3.question = q2;

      const opt4 = new Option();
      opt4.text = '4';
      opt4.isCorrect = false;
      opt4.question = q2;

      await dataSource.manager.save([opt3, opt4]);

      const q3 = new Question();
      q3.title = 'Explain the process of photosynthesis.';
      q3.type = 'text';
      q3.exam = exam;
      await dataSource.manager.save(q3);

      console.log('Seeding submission & answers...');
      const existingSubmission = await dataSource.manager.findOne(Submission, {
        where: { exam: { id: exam.id }, candidate: { id: candidate.id } },
      });
      if (!existingSubmission) {
        const submission = new Submission();
        submission.exam = exam;
        submission.candidate = candidate;
        submission.isAutoSubmit = false;
        await dataSource.manager.save(submission);

        const answer1 = new Answer();
        answer1.submission = submission;
        answer1.question = q1;
        answer1.selectedOptions = [opt2];

        const answer2 = new Answer();
        answer2.submission = submission;
        answer2.question = q2;
        answer2.selectedOptions = [opt3];

        const answer3 = new Answer();
        answer3.submission = submission;
        answer3.question = q3;
        answer3.answerText = 'Photosynthesis is the process...';

        await dataSource.manager.save([answer1, answer2, answer3]);
      } else {
        console.log('Submission already exists, skipping...');
      }
    } else {
      console.log('Exam already exists, skipping...');
    }

    console.log('Seed execution successful!');
    console.log('Employer: employer@example.com / 123456');
    console.log('Candidate: candidate@example.com / 123456');
  } catch (error) {
    console.error('Error seeding data:', error.message);
  } finally {
    await app.close();
  }
}
bootstrap();

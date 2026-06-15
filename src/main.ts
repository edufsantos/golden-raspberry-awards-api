/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CustomLogger } from '@common/loggers/custom.logger';
import { BadRequestException } from '@nestjs/common/exceptions/bad-request.exception';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
      ],
    }),
  });
  const customLogger = app.get(CustomLogger);
  app.useLogger(customLogger);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          message: error?.constraints
            ? error.constraints[Object.keys(error.constraints)[0]]
            : undefined,
        }));
        return new BadRequestException(result);
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

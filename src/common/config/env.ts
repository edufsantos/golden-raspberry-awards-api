import { Logger } from '@nestjs/common';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

export class Env {
  @IsString()
  @IsNotEmpty()
  NODE_ENV: string;

  @IsNotEmpty()
  PORT: number;

  @IsString()
  @IsNotEmpty()
  LOG_LEVEL: string;

  // @IsString()
  // @IsNotEmpty()
  // REDIS_URL: string;
}

const buildEnv = (): Env => {
  const env = new Env();
  env.NODE_ENV = process.env.NODE_ENV ?? '';
  env.PORT = Number.parseInt(process.env.PORT ?? '3000', 10);
  env.LOG_LEVEL = process.env.LOG_LEVEL ?? '';
  // TODO: Adicionar o redis, apos a implementacao do mesmo
  // env.REDIS_URL = process.env.REDIS_URL ?? '';

  return env;
};

const validateEnv = (env: Env): void => {
  const errors = validateSync(env);

  if (errors.length > 0) {
    Logger.error(
      `Config validation error: ${Object.values(errors[0].constraints ?? {}).join(', ')}`,
    );

    throw new Error('Config validation error');
  }
};

export const env_configuration = () => {
  const env = buildEnv();
  validateEnv(env);
  return { ...env };
};

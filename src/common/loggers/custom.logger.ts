/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Env } from '@common/config/env';
import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigConstants, LogConstants } from '../../common/constants/config';

@Injectable()
export class CustomLogger extends ConsoleLogger {
  private readonly logLevels: LogLevel[];

  constructor(private readonly configService: ConfigService<Env>) {
    super('Global'); // Define a default context

    const configuredLevels = this.configService.get<string>(
      ConfigConstants.LOG_LEVEL,
    );

    this.logLevels = configuredLevels
      ? configuredLevels
          .split(',')
          .map((level) => level.trim().toLowerCase())
          .filter((level): level is LogLevel => this.isValidLogLevel(level))
      : [];
  }

  setContext(context: string) {
    this.context = context;
  }

  private isLogLevelEnabled(level: LogLevel): boolean {
    return this.logLevels.includes(level);
  }

  private isValidLogLevel(level: string): level is LogLevel {
    const validLogLevels: LogLevel[] = [
      LogConstants.LOG,
      LogConstants.WARN,
      LogConstants.DEBUG,
      LogConstants.ERROR,
      LogConstants.VERBOSE,
      'fatal',
    ];

    return validLogLevels.includes(level as LogLevel);
  }

  log(message: string, context?: string) {
    if (this.isLogLevelEnabled(LogConstants.LOG)) {
      if (context) {
        super.log(message, context);
      } else {
        super.log(message);
      }
    }
  }

  error(message: string, trace?: string, context?: string) {
    if (this.isLogLevelEnabled(LogConstants.ERROR)) {
      if (context) {
        super.error(message, trace, context);
      } else {
        super.error(message, trace);
      }
    }
  }

  warn(message: string, context?: string) {
    if (this.isLogLevelEnabled(LogConstants.WARN)) {
      if (context) {
        super.warn(message, context);
      } else {
        super.warn(message);
      }
    }
  }

  debug(message: string, context?: string) {
    console.log('asjdhakjlsbhdlkajs');

    if (this.isLogLevelEnabled(LogConstants.DEBUG)) {
      if (context) {
        super.debug(message, context);
      } else {
        super.debug(message);
      }
    }
  }

  verbose(message: string, context?: string) {
    if (this.isLogLevelEnabled(LogConstants.VERBOSE)) {
      if (context) {
        super.verbose(message, context);
      } else {
        super.verbose(message);
      }
    }
  }
}

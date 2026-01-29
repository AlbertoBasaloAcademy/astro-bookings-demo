type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const getCurrentLogLevel = (): LogLevel => {
  const level = (process.env.LOG_LEVEL ?? 'info').toLowerCase() as LogLevel;
  return LOG_LEVEL_PRIORITY[level] !== undefined ? level : 'info';
};

const shouldLog = (level: LogLevel): boolean => {
  const currentLevel = getCurrentLogLevel();
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[currentLevel];
};

const formatMessage = (level: LogLevel, message: string): string => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};

export const logger = {
  debug: (message: string) => {
    if (shouldLog('debug')) {
      console.log(formatMessage('debug', message));
    }
  },

  info: (message: string) => {
    if (shouldLog('info')) {
      console.log(formatMessage('info', message));
    }
  },

  warn: (message: string) => {
    if (shouldLog('warn')) {
      console.warn(formatMessage('warn', message));
    }
  },

  error: (message: string) => {
    if (shouldLog('error')) {
      console.error(formatMessage('error', message));
    }
  },
};

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const DEFAULT_LOG_LEVEL: LogLevel = 'info';

const LOG_LEVEL = normalizeLogLevel(process.env.LOG_LEVEL);

const logLevelOrder: Record<LogLevel, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

type LogMethod = (...args: unknown[]) => void;

function normalizeLogLevel(level: string | undefined): LogLevel {
  const normalized = level?.toLowerCase();
  if (normalized === 'debug' || normalized === 'info' || normalized === 'warn' || normalized === 'error') {
    return normalized;
  }

  return DEFAULT_LOG_LEVEL;
}

function shouldLog(level: LogLevel): boolean {
  return logLevelOrder[level] >= logLevelOrder[LOG_LEVEL];
}

function log(method: LogMethod, level: LogLevel, ...args: unknown[]) {
  if (!shouldLog(level)) {
    return;
  }

  const timestamp = new Date().toISOString();
  const tag = level.toUpperCase();
  method(`${timestamp} [${tag}]`, ...args);
}

export function info(...args: unknown[]) {
  log(console.info, 'info', ...args);
}

export function warn(...args: unknown[]) {
  log(console.warn, 'warn', ...args);
}

export function error(...args: unknown[]) {
  log(console.error, 'error', ...args);
}

export function debug(...args: unknown[]) {
  log(console.debug, 'debug', ...args);
}
/**
 * Environment-aware logger utility.
 * Only logs in development mode, except for errors which are always logged.
 */
const isDev = process.env.NODE_ENV === "development";

type LogArgs = unknown[];

export const logger = {
  log: (...args: LogArgs) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: LogArgs) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: LogArgs) => {
    // Always log errors regardless of environment
    console.error(...args);
  },
  info: (...args: LogArgs) => {
    if (isDev) console.info(...args);
  },
  debug: (...args: LogArgs) => {
    if (isDev) console.debug(...args);
  },
};

export default logger;

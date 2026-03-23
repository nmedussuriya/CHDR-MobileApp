// utils/logger.ts
const IS_DEV = __DEV__;

export const logger = {
  log: (...args: any[]) => {
    // DISABLE ALL LOGS - comment out to prevent crashes
    // if (IS_DEV) {
    //   console.log('📝', ...args);
    // }
  },
  info: (...args: any[]) => {
    // DISABLED
  },
  warn: (...args: any[]) => {
    // DISABLED
  },
  error: (...args: any[]) => {
    // Keep errors only for debugging
    console.error('❌', ...args);
  },
  debug: (...args: any[]) => {
    // DISABLED
  },
  success: (...args: any[]) => {
    // DISABLED
  },
  network: (...args: any[]) => {
    // DISABLED
  },
  db: (...args: any[]) => {
    // DISABLED
  }
};
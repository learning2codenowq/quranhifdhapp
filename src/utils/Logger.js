export class Logger {
  static isDevelopment = __DEV__;
  static isProduction = !__DEV__;

  static log(message, ...args) {
    if (this.isDevelopment) {
      console.log(message, ...args);
    }
  }

  static warn(message, ...args) {
    if (this.isDevelopment) {
      console.warn(message, ...args);
    }
  }

  static error(message, ...args) {
    // Always log errors, but sanitize in production
    if (this.isProduction) {
      console.error('App Error:', message);
    } else {
      console.error(message, ...args);
    }
  }

  static info(message, ...args) {
    // No info logs in production
    if (this.isDevelopment) {
      console.info(message, ...args);
    }
  }

  static critical(message, ...args) {
    // Always log critical errors
    console.error('[CRITICAL]', message);
    if (this.isDevelopment) {
      console.error(...args);
    }
  }

  static production(message, ...args) {
    // Only logs that should appear in production
    console.log('[PROD]', message);
  }
}
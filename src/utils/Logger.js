export class Logger {
  static isDevelopment = __DEV__;

  static log(message, ...args) {
    if (this.isDevelopment) {
      // Only log in development
      // console.log(message, ...args);
    }
  }

  static warn(message, ...args) {
    if (this.isDevelopment) {
      console.warn(message, ...args);
    }
  }

  static error(message, ...args) {
    // Always log errors
    console.error(message, ...args);
  }

  static info(message, ...args) {
    if (this.isDevelopment) {
      // console.info(message, ...args);
    }
  }

  // For critical errors that should always be logged
  static critical(message, ...args) {
    console.error('[CRITICAL]', message, ...args);
  }
}
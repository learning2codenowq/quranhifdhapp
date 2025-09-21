export class Logger {
  static isDevelopment = __DEV__;

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
    if (this.isDevelopment) {
      console.error(message, ...args);
    }
    // In production, you might want to send errors to a crash reporting service
    // like Sentry, Crashlytics, etc.
  }

  static info(message, ...args) {
    if (this.isDevelopment) {
      console.info(message, ...args);
    }
  }

  // For critical errors that should always be logged
  static critical(message, ...args) {
    console.error('[CRITICAL]', message, ...args);
    // Always log critical errors, even in production
    // Send to crash reporting service
  }
}
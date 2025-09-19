export class PerformanceMonitor {
  static timers = {};

  static startTimer(label) {
    this.timers[label] = Date.now();
  }

  static endTimer(label) {
    const startTime = this.timers[label];
    if (startTime) {
      const duration = Date.now() - startTime;
      console.log(`Performance: ${label} took ${duration}ms`);
      delete this.timers[label];
      return duration;
    }
    return 0;
  }

  static measureFunction(func, label) {
    return async (...args) => {
      this.startTimer(label);
      try {
        const result = await func(...args);
        this.endTimer(label);
        return result;
      } catch (error) {
        this.endTimer(label);
        throw error;
      }
    };
  }

  static logMemoryUsage() {
    if (__DEV__) {
      // Only available in development
      console.log('Memory usage monitoring available in debug builds');
    }
  }
}
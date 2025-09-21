import { Logger } from './Logger';

export class PerformanceTracker {
  static timers = new Map();
  static isEnabled = __DEV__; // Only track in development by default

  static startTimer(label) {
    if (!this.isEnabled) return;
    
    this.timers.set(label, {
      startTime: Date.now(),
      label
    });
  }

  static endTimer(label) {
    if (!this.isEnabled) return;

    const timer = this.timers.get(label);
    if (timer) {
      const duration = Date.now() - timer.startTime;
      this.timers.delete(label);
      
      Logger.info(`⏱️ Performance: ${label} took ${duration}ms`);
      
      // Log slow operations
      if (duration > 1000) {
        Logger.warn(`🐌 Slow operation detected: ${label} took ${duration}ms`);
      }
      
      return duration;
    }
    
    return 0;
  }

  static measureAsync(label, asyncFunction) {
    return async (...args) => {
      this.startTimer(label);
      try {
        const result = await asyncFunction(...args);
        this.endTimer(label);
        return result;
      } catch (error) {
        this.endTimer(label);
        Logger.error(`Error in ${label}:`, error);
        throw error;
      }
    };
  }

  static trackScreenLoad(screenName) {
    if (!this.isEnabled) return;
    
    const timer = `screen_load_${screenName}`;
    this.startTimer(timer);
    
    // Return a function to call when screen finishes loading
    return () => this.endTimer(timer);
  }

  static trackApiCall(apiName, promise) {
    if (!this.isEnabled) return promise;
    
    this.startTimer(`api_${apiName}`);
    
    return promise
      .then(result => {
        this.endTimer(`api_${apiName}`);
        return result;
      })
      .catch(error => {
        this.endTimer(`api_${apiName}`);
        throw error;
      });
  }

  static getMemoryUsage() {
    if (!this.isEnabled) return null;
    
    // This will only work in development/debug builds
    if (typeof performance !== 'undefined' && performance.memory) {
      return {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit
      };
    }
    
    return null;
  }

  static logMemoryUsage(context = '') {
    if (!this.isEnabled) return;
    
    const memory = this.getMemoryUsage();
    if (memory) {
      const usedMB = (memory.used / 1024 / 1024).toFixed(2);
      const totalMB = (memory.total / 1024 / 1024).toFixed(2);
      
      Logger.info(`💾 Memory usage ${context}: ${usedMB}MB / ${totalMB}MB`);
    }
  }
}
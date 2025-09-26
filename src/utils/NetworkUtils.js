export class NetworkUtils {
  static async checkInternetConnection() {
    try {
      const response = await fetch('https://www.google.com', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  static async retryWithExponentialBackoff(fn, maxRetries = 2) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        
        const delay = Math.pow(2, i) * 1000; // 1s, 2s
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  static getErrorMessage(error) {
    if (error.name === 'AbortError') {
      return 'Request timed out. Please check your internet connection.';
    }
    if (error.message.includes('fetch')) {
      return 'Unable to connect. Please check your internet connection.';
    }
    if (error.message.includes('timeout')) {
      return 'Connection timeout. Please try again.';
    }
    return 'Something went wrong. Please try again.';
  }
}
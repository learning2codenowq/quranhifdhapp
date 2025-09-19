import { Alert } from 'react-native';

export class ErrorHandler {
  static handleStorageError(error, operation = 'storage operation') {
    console.error(`Storage error during ${operation}:`, error);
    Alert.alert(
      'Data Error',
      'There was an issue saving your progress. Please try again.',
      [{ text: 'OK' }]
    );
  }

  static handleNetworkError(error, operation = 'network request') {
    console.error(`Network error during ${operation}:`, error);
    Alert.alert(
      'Connection Error',
      'Please check your internet connection and try again.',
      [{ text: 'Retry' }, { text: 'Cancel' }]
    );
  }

  static handleAudioError(error) {
    console.error('Audio error:', error);
    Alert.alert(
      'Audio Error',
      'Unable to play audio. Please check your device volume and try again.',
      [{ text: 'OK' }]
    );
  }

  static handleGenericError(error, userMessage = 'Something went wrong') {
    console.error('Generic error:', error);
    Alert.alert('Error', userMessage, [{ text: 'OK' }]);
  }

  static logError(error, context) {
    // In production, you might want to send this to a logging service
    console.error(`Error in ${context}:`, error);
  }
}
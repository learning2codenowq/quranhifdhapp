import { Vibration, Platform } from 'react-native';

export class HapticFeedback {
  static light() {
    if (Platform.OS === 'ios') {
      // iOS simple vibration
      Vibration.vibrate(10);
    } else {
      Vibration.vibrate(10);
    }
  }

  static medium() {
    if (Platform.OS === 'ios') {
      Vibration.vibrate(20);
    } else {
      Vibration.vibrate(20);
    }
  }

  static heavy() {
    if (Platform.OS === 'ios') {
      Vibration.vibrate(30);
    } else {
      Vibration.vibrate(30);
    }
  }

  static success() {
    if (Platform.OS === 'ios') {
      Vibration.vibrate([0, 50, 50, 50]);
    } else {
      Vibration.vibrate([0, 50, 50, 50]);
    }
  }

  static error() {
    if (Platform.OS === 'ios') {
      Vibration.vibrate([0, 100, 50, 100]);
    } else {
      Vibration.vibrate([0, 100, 50, 100]);
    }
  }

  static selection() {
    if (Platform.OS === 'ios') {
      Vibration.vibrate(5);
    } else {
      Vibration.vibrate(5);
    }
  }
}
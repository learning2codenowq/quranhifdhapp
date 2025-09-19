import { Alert } from 'react-native';
import { StorageService } from '../services/StorageService';
import { QuranUtils } from './QuranUtils';
import { AchievementSystem } from './AchievementSystem';
import { AnalyticsUtils } from './AnalyticsUtils';

export class TestingUtils {
  static async runDiagnostics() {
    const results = {
      storage: await this.testStorage(),
      tikrar: await this.testTikrarCalculations(),
      achievements: await this.testAchievements(),
      analytics: await this.testAnalytics(),
      overall: 'PASS'
    };

    const hasFailures = Object.values(results).some(result => 
      typeof result === 'object' ? result.status === 'FAIL' : result === 'FAIL'
    );

    if (hasFailures) {
      results.overall = 'FAIL';
    }

    return results;
  }

  static async testStorage() {
    try {
      // Test basic storage operations
      const testData = { test: 'data', timestamp: Date.now() };
      const saved = await StorageService.saveState(testData);
      const loaded = await StorageService.getState();
      
      if (!saved || !loaded || loaded.test !== 'data') {
        return { status: 'FAIL', error: 'Storage operations failed' };
      }

      return { status: 'PASS', message: 'Storage operations working' };
    } catch (error) {
      return { status: 'FAIL', error: error.message };
    }
  }

  static async testTikrarCalculations() {
  try {
    // Create a more realistic mock state
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const mockState = {
      ayahProgress: {
        1: { 
          1: { memorized: true, dateMemorized: yesterday },
          2: { memorized: true, dateMemorized: today }
        }
      },
      progress: {
        [yesterday]: 1,
        [today]: 1
      },
      tikrarProgress: {
        [today]: {
          repetitionOfYesterday: 0,
          connection: 0,
          revision: 0
        }
      },
      settings: {
        dailyGoal: 10,
        userName: 'Test User'
      }
    };

    const tikrarPlan = QuranUtils.getTikrarPlan(mockState);
    
    if (!tikrarPlan || 
        !tikrarPlan.repetitionOfYesterday || 
        !tikrarPlan.connection || 
        !tikrarPlan.revision ||
        typeof tikrarPlan.totalDailyLoad !== 'number') {
      return { status: 'FAIL', error: 'Tikrar plan structure invalid' };
    }

    return { status: 'PASS', message: 'Tikrar calculations working' };
  } catch (error) {
    return { status: 'FAIL', error: error.message };
  }
}

  static async testAchievements() {
    try {
      const mockState = {
        ayahProgress: {
          1: { 1: { memorized: true, dateMemorized: '2024-01-01' } }
        },
        earnedAchievements: []
      };

      const newAchievements = AchievementSystem.checkAchievements(mockState);
      
      if (!Array.isArray(newAchievements)) {
        return { status: 'FAIL', error: 'Achievement system failed' };
      }

      return { status: 'PASS', message: 'Achievement system working' };
    } catch (error) {
      return { status: 'FAIL', error: error.message };
    }
  }

  static async testAnalytics() {
    try {
      const mockState = {
        progress: {
          '2024-01-01': 5,
          '2024-01-02': 3,
          '2024-01-03': 7
        }
      };

      const weeklyData = AnalyticsUtils.getWeeklyAnalytics(mockState);
      
      if (!weeklyData || !weeklyData.dailyData || !Array.isArray(weeklyData.dailyData)) {
        return { status: 'FAIL', error: 'Analytics calculations failed' };
      }

      return { status: 'PASS', message: 'Analytics working' };
    } catch (error) {
      return { status: 'FAIL', error: error.message };
    }
  }

  static showDiagnosticResults(results) {
    const summary = Object.entries(results)
      .filter(([key]) => key !== 'overall')
      .map(([key, result]) => {
        const status = typeof result === 'object' ? result.status : result;
        return `${key}: ${status}`;
      })
      .join('\n');

    Alert.alert(
      `Diagnostic Results: ${results.overall}`,
      summary,
      [{ text: 'OK' }]
    );
  }

  static generateTestData() {
    const today = new Date();
    const testState = {
      ayahProgress: {},
      progress: {},
      tikrarProgress: {},
      settings: {
        dailyGoal: 10,
        userName: 'Test User'
      },
      earnedAchievements: []
    };

    // Generate 30 days of test data
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dailyProgress = Math.floor(Math.random() * 15) + 5; // 5-20 ayahs
      testState.progress[dateStr] = dailyProgress;
      
      // Mock Tikrar completion
      testState.tikrarProgress[dateStr] = {
        newMemorization: dailyProgress,
        repetitionOfYesterday: Math.floor(Math.random() * 50),
        connection: Math.floor(Math.random() * 200),
        revision: Math.floor(Math.random() * 100)
      };
    }

    // Generate ayah progress
    let totalAyahs = 0;
    for (let surah = 1; surah <= 5; surah++) {
      testState.ayahProgress[surah] = {};
      const ayahCount = Math.floor(Math.random() * 20) + 5;
      
      for (let ayah = 1; ayah <= ayahCount; ayah++) {
        const randomDate = new Date(today);
        randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
        
        testState.ayahProgress[surah][ayah] = {
          memorized: true,
          dateMemorized: randomDate.toISOString().split('T')[0]
        };
        totalAyahs++;
      }
    }

    return testState;
  }

  static async loadTestData() {
  try {
    const today = new Date();
    const testState = {
      ayahProgress: {},
      progress: {},
      tikrarProgress: {},
      settings: {
        dailyGoal: 10,
        userName: 'Test User'
      },
      earnedAchievements: []
    };

    // Generate realistic test data over 60 days
    for (let i = 0; i < 60; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Simulate consistent daily progress
      const dailyProgress = Math.floor(Math.random() * 8) + 7; // 7-15 ayahs per day
      testState.progress[dateStr] = dailyProgress;
      
      // Generate ayah progress for this day
      const startingSurah = Math.floor(i / 20) + 1; // Change surah every ~20 days
      const surahId = Math.min(startingSurah, 5); // Max 5 surahs for test
      
      if (!testState.ayahProgress[surahId]) {
        testState.ayahProgress[surahId] = {};
      }
      
      // Add ayahs for this day
      for (let j = 1; j <= dailyProgress; j++) {
        const ayahNumber = Object.keys(testState.ayahProgress[surahId]).length + 1;
        if (ayahNumber <= 50) { // Max 50 ayahs per surah for test
          testState.ayahProgress[surahId][ayahNumber] = {
            memorized: true,
            dateMemorized: dateStr,
            difficulty: Math.floor(Math.random() * 3) + 1
          };
        }
      }
      
      // Generate some Tikrar progress for recent days
      if (i < 30) {
        testState.tikrarProgress[dateStr] = {
          repetitionOfYesterday: Math.floor(Math.random() * 50),
          connection: Math.floor(Math.random() * 100),
          revision: Math.floor(Math.random() * 80)
        };
      }
    }

    const success = await StorageService.saveState(testState);
    
    if (success) {
      Alert.alert(
        'Test Data Loaded',
        'Generated 60 days of realistic memorization data for testing.',
        [{ text: 'OK' }]
      );
      return true;
    } else {
      Alert.alert('Error', 'Failed to save test data');
      return false;
    }
  } catch (error) {
    console.error('Error loading test data:', error);
    Alert.alert('Error', 'Failed to load test data: ' + error.message);
    return false;
  }
}

  static async clearAllData() {
  try {
    await StorageService.clearState();
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
}
}
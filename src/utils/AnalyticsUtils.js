import { QuranUtils } from './QuranUtils';

export class AnalyticsUtils {
  static getWeeklyAnalytics(state) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 6); // Last 7 days
  
  const dailyData = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = QuranUtils.localISO(d);
    const progress = state?.progress?.[dateStr] || 0;
    const revisionProgress = state?.revisionProgress?.[dateStr] || {};
    
    dailyData.push({
      date: dateStr,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      memorized: progress,
      revisionCompleted: (revisionProgress.revision || 0) > 0 ? 1 : 0
    });
  }
  
  return {
    dailyData,
    totalWeekAyahs: dailyData.reduce((sum, day) => sum + day.memorized, 0),
    averageDaily: dailyData.reduce((sum, day) => sum + day.memorized, 0) / dailyData.length,
    streak: QuranUtils.computeStreak(state?.progress || {}),
    revisionCompletionRate: dailyData.filter(day => day.revisionCompleted > 0).length
  };
}

  static getMonthlyAnalytics(state) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 29); // Last 30 days
    
    const weeklyData = [];
    for (let week = 0; week < 4; week++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + (week * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      let weekTotal = 0;
      for (let d = new Date(weekStart); d <= weekEnd && d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = QuranUtils.localISO(d);
        weekTotal += state?.progress?.[dateStr] || 0;
      }
      
      weeklyData.push({
        week: week + 1,
        total: weekTotal,
        average: weekTotal / 7
      });
    }
    
    return {
      weeklyData,
      totalMonthAyahs: weeklyData.reduce((sum, week) => sum + week.total, 0),
      bestWeek: Math.max(...weeklyData.map(w => w.total)),
      consistentDays: this.getConsistentDays(state, 30)
    };
  }

  static getSurahProgress(state) {
  const surahProgress = [];
  
  // Get all surahs that have memorized ayahs
  const memorizedSurahs = Object.keys(state?.ayahProgress || {}).map(id => parseInt(id));
  
  // Surah data with actual ayah counts
  const surahData = {
    1: { name: 'Al-Fatihah', totalAyahs: 7 },
    2: { name: 'Al-Baqarah', totalAyahs: 286 },
    3: { name: 'Ali-Imran', totalAyahs: 200 },
    4: { name: 'An-Nisa', totalAyahs: 176 },
    5: { name: 'Al-Maidah', totalAyahs: 120 },
    6: { name: 'Al-Anam', totalAyahs: 165 },
    7: { name: 'Al-Araf', totalAyahs: 206 },
    67: { name: 'Al-Mulk', totalAyahs: 30 },
    114: { name: 'An-Nas', totalAyahs: 6 }
  };
  
  memorizedSurahs.forEach(surahId => {
    const surahInfo = surahData[surahId];
    if (surahInfo) {
      const memorizedAyahs = this.getMemorizedAyahsInSurah(state, surahId);
      if (memorizedAyahs > 0) {
        surahProgress.push({
          id: surahId,
          name: surahInfo.name,
          totalAyahs: surahInfo.totalAyahs,
          memorized: memorizedAyahs,
          percentage: (memorizedAyahs / surahInfo.totalAyahs) * 100
        });
      }
    } else {
      // For surahs not in our data, use QuranUtils.getSurahName
      const memorizedAyahs = this.getMemorizedAyahsInSurah(state, surahId);
      if (memorizedAyahs > 0) {
        surahProgress.push({
          id: surahId,
          name: QuranUtils.getSurahName(surahId),
          totalAyahs: memorizedAyahs, // Use memorized count as approximation
          memorized: memorizedAyahs,
          percentage: 100 // Assume complete if we don't have total count
        });
      }
    }
  });
  
  return surahProgress.sort((a, b) => b.percentage - a.percentage);
}

  static calculateTikrarCompletion(tikrarProgress) {
    const categories = ['newMemorization', 'repetitionOfYesterday', 'connection', 'revision'];
    const completed = categories.filter(cat => (tikrarProgress[cat] || 0) > 0).length;
    return completed / categories.length;
  }

  static getConsistentDays(state, days) {
    const endDate = new Date();
    let consistent = 0;
    
    for (let i = 0; i < days; i++) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      const dateStr = QuranUtils.localISO(date);
      
      if ((state?.progress?.[dateStr] || 0) > 0) {
        consistent++;
      }
    }
    
    return consistent;
  }

  static getMemorizedAyahsInSurah(state, surahId) {
    const surahProgress = state?.ayahProgress?.[surahId];
    if (!surahProgress) return 0;
    
    return Object.values(surahProgress).filter(ayah => ayah.memorized).length;
  }

  static getProjections(state) {
    const currentStats = QuranUtils.computeStats(state);
    const recentProgress = this.getWeeklyAnalytics(state);
    
    // Project based on recent average vs target
    const recentAverage = recentProgress.averageDaily;
    const targetDaily = currentStats.daily;
    
    const optimisticDays = Math.ceil(currentStats.remaining / Math.max(recentAverage, targetDaily));
    const realisticDays = Math.ceil(currentStats.remaining / Math.max(recentAverage * 0.8, 1));
    const conservativeDays = Math.ceil(currentStats.remaining / Math.max(recentAverage * 0.6, 1));
    
    return {
      optimistic: {
        days: optimisticDays,
        date: new Date(Date.now() + optimisticDays * 24 * 60 * 60 * 1000),
        dailyRequired: Math.max(recentAverage, targetDaily)
      },
      realistic: {
        days: realisticDays,
        date: new Date(Date.now() + realisticDays * 24 * 60 * 60 * 1000),
        dailyRequired: recentAverage * 0.8
      },
      conservative: {
        days: conservativeDays,
        date: new Date(Date.now() + conservativeDays * 24 * 60 * 60 * 1000),
        dailyRequired: recentAverage * 0.6
      }
    };
  }
}
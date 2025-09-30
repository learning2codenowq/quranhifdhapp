import { StorageService } from '../services/StorageService';
import { AchievementSystem } from './AchievementSystem';
import { Logger } from './Logger';

export class QuranUtils {
  static localISO(date = new Date()) {
    return date.toISOString().split('T')[0];
  }

  static async markAyahMemorized(surahId, ayahNumber, difficulty = 2) {
    try {
      const state = await StorageService.getState();
      if (!state.ayahProgress) state.ayahProgress = {};
      if (!state.ayahProgress[surahId]) state.ayahProgress[surahId] = {};
      
      const today = this.localISO();
      const wasAlreadyMemorized = state.ayahProgress[surahId][ayahNumber]?.memorized;
      
      // Store the ayah as memorized with details
      state.ayahProgress[surahId][ayahNumber] = {
        memorized: true,
        dateMemorized: today,
        difficulty: difficulty
      };

      // Only increment daily progress if this ayah wasn't already memorized
      if (!wasAlreadyMemorized) {
        if (!state.progress) state.progress = {};
        state.progress[today] = (state.progress[today] || 0) + 1;
      }

      // Logger.log('Ayah marked as memorized:', surahId, ayahNumber, 'Total today:', state.progress[today]);
      
      await StorageService.saveState(state);
      return state;
    } catch (error) {
      // Logger.error('Error marking ayah as memorized:', error);
      throw error;
    }
  }

  static async unmarkAyahMemorized(surahId, ayahNumber) {
    try {
      const state = await StorageService.getState();
      if (!state.ayahProgress || !state.ayahProgress[surahId]) return state;

      const ayahData = state.ayahProgress[surahId][ayahNumber];
      if (!ayahData || !ayahData.memorized) return state;

      const today = this.localISO();
      const dateMemorized = ayahData.dateMemorized;

      // Remove the ayah memorization
      delete state.ayahProgress[surahId][ayahNumber];

      // If the ayah was memorized today, decrement today's progress
      if (dateMemorized === today) {
        if (state.progress && state.progress[today] > 0) {
          state.progress[today] -= 1;
        }
      }

      await StorageService.saveState(state);
      return state;
    } catch (error) {
      // Logger.error('Error unmarking ayah:', error);
      throw error;
    }
  }

  static computeStats(state) {
    let memorized = 0;
    const total = 6236; // Total ayahs in Quran
    
    // Count all memorized ayahs across all surahs
    if (state && state.ayahProgress) {
      Object.keys(state.ayahProgress).forEach(surahId => {
        Object.keys(state.ayahProgress[surahId]).forEach(ayahNumber => {
          const ayahData = state.ayahProgress[surahId][ayahNumber];
          if (ayahData && ayahData.memorized) {
            memorized++;
          }
        });
      });
    }
    
    // Logger.log('Computing stats - Total memorized:', memorized, 'AyahProgress keys:', Object.keys(state?.ayahProgress || {}));
    
    const remaining = total - memorized;
    const percentComplete = total > 0 ? (memorized / total) * 100 : 0;
    
    // Get daily goal from settings
    const dailyGoal = state?.settings?.dailyGoal || 10;
    
    // Calculate days left based on remaining ayahs and daily goal
    const daysLeft = remaining > 0 ? Math.ceil(remaining / dailyGoal) : 0;
    
    return {
      memorized,
      total,
      remaining,
      percentComplete,
      daily: dailyGoal,
      daysLeft
    };
  }

  static computeStreak(progressData) {
    if (!progressData) return 0;

    const today = new Date();
    let streak = 0;
    let startCounting = false;

    // FIXED: Allow today to have no progress yet, start counting from yesterday
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = this.localISO(checkDate);
      
      const hasProgress = progressData[dateString] && progressData[dateString] > 0;
      
      // For day 0 (today), we don't break the streak if there's no progress yet
      if (i === 0) {
        if (hasProgress) {
          streak++;
          startCounting = true;
        }
        // If today has no progress, we continue to check yesterday
        continue;
      }
      
      // For all other days, if there's progress, increment streak
      if (hasProgress) {
        streak++;
        startCounting = true;
      } else if (startCounting) {
        // Only break if we've started counting and hit a day with no progress
        break;
      } else {
        // Haven't started counting yet, keep looking back
        break;
      }
    }

    return streak;
  }

  static getAyahsMemorizedOnDate(state, dateString) {
    const ayahs = [];
    if (!state?.ayahProgress) return ayahs;
    
    Object.keys(state.ayahProgress).forEach(surahId => {
      Object.keys(state.ayahProgress[surahId]).forEach(ayahNumber => {
        const ayahData = state.ayahProgress[surahId][ayahNumber];
        if (ayahData.memorized && ayahData.dateMemorized === dateString) {
          ayahs.push({
            surahId: parseInt(surahId),
            ayahNumber: parseInt(ayahNumber),
            dateMemorized: ayahData.dateMemorized
          });
        }
      });
    });
    
    return ayahs.sort((a, b) => a.surahId - b.surahId || a.ayahNumber - b.ayahNumber);
  }

  // NEW SIMPLE 7-DAY ROLLING REVISION SYSTEM
  static getRevisionPlan(state) {
    const today = this.localISO();
    const dailyGoal = state.settings?.dailyGoal || 10;
    const todayProgress = state?.progress?.[today] || 0;
    
    // 1. NEW MEMORIZATION - daily goal
    const newMemorization = {
      target: dailyGoal,
      completed: todayProgress,
      description: `Memorize ${dailyGoal} new ayahs today`
    };
    
    // 2. SIMPLE REVISION - 7-day rolling window
    const revisionData = this.getSimpleRevisionData(state);
    
    const revision = {
      target: revisionData.totalRecitations,
      completed: 0,
      description: revisionData.description,
      displayText: revisionData.displayText,
      ayahRanges: revisionData.ayahRanges
    };
    
    return {
      newMemorization,
      revision,
      totalDailyLoad: dailyGoal + revisionData.totalRecitations
    };
  }

  static getMemorizationHistory(state) {
    const history = [];
    
    if (!state?.progress) return history;
    
    // Get all dates with progress, sorted chronologically
    const dates = Object.keys(state.progress)
      .filter(date => state.progress[date] > 0)
      .sort();
    
    dates.forEach(date => {
      const ayahsOnDate = this.getAyahsMemorizedOnDate(state, date);
      if (ayahsOnDate.length > 0) {
        history.push({
          date,
          ayahs: ayahsOnDate,
          count: ayahsOnDate.length
        });
      }
    });
    
    return history;
  }

  static getSimpleRevisionData(state) {
    // Get memorization history by day
    const memorizationHistory = this.getMemorizationHistory(state);
    
    if (memorizationHistory.length === 0) {
      return {
        totalRecitations: 0,
        description: "No ayahs to revise yet",
        displayText: "Start memorizing to begin revision tomorrow",
        ayahRanges: []
      };
    }
    
    // FIXED: Check if there are previous days with memorization (not just today)
    const today = this.localISO();
    const previousDays = memorizationHistory.filter(day => day.date !== today);
    
    if (previousDays.length === 0) {
      // Only today has memorization, come back tomorrow
      return {
        totalRecitations: 0,
        description: "Come back tomorrow to start revision",
        displayText: "You'll revise today's memorized ayahs tomorrow",
        ayahRanges: []
      };
    }
    
    // From day 2 onwards: revise previous days (rolling 6-day window)
    const totalDays = memorizationHistory.length;
    
    // Determine which days to revise (previous 6 days max, excluding today)
    let daysToRevise;
    if (previousDays.length <= 6) {
      // Days 2-7: revise all previous days
      daysToRevise = previousDays;
    } else {
      // Day 8+: revise last 6 days (rolling window)
      daysToRevise = previousDays.slice(-6);
    }
    
    return {
      totalRecitations: 3, // Always 3 times total
      description: `Revise previous ${daysToRevise.length} days (3 times total)`,
      displayText: this.formatSimpleRevisionText(daysToRevise),
      ayahRanges: daysToRevise
    };
  }

  static groupConsecutiveAyahs(ayahs) {
    if (ayahs.length === 0) return [];
    
    const grouped = [];
    let currentGroup = null;
    
    ayahs.forEach(ayah => {
      if (!currentGroup || 
          currentGroup.surahId !== ayah.surahId || 
          currentGroup.endAyah + 1 !== ayah.ayahNumber) {
        // Start new group
        currentGroup = {
          surahId: ayah.surahId,
          startAyah: ayah.ayahNumber,
          endAyah: ayah.ayahNumber,
          surahName: this.getSurahName(ayah.surahId)
        };
        grouped.push(currentGroup);
      } else {
        // Extend current group
        currentGroup.endAyah = ayah.ayahNumber;
      }
    });
    
    return grouped;
  }

  static formatSimpleRevisionText(daysToRevise) {
    if (daysToRevise.length === 0) return "";
    
    // Get all ayahs from the days to revise
    const allAyahs = [];
    daysToRevise.forEach(day => {
      allAyahs.push(...day.ayahs);
    });
    
    if (allAyahs.length === 0) return "";
    
    // Sort all ayahs by surah and ayah number
    allAyahs.sort((a, b) => a.surahId - b.surahId || a.ayahNumber - b.ayahNumber);
    
    // Group consecutive ayahs by surah
    const grouped = this.groupConsecutiveAyahs(allAyahs);
    
    // Format display text
    const parts = grouped.map(group => {
      if (group.startAyah === group.endAyah) {
        return `${group.surahName} ${group.startAyah}`;
      } else {
        return `${group.surahName} ${group.startAyah}-${group.endAyah}`;
      }
    });
    
    return `${parts.join(' + ')} (3 times total)`;
  }

  static getSurahName(surahId) {
    const surahNames = {
      1: 'Al-Fatihah',
      2: 'Al-Baqarah', 
      3: 'Ali-Imran',
      4: 'An-Nisa',
      5: 'Al-Maidah',
      6: 'Al-Anam',
      7: 'Al-Araf',
      8: 'Al-Anfal',
      9: 'At-Tawbah',
      10: 'Yunus',
      11: 'Hud',
      12: 'Yusuf',
      13: 'Ar-Rad',
      14: 'Ibrahim',
      15: 'Al-Hijr',
      16: 'An-Nahl',
      17: 'Al-Isra',
      18: 'Al-Kahf',
      19: 'Maryam',
      20: 'Ta-Ha',
      21: 'Al-Anbiya',
      22: 'Al-Hajj',
      23: 'Al-Muminun',
      24: 'An-Nur',
      25: 'Al-Furqan',
      26: 'Ash-Shuara',
      27: 'An-Naml',
      28: 'Al-Qasas',
      29: 'Al-Ankabut',
      30: 'Ar-Rum',
      31: 'Luqman',
      32: 'As-Sajdah',
      33: 'Al-Ahzab',
      34: 'Saba',
      35: 'Fatir',
      36: 'Ya-Sin',
      37: 'As-Saffat',
      38: 'Sad',
      39: 'Az-Zumar',
      40: 'Ghafir',
      41: 'Fussilat',
      42: 'Ash-Shura',
      43: 'Az-Zukhruf',
      44: 'Ad-Dukhan',
      45: 'Al-Jathiyah',
      46: 'Al-Ahqaf',
      47: 'Muhammad',
      48: 'Al-Fath',
      49: 'Al-Hujurat',
      50: 'Qaf',
      51: 'Adh-Dhariyat',
      52: 'At-Tur',
      53: 'An-Najm',
      54: 'Al-Qamar',
      55: 'Ar-Rahman',
      56: 'Al-Waqiah',
      57: 'Al-Hadid',
      58: 'Al-Mujadilah',
      59: 'Al-Hashr',
      60: 'Al-Mumtahanah',
      61: 'As-Saff',
      62: 'Al-Jumuah',
      63: 'Al-Munafiqun',
      64: 'At-Taghabun',
      65: 'At-Talaq',
      66: 'At-Tahrim',
      67: 'Al-Mulk',
      68: 'Al-Qalam',
      69: 'Al-Haqqah',
      70: 'Al-Maarij',
      71: 'Nuh',
      72: 'Al-Jinn',
      73: 'Al-Muzzammil',
      74: 'Al-Muddaththir',
      75: 'Al-Qiyamah',
      76: 'Al-Insan',
      77: 'Al-Mursalat',
      78: 'An-Naba',
      79: 'An-Naziat',
      80: 'Abasa',
      81: 'At-Takwir',
      82: 'Al-Infitar',
      83: 'Al-Mutaffifin',
      84: 'Al-Inshiqaq',
      85: 'Al-Buruj',
      86: 'At-Tariq',
      87: 'Al-Ala',
      88: 'Al-Ghashiyah',
      89: 'Al-Fajr',
      90: 'Al-Balad',
      91: 'Ash-Shams',
      92: 'Al-Layl',
      93: 'Ad-Duha',
      94: 'Ash-Sharh',
      95: 'At-Tin',
      96: 'Al-Alaq',
      97: 'Al-Qadr',
      98: 'Al-Bayyinah',
      99: 'Az-Zalzalah',
      100: 'Al-Adiyat',
      101: 'Al-Qariah',
      102: 'At-Takathur',
      103: 'Al-Asr',
      104: 'Al-Humazah',
      105: 'Al-Fil',
      106: 'Quraish',
      107: 'Al-Maun',
      108: 'Al-Kawthar',
      109: 'Al-Kafirun',
      110: 'An-Nasr',
      111: 'Al-Masad',
      112: 'Al-Ikhlas',
      113: 'Al-Falaq',
      114: 'An-Nas'
    };
    
    return surahNames[surahId] || `Surah ${surahId}`;
  }

  static getTikrarProgress(state, date = null) {
    if (!date) date = this.localISO();
    
    // Check both old and new progress formats for compatibility
    const oldProgress = state?.tikrarProgress?.[date] || {};
    const newProgress = state?.revisionProgress?.[date] || {};
    
    return {
      newMemorization: newProgress.newMemorization || state?.progress?.[date] || 0,
      revision: newProgress.revision || 0
    };
  }

  static async checkAndAwardAchievements(state) {
    const newAchievements = AchievementSystem.checkAchievements(state);
    if (newAchievements.length > 0) {
      const updatedState = await AchievementSystem.awardAchievements(state, newAchievements);
      await StorageService.saveState(updatedState);
      return { updatedState, newAchievements };
    }
    return { updatedState: state, newAchievements: [] };
  }
}
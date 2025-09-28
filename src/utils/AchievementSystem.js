export class AchievementSystem {
  static achievements = [
    // Memorization Milestones
    { id: 'first_ayah', title: 'First Steps', description: 'Memorized your first ayah', threshold: 1, type: 'memorization' },
    { id: 'ten_ayahs', title: 'Decade', description: 'Memorized 10 ayahs', threshold: 10, type: 'memorization' },
    { id: 'fifty_ayahs', title: 'Half Century', description: 'Memorized 50 ayahs', threshold: 50, type: 'memorization' },
    { id: 'hundred_ayahs', title: 'Century', description: 'Memorized 100 ayahs', threshold: 100, type: 'memorization' },
    { id: 'five_hundred', title: 'Half Path', description: 'Memorized 500 ayahs', threshold: 500, type: 'memorization' },
    { id: 'thousand_ayahs', title: 'The Thousand', description: 'Memorized 1000 ayahs', threshold: 1000, type: 'memorization' },
    { id: 'hafidh', title: 'Hafidh', description: 'Memorized all 6236 ayahs of the Holy Quran', threshold: 6236, type: 'memorization' },
    
    // Surah Completion Achievements
    { id: 'first_surah', title: 'First Surah', description: 'Completed your first surah', threshold: 1, type: 'surah_completion' },
    { id: 'ten_surahs', title: 'Ten Surahs', description: 'Completed 10 surahs', threshold: 10, type: 'surah_completion' },
    { id: 'fifty_seven_surahs', title: 'More Than Half', description: 'Completed 57 surahs (half of the Quran)', threshold: 57, type: 'surah_completion' },
    
    // Specific Surah Achievement
    { id: 'al_mulk', title: 'The Sovereignty', description: 'Memorized Surah Al-Mulk', threshold: 67, type: 'specific_surah' },
    
    // Consistency Achievements
    { id: 'week_streak', title: 'Consistent Week', description: '7 days of consistent practice', threshold: 7, type: 'streak' },
    { id: 'month_streak', title: 'Dedicated Month', description: '30 days of consistent practice', threshold: 30, type: 'streak' },
    { id: 'hundred_days', title: 'Hundred Day Reciter', description: '100 days of consistent practice', threshold: 100, type: 'streak' },
 
    // Special Achievements
    { id: 'night_reciter', title: 'Night Reciter', description: 'Completed memorization after 10 PM', threshold: 1, type: 'special' },
  ];

  // Surah data with actual ayah counts
  static surahData = {
  1: { name: 'Al-Fatihah', totalAyahs: 7 },
  2: { name: 'Al-Baqarah', totalAyahs: 286 },
  3: { name: 'Ali-Imran', totalAyahs: 200 },
  4: { name: 'An-Nisa', totalAyahs: 176 },
  5: { name: 'Al-Maidah', totalAyahs: 120 },
  6: { name: 'Al-Anam', totalAyahs: 165 },
  7: { name: 'Al-Araf', totalAyahs: 206 },
  8: { name: 'Al-Anfal', totalAyahs: 75 },
  9: { name: 'At-Tawbah', totalAyahs: 129 },
  10: { name: 'Yunus', totalAyahs: 109 },
  11: { name: 'Hud', totalAyahs: 123 },
  12: { name: 'Yusuf', totalAyahs: 111 },
  13: { name: 'Ar-Ra\'d', totalAyahs: 43 },
  14: { name: 'Ibrahim', totalAyahs: 52 },
  15: { name: 'Al-Hijr', totalAyahs: 99 },
  16: { name: 'An-Nahl', totalAyahs: 128 },
  17: { name: 'Al-Isra', totalAyahs: 111 },
  18: { name: 'Al-Kahf', totalAyahs: 110 },
  19: { name: 'Maryam', totalAyahs: 98 },
  20: { name: 'Ta-Ha', totalAyahs: 135 },
  21: { name: 'Al-Anbiya', totalAyahs: 112 },
  22: { name: 'Al-Hajj', totalAyahs: 78 },
  23: { name: 'Al-Mu\'minun', totalAyahs: 118 },
  24: { name: 'An-Nur', totalAyahs: 64 },
  25: { name: 'Al-Furqan', totalAyahs: 77 },
  26: { name: 'Ash-Shu\'ara', totalAyahs: 227 },
  27: { name: 'An-Naml', totalAyahs: 93 },
  28: { name: 'Al-Qasas', totalAyahs: 88 },
  29: { name: 'Al-Ankabut', totalAyahs: 69 },
  30: { name: 'Ar-Rum', totalAyahs: 60 },
  31: { name: 'Luqman', totalAyahs: 34 },
  32: { name: 'As-Sajdah', totalAyahs: 30 },
  33: { name: 'Al-Ahzab', totalAyahs: 73 },
  34: { name: 'Saba', totalAyahs: 54 },
  35: { name: 'Fatir', totalAyahs: 45 },
  36: { name: 'Ya-Sin', totalAyahs: 83 },
  37: { name: 'As-Saffat', totalAyahs: 182 },
  38: { name: 'Sad', totalAyahs: 88 },
  39: { name: 'Az-Zumar', totalAyahs: 75 },
  40: { name: 'Ghafir', totalAyahs: 85 },
  41: { name: 'Fussilat', totalAyahs: 54 },
  42: { name: 'Ash-Shura', totalAyahs: 53 },
  43: { name: 'Az-Zukhruf', totalAyahs: 89 },
  44: { name: 'Ad-Dukhan', totalAyahs: 59 },
  45: { name: 'Al-Jathiyah', totalAyahs: 37 },
  46: { name: 'Al-Ahqaf', totalAyahs: 35 },
  47: { name: 'Muhammad', totalAyahs: 38 },
  48: { name: 'Al-Fath', totalAyahs: 29 },
  49: { name: 'Al-Hujurat', totalAyahs: 18 },
  50: { name: 'Qaf', totalAyahs: 45 },
  51: { name: 'Adh-Dhariyat', totalAyahs: 60 },
  52: { name: 'At-Tur', totalAyahs: 49 },
  53: { name: 'An-Najm', totalAyahs: 62 },
  54: { name: 'Al-Qamar', totalAyahs: 55 },
  55: { name: 'Ar-Rahman', totalAyahs: 78 },
  56: { name: 'Al-Waqi\'ah', totalAyahs: 96 },
  57: { name: 'Al-Hadid', totalAyahs: 29 },
  58: { name: 'Al-Mujadilah', totalAyahs: 22 },
  59: { name: 'Al-Hashr', totalAyahs: 24 },
  60: { name: 'Al-Mumtahanah', totalAyahs: 13 },
  61: { name: 'As-Saff', totalAyahs: 14 },
  62: { name: 'Al-Jumu\'ah', totalAyahs: 11 },
  63: { name: 'Al-Munafiqun', totalAyahs: 11 },
  64: { name: 'At-Taghabun', totalAyahs: 18 },
  65: { name: 'At-Talaq', totalAyahs: 12 },
  66: { name: 'At-Tahrim', totalAyahs: 12 },
  67: { name: 'Al-Mulk', totalAyahs: 30 },
  68: { name: 'Al-Qalam', totalAyahs: 52 },
  69: { name: 'Al-Haqqah', totalAyahs: 52 },
  70: { name: 'Al-Ma\'arij', totalAyahs: 44 },
  71: { name: 'Nuh', totalAyahs: 28 },
  72: { name: 'Al-Jinn', totalAyahs: 28 },
  73: { name: 'Al-Muzzammil', totalAyahs: 20 },
  74: { name: 'Al-Muddaththir', totalAyahs: 56 },
  75: { name: 'Al-Qiyamah', totalAyahs: 40 },
  76: { name: 'Al-Insan', totalAyahs: 31 },
  77: { name: 'Al-Mursalat', totalAyahs: 50 },
  78: { name: 'An-Naba', totalAyahs: 40 },
  79: { name: 'An-Nazi\'at', totalAyahs: 46 },
  80: { name: '\'Abasa', totalAyahs: 42 },
  81: { name: 'At-Takwir', totalAyahs: 29 },
  82: { name: 'Al-Infitar', totalAyahs: 19 },
  83: { name: 'Al-Mutaffifin', totalAyahs: 36 },
  84: { name: 'Al-Inshiqaq', totalAyahs: 25 },
  85: { name: 'Al-Buruj', totalAyahs: 22 },
  86: { name: 'At-Tariq', totalAyahs: 17 },
  87: { name: 'Al-A\'la', totalAyahs: 19 },
  88: { name: 'Al-Ghashiyah', totalAyahs: 26 },
  89: { name: 'Al-Fajr', totalAyahs: 30 },
  90: { name: 'Al-Balad', totalAyahs: 20 },
  91: { name: 'Ash-Shams', totalAyahs: 15 },
  92: { name: 'Al-Layl', totalAyahs: 21 },
  93: { name: 'Ad-Duha', totalAyahs: 11 },
  94: { name: 'Ash-Sharh', totalAyahs: 8 },
  95: { name: 'At-Tin', totalAyahs: 8 },
  96: { name: 'Al-\'Alaq', totalAyahs: 19 },
  97: { name: 'Al-Qadr', totalAyahs: 5 },
  98: { name: 'Al-Bayyinah', totalAyahs: 8 },
  99: { name: 'Az-Zalzalah', totalAyahs: 8 },
  100: { name: 'Al-\'Adiyat', totalAyahs: 11 },
  101: { name: 'Al-Qari\'ah', totalAyahs: 11 },
  102: { name: 'At-Takathur', totalAyahs: 8 },
  103: { name: 'Al-\'Asr', totalAyahs: 3 },
  104: { name: 'Al-Humazah', totalAyahs: 9 },
  105: { name: 'Al-Fil', totalAyahs: 5 },
  106: { name: 'Quraysh', totalAyahs: 4 },
  107: { name: 'Al-Ma\'un', totalAyahs: 7 },
  108: { name: 'Al-Kawthar', totalAyahs: 3 },
  109: { name: 'Al-Kafirun', totalAyahs: 6 },
  110: { name: 'An-Nasr', totalAyahs: 3 },
  111: { name: 'Al-Masad', totalAyahs: 5 },
  112: { name: 'Al-Ikhlas', totalAyahs: 4 },
  113: { name: 'Al-Falaq', totalAyahs: 5 },
  114: { name: 'An-Nas', totalAyahs: 6 }
};

  static checkAchievements(state) {
    if (!state) return [];
    
    const newAchievements = [];
    const earnedAchievements = state.earnedAchievements || [];
    
    this.achievements.forEach(achievement => {
      if (earnedAchievements.includes(achievement.id)) return;
      
      if (this.isAchievementEarned(achievement, state)) {
        newAchievements.push(achievement);
      }
    });
    
    return newAchievements;
  }

  static isAchievementEarned(achievement, state) {
    switch (achievement.type) {
      case 'memorization':
        return this.getTotalMemorizedAyahs(state) >= achievement.threshold;
      
      case 'surah_completion':
        return this.getCompletedSurahs(state).length >= achievement.threshold;
      
      case 'specific_surah':
        return this.isSurahCompleted(state, achievement.threshold);
      
      case 'streak':
        return this.getCurrentStreak(state) >= achievement.threshold;
      
      case 'tikrar_completion':
        return this.getTikrarCompletionStreak(state) >= achievement.threshold;
      
      case 'juz_completion':
        return this.isJuzCompleted(state, achievement.threshold);
      
      case 'special':
        return this.checkSpecialAchievement(achievement.id, state);
      
      default:
        return false;
    }
  }

  static getTotalMemorizedAyahs(state) {
    let count = 0;
    Object.values(state?.ayahProgress || {}).forEach(surah => {
      Object.values(surah).forEach(ayah => {
        if (ayah.memorized) count++;
      });
    });
    return count;
  }

  static getCompletedSurahs(state) {
    const completedSurahs = [];
    
    if (!state?.ayahProgress) return completedSurahs;
    
    Object.keys(state.ayahProgress).forEach(surahId => {
      const surahProgress = state.ayahProgress[surahId];
      const memorizedCount = Object.values(surahProgress).filter(ayah => ayah.memorized).length;
      
      // Get actual surah length or use memorized count as approximation
      const surahInfo = this.surahData[parseInt(surahId)];
      const totalAyahs = surahInfo ? surahInfo.totalAyahs : memorizedCount;
      
      // Consider surah complete if all ayahs are memorized
      if (memorizedCount >= totalAyahs) {
        completedSurahs.push(parseInt(surahId));
      }
    });
    
    return completedSurahs;
  }

  static isSurahCompleted(state, surahId) {
    const completedSurahs = this.getCompletedSurahs(state);
    return completedSurahs.includes(surahId);
  }

  static getCurrentStreak(state) {
    const progress = state?.progress || {};
    const keys = Object.keys(progress).sort((a, b) => b.localeCompare(a)); // Descending order
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < keys.length; i++) {
      const date = new Date(keys[i] + 'T00:00:00');
      const daysDiff = Math.floor((today - date) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === i && Number(progress[keys[i]]) > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  static getTikrarCompletionStreak(state) {
    // Count days where all 4 Tikrar categories were completed
    let streak = 0;
    const tikrarProgress = state?.tikrarProgress || {};
    const keys = Object.keys(tikrarProgress).sort((a, b) => b.localeCompare(a));
    
    for (const dateKey of keys) {
      const dayProgress = tikrarProgress[dateKey];
      const categories = ['newMemorization', 'repetitionOfYesterday', 'connection', 'revision'];
      
      const allCompleted = categories.every(cat => {
        // Check if category was completed (rough logic)
        return (dayProgress[cat] || 0) > 0;
      });
      
      if (allCompleted) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  static isJuzCompleted(state, juzNumber) {
    // Simplified - would need actual Juz mapping
    return juzNumber === 30 && this.getTotalMemorizedAyahs(state) >= 564; // Rough Juz Amma ayah count
  }

  static checkSpecialAchievement(achievementId, state) {
    const today = new Date().toISOString().split('T')[0];
    const todayTikrar = state?.tikrarProgress?.[today];
    
    switch (achievementId) {      
      case 'night_reciter':
        // Similar logic for late completion
        return todayTikrar && Object.values(todayTikrar).some(val => val > 0);
      
      default:
        return false;
    }
  }

  static async awardAchievements(state, newAchievements) {
    if (newAchievements.length === 0) return state;
    
    const updatedState = { ...state };
    if (!updatedState.earnedAchievements) updatedState.earnedAchievements = [];
    
    newAchievements.forEach(achievement => {
      updatedState.earnedAchievements.push(achievement.id);
    });
    
    return updatedState;
  }
}
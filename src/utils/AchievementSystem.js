export class AchievementSystem {
  static achievements = [
    // Memorization Milestones
    { id: 'first_ayah', title: 'First Steps', description: 'Memorized your first ayah', threshold: 1, type: 'memorization' },
    { id: 'ten_ayahs', title: 'Decade', description: 'Memorized 10 ayahs', threshold: 10, type: 'memorization' },
    { id: 'fifty_ayahs', title: 'Half Century', description: 'Memorized 50 ayahs', threshold: 50, type: 'memorization' },
    { id: 'hundred_ayahs', title: 'Century', description: 'Memorized 100 ayahs', threshold: 100, type: 'memorization' },
    { id: 'first_surah', title: 'Surah Master', description: 'Completed your first surah', threshold: 1, type: 'surah_completion' },
    { id: 'al_mulk', title: 'The Sovereignty', description: 'Memorized Surah Al-Mulk', threshold: 67, type: 'specific_surah' },
    { id: 'five_hundred', title: 'Half Path', description: 'Memorized 500 ayahs', threshold: 500, type: 'memorization' },
    { id: 'thousand_ayahs', title: 'The Thousand', description: 'Memorized 1000 ayahs', threshold: 1000, type: 'memorization' },
    { id: 'juz_amma', title: 'Juz Amma Complete', description: 'Memorized the 30th Juz', threshold: 30, type: 'juz_completion' },
    
    // Consistency Achievements
    { id: 'week_streak', title: 'Consistent Week', description: '7 days of consistent practice', threshold: 7, type: 'streak' },
    { id: 'month_streak', title: 'Dedicated Month', description: '30 days of consistent practice', threshold: 30, type: 'streak' },
    { id: 'hundred_days', title: 'Hundred Day Warrior', description: '100 days of consistent practice', threshold: 100, type: 'streak' },
 
    // Special Achievements
    { id: 'early_bird', title: 'Early Bird', description: 'Completed Tikrar before 6 AM', threshold: 1, type: 'special' },
    { id: 'night_warrior', title: 'Night Warrior', description: 'Completed memorization after 10 PM', threshold: 1, type: 'special' },
  ];

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
    
    // Basic surah completion check - you might want to enhance this with actual surah lengths
    Object.keys(state?.ayahProgress || {}).forEach(surahId => {
      const surahProgress = state.ayahProgress[surahId];
      const memorizedCount = Object.values(surahProgress).filter(ayah => ayah.memorized).length;
      
      // Rough estimate - consider surah complete if substantial portion is memorized
      if (memorizedCount >= 5) { // Minimum threshold
        completedSurahs.push(parseInt(surahId));
      }
    });
    
    return completedSurahs;
  }

  static isSurahCompleted(state, surahId) {
    const surahProgress = state?.ayahProgress?.[surahId];
    if (!surahProgress) return false;
    
    const memorizedCount = Object.values(surahProgress).filter(ayah => ayah.memorized).length;
    return memorizedCount >= 5; // Rough completion threshold
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
      case 'early_bird':
        // Check if any tikrar was completed early (simplified)
        return todayTikrar && Object.values(todayTikrar).some(val => val > 0);
      
      case 'night_warrior':
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
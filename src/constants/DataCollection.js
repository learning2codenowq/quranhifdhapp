// This file documents what data we collect for Play Store compliance
export const DATA_COLLECTION = {
  // Data collected and stored locally
  PERSONAL_INFO: {
    userName: 'Optional user name for personalization',
    dailyGoal: 'User-selected memorization target'
  },
  
  APP_ACTIVITY: {
    memorization_progress: 'Which ayahs user has memorized',
    daily_stats: 'Daily memorization counts',
    achievements: 'Unlocked achievements',
    settings: 'App preferences and configuration'
  },
  
  // Data NOT collected
  NOT_COLLECTED: [
    'Location data',
    'Camera/Photo access', 
    'Microphone/Audio recording',
    'Contacts',
    'Phone calls',
    'SMS messages',
    'Device ID',
    'Advertising ID'
  ],
  
  // External API usage (anonymous)
  EXTERNAL_APIS: {
    quran_content: 'Fetch Quran text and audio (no personal data sent)',
    error_logging: 'Anonymous error reports for app improvement'
  }
};
Quran Hifdh App - Complete Technical Context
Table of Contents

Overview
Tech Stack
Project Structure
Core Architecture
Key Features
Data Models
Services
Utils
Components
Screens
Styling & Theming
Configuration
Important Patterns


Overview
Quran Hifdh is a React Native Expo mobile application designed to help Muslims memorize the Holy Quran through structured learning and intelligent revision methods.
Current Version: 1.0.0
Platform: iOS & Android
Bundle IDs:

iOS: com.shayan.quranhifdh
Android: com.shayan.quranhifdh


Tech Stack
Core Framework

React: 19.1.0
React Native: 0.81.4
Expo SDK: 54.0.13

Navigation

@react-navigation/native: ^7.1.18
@react-navigation/stack: ^7.4.9
react-native-screens: ^4.16.0
react-native-safe-area-context: ~5.6.0

Storage & State

@react-native-async-storage/async-storage: 2.2.0
Local AsyncStorage for all data (no backend)

Audio

expo-av: ~16.0.7
expo-audio: ~1.0.13

UI Components

expo-linear-gradient: ~15.0.7
expo-blur: ~15.0.7
react-native-svg: 15.12.1
react-native-confetti-cannon: ^1.5.2
@expo/vector-icons: ^15.0.2

Notifications

expo-notifications: ~0.32.12

Other Key Dependencies

expo-font: ~14.0.9 (for Uthmani & IndoPak Arabic fonts)
expo-file-system: ~19.0.17
expo-sharing: ~14.0.7
react-native-render-html: ^6.3.4
@react-native-community/datetimepicker: 8.4.4


Project Structure
quran-hifdh/
├── App.js                          # Root component with navigation setup
├── app.json                        # Expo configuration
├── eas.json                        # EAS Build configuration
├── package.json                    # Dependencies
├── assets/
│   ├── fonts/
│   │   ├── KFGQPC_Uthmanic_Script_HAFS_Regular.otf
│   │   └── IndoPak.ttf
│   ├── icon.png
│   ├── splash.png
│   └── adaptive-icon.png
└── src/
    ├── components/                 # Reusable UI components
    │   ├── AchievementModal.js
    │   ├── AnimatedButton.js
    │   ├── AnimatedCard.js
    │   ├── AnimatedProgressRing.js
    │   ├── BottomNavigation.js
    │   ├── ContinueCard.js
    │   ├── CustomTimePicker.js
    │   ├── ErrorBoundary.js
    │   ├── Icon.js
    │   ├── LoadingSpinner.js
    │   ├── ModernLoadingScreen.js
    │   ├── SkeletonLoader.js
    │   ├── SurahCompletionModal.js
    │   ├── TikrarPlan.js
    │   └── WeeklyProgress.js
    ├── constants/
    │   └── DataCollection.js        # Privacy/data collection documentation
    ├── screens/                     # App screens
    │   ├── AboutScreen.js
    │   ├── AchievementsScreen.js
    │   ├── AnalyticsScreen.js
    │   ├── ClassicMushafScreen.js
    │   ├── DashboardScreen.js
    │   ├── OnboardingScreen.js
    │   ├── PrivacyPolicyScreen.js
    │   ├── QuranReaderScreen.js
    │   ├── ReadingScreen.js
    │   ├── SettingsScreen.js
    │   ├── SplashScreen.js
    │   ├── SurahListScreen.js
    │   ├── TermsOfServiceScreen.js
    │   └── TikrarActivityScreen.js
    ├── services/                    # Business logic services
    │   ├── AudioService.js
    │   ├── NotificationService.js
    │   ├── QuranService.js
    │   └── StorageService.js
    ├── styles/                      # Theming and styling
    │   ├── theme.js
    │   └── typography.js
    └── utils/                       # Utility functions
        ├── AchievementSystem.js
        ├── AnalyticsUtils.js
        ├── BackupUtils.js
        ├── ErrorHandler.js
        ├── FontLoader.js
        ├── Logger.js
        ├── NetworkUtils.js
        ├── PerformanceMonitor.js
        ├── PerformanceTracker.js
        ├── PerformanceUtils.js
        ├── QuranUtils.js
        ├── TajweedParser.js
        ├── TestingUtils.js
        └── TextCleaner.js

Core Architecture
Architecture Pattern
Service-Oriented Architecture with clear separation of concerns:

Screens: UI presentation layer
Components: Reusable UI elements
Services: Business logic and external integrations
Utils: Helper functions and algorithms
Styles: Centralized theming

Data Flow
User Action → Screen → Service → Storage/API → Utils → State Update → UI Re-render
State Management

Local State: React hooks (useState, useEffect)
Persistent State: AsyncStorage via StorageService
No Global State Management: Direct service calls from components


Key Features
1. Memorization Tracking

Mark ayahs as memorized
Track daily progress
Calculate statistics (total memorized, remaining, percentage)
Surah completion tracking

2. Intelligent Revision System (7-Day Rolling Window)

New Memorization: Daily goal-based learning
Revision: Automatic 7-day rolling revision schedule

Days 1: No revision (just memorize)
Days 2-7: Revise all previous days (3x each)
Day 8+: Revise last 6 days (rolling window, 3x each)



3. Audio Integration

Quran recitation playback
Multiple reciter support
Auto-play next ayah
Segment replay (repetition with counts)

4. Achievement System

Memorization milestones (10, 50, 100, 500, 1000 ayahs)
Surah completion achievements
Streak achievements (7, 30, 100 days)
Special achievements

5. Analytics & Statistics

Weekly/monthly progress charts
Streak tracking
Surah progress visualization
Daily goal tracking

6. Notifications

Morning reminder (preferably after Fajr)
Evening reminder
Customizable times
Local notifications (no push required)

7. Multi-Script Support

Uthmani (Madina Mushaf style)
IndoPak (Pakistani/Indian style)
Tajweed (Color-coded Tajweed rules)

8. Dark Mode

Full dark mode support throughout the app
Theme switching in settings


Data Models
Application State Structure
javascript{
  // Ayah-level memorization tracking
  ayahProgress: {
    [surahId]: {
      [ayahNumber]: {
        memorized: boolean,
        dateMemorized: 'YYYY-MM-DD',
        difficulty: 1-3
      }
    }
  },
  
  // Daily progress tracking
  progress: {
    'YYYY-MM-DD': number  // ayahs memorized that day
  },
  
  // Revision tracking
  revisionProgress: {
    'YYYY-MM-DD': {
      newMemorization: number,
      revision: number
    }
  },
  
  // Last memorized position (for "Continue" feature)
  lastMemorizedPosition: {
    surahId: number,
    ayahNumber: number,
    timestamp: ISO string
  },
  
  // Achievements
  earnedAchievements: [achievementId],
  
  // User settings
  settings: {
    dailyGoal: number,
    userName: string,
    darkMode: boolean,
    showTranslations: boolean,
    arabicFontSize: 'Small' | 'Medium' | 'Large' | 'Extra Large',
    translationFontSize: 'Small' | 'Medium' | 'Large' | 'Extra Large',
    autoPlayNext: boolean,
    selectedReciter: number | null,
    scriptType: 'uthmani' | 'indopak' | 'tajweed',
    notificationsEnabled: boolean,
    morningTime: { hour: number, minute: number },
    eveningTime: { hour: number, minute: number }
  },
  
  // Confetti tracking (prevent multiple shows per day)
  lastConfettiDate: 'YYYY-MM-DD'
}

Services
StorageService
Location: src/services/StorageService.js
Purpose: Manages all local data persistence using AsyncStorage.
Key Methods:
javascript// Get application state
static async getState(): Promise<State | null>

// Save application state
static async saveState(state: State): Promise<boolean>

// Initialize state for new users
static async initializeState(userSettings): Promise<State>

// Update revision progress
static async updateRevisionProgress(categoryType, progress): Promise<State | false>

// Clear all data
static async clearState(): Promise<boolean>
Storage Key: 'quran_mem_tracker_v2'

QuranService
Location: src/services/QuranService.js
Purpose: Fetches Quran data from Cloudflare Worker API.
API Base URL: https://quran.shayanshehzadqureshi.workers.dev/
Key Methods:
javascript// Get surah with translation and audio
static async getSurahWithTranslation(surahId, reciterId, scriptType): Promise<{
  surah: SurahInfo,
  ayahs: Ayah[],
  bismillah: string
}>

// Get all surahs list
static async getAllSurahs(): Promise<Surah[]>

// Get page for Classic Mushaf view
static async getPageData(pageNumber): Promise<PageData>

// Get list of reciters
static async getReciters(): Promise<Reciter[]>
API Endpoints:

/api/qf/verses?chapter={id}&perPage=300&reciterId={id}&textFormat={format}
/api/qf/chapters
/api/qf/page?pageNumber={num}&textFormat=uthmani
/api/qf/reciters


AudioService
Location: src/services/AudioService.js
Purpose: Manages Quran audio playback using expo-av.
Key Methods:
javascript// Setup audio mode
static async setupAudio(): Promise<boolean>

// Play ayah from URL with completion callback
static async playAyahFromUrl(audioUrl, onComplete): Promise<boolean>

// Stop audio playback
static async stopAudio(): Promise<void>

// Pause/resume
static async pauseAudio(): Promise<void>
static async resumeAudio(): Promise<void>

// Get current playback status
static getPlaybackStatus(): { isPlaying: boolean, hasSound: boolean }
Important Notes:

Audio URLs come from API response
Handles auto-play next ayah
Manages completion callbacks for segment replay
No delays in playback transitions (optimized for replay feature)


NotificationService
Location: src/services/NotificationService.js
Purpose: Manages local notifications for daily reminders.
Key Methods:
javascript// Request notification permissions
static async requestPermissions(): Promise<boolean>

// Schedule daily notifications
static async scheduleNotifications(morningTime, eveningTime, dailyGoal): Promise<boolean>

// Save notification settings
static async saveNotificationSettings(morningTime, eveningTime, enabled): Promise<boolean>

// Get notification settings
static async getNotificationSettings(): Promise<NotificationSettings>
Important Implementation Details:

Uses 5-minute buffer to prevent immediate notification triggers
Schedules both one-time (initial) and recurring notifications
Morning notification: "🌅 As-salamu alaykum! Ready for today's Quran session?"
Evening notification: "🌙 Don't break your streak!"


Utils
QuranUtils
Location: src/utils/QuranUtils.js
Purpose: Core business logic for memorization tracking and calculations.
Key Methods:
javascript// Get local ISO date string
static localISO(date = new Date()): string  // 'YYYY-MM-DD'

// Mark ayah as memorized
static async markAyahMemorized(surahId, ayahNumber, difficulty): Promise<State>

// Unmark ayah (remove from memorized)
static async unmarkAyahMemorized(surahId, ayahNumber): Promise<State>

// Calculate statistics
static computeStats(state): {
  memorized: number,
  total: number,
  remaining: number,
  percentComplete: number,
  daily: number,
  daysLeft: number
}

// Calculate current streak
static computeStreak(progressData): number

// Get revision plan (7-day rolling)
static getRevisionPlan(state): {
  newMemorization: { target, completed, description },
  revision: { target, completed, description, displayText, ayahRanges },
  totalDailyLoad: number
}

// Get next memorization segment (for "Continue" feature)
static getNextMemorizationSegment(state): {
  surahId, surahName, startAyah, endAyah, totalAyahs, isNewUser
}

// Get memorization history by date
static getMemorizationHistory(state): DayHistory[]

// Group consecutive ayahs for display
static groupConsecutiveAyahs(ayahs): GroupedAyah[]

// Get surah name by ID
static getSurahName(surahId): string

// Get Tikrar progress for a date
static getTikrarProgress(state, date): {
  newMemorization: number,
  revision: number
}

// Check and award achievements
static async checkAndAwardAchievements(state): Promise<{
  updatedState: State,
  newAchievements: Achievement[]
}>
Critical Algorithm: 7-Day Rolling Revision System
javascript// Days 1: No revision (come back tomorrow)
// Days 2-7: Revise ALL previous days (3x each)
// Day 8+: Revise LAST 6 days only (rolling window, 3x each)

static getSimpleRevisionData(state): {
  totalRecitations: 3,  // Always 3 times total
  description: string,
  displayText: string,
  ayahRanges: DayHistory[]
}

AchievementSystem
Location: src/utils/AchievementSystem.js
Purpose: Defines and manages achievement logic.
Achievement Types:

Memorization: Based on total ayahs (1, 10, 50, 100, 500, 1000, 6236)
Surah Completion: Based on completed surahs (1, 10, 57)
Specific Surah: Completion of specific surahs (e.g., Al-Mulk)
Streak: Consecutive days (7, 30, 100)
Special: Unique achievements (e.g., night reciter)

Key Methods:
javascript// Check what achievements user has earned
static checkAchievements(state): Achievement[]

// Check if specific achievement is earned
static isAchievementEarned(achievement, state): boolean

// Award achievements to user
static async awardAchievements(state, newAchievements): Promise<State>

// Helper methods
static getTotalMemorizedAyahs(state): number
static getCompletedSurahs(state): number[]
static isSurahCompleted(state, surahId): boolean
static getCurrentStreak(state): number
Surah Data: Contains 114 surahs with accurate ayah counts.

AnalyticsUtils
Location: src/utils/AnalyticsUtils.js
Purpose: Calculate analytics and statistics.
Key Methods:
javascript// Get weekly analytics (last 7 days)
static getWeeklyAnalytics(state): {
  dailyData: DayData[],
  totalWeekAyahs: number,
  averageDaily: number,
  streak: number,
  revisionCompletionRate: number
}

// Get monthly analytics (last 30 days)
static getMonthlyAnalytics(state): {
  weeklyData: WeekData[],
  totalMonthAyahs: number,
  bestWeek: number,
  consistentDays: number
}

// Get surah-by-surah progress
static getSurahProgress(state): SurahProgress[]

// Get projections (optimistic, realistic, conservative)
static getProjections(state): Projections

TajweedParser
Location: src/utils/TajweedParser.js
Purpose: Parse Tajweed HTML markup and apply colors.
Tajweed Colors:
javascriptTAJWEED_COLORS = {
  // Ghunnah & Ikhfa - GREEN
  'ghunnah': '#169777',
  'ikhafa': '#169777',
  
  // Idgham without Ghunnah - DARK GREEN
  'idgham_wo_ghunnah': '#095d42',
  
  // Qalqalah - RED
  'qalaqah': '#DD0008',
  
  // Madd - PURPLE
  'madda_normal': '#7B1FA2',
  
  // Silent/Lam Shamsiyyah - GREY
  'ham_wasl': '#AAAAAA',
  'slnt': '#AAAAAA'
}
Key Functions:
javascript// Parse HTML into text segments with colors
parseTajweedText(htmlText): Segment[]  // { text, color }

// Check if text has Tajweed markup
hasTajweedMarkup(text): boolean

Other Utils
NetworkUtils: Connection checking and retry logic with exponential backoff.
ErrorHandler: Centralized error handling with user-friendly alerts.
Logger: Development/production logging with different levels.
TextCleaner: Clean Arabic text from unwanted annotation marks.
TestingUtils: Diagnostic tools and test data generation (dev only).

Components
Core UI Components
AnimatedButton
Props: title, onPress, style, variant, size, icon, loading, disabled, hapticFeedback
Variants: primary, secondary, success, outline
AnimatedCard
Props: children, onPress, style, variant, padding
Variants: default, elevated, outlined
AnimatedProgressRing
Props: percentage, size, darkMode
Visual circular progress indicator with percentage display.
BottomNavigation
Props: currentRoute, onNavigate
Three tabs: Home (Dashboard), Reading, Settings.
ContinueCard
Props: segment, onContinue, darkMode
Hero card showing next memorization segment or "Start Memorizing" for new users.
WeeklyProgress
Props: state, darkMode
Visual week display (M-T-W-T-F-S-S) with status dots:

Green: Completed
Red: Failed
Grey (light): Pending
Grey (dark): Future

TikrarPlan
Props: revisionPlan, state, onCategoryPress
Displays today's memorization and revision plan with progress.
AchievementModal
Props: visible, achievements, onClose
Celebration modal when achievements are unlocked.
SurahCompletionModal
Props: visible, surahName, surahNameArabic, onClose
Special celebration when a surah is completed (with confetti).
ModernLoadingScreen
Props: darkMode, message, subtitle, progress
Full-screen loading with animated spinner.
SkeletonLoader
Components: SkeletonLine, SkeletonCircle, DashboardSkeleton, SurahListSkeleton
Shimmer loading placeholders.

Screens
DashboardScreen
Route: Dashboard
Purpose: Main home screen showing progress, stats, and today's plan.
Key Features:

Continue Card (next memorization segment)
Today's progress bar
Today's plan (New Memorization + Revision cards)
Weekly progress display
Progress overview with ring
Analytics/Achievements shortcuts
Confetti celebration when daily goal + revision both complete

Navigation:

Continue Card → QuranReader or SurahList
Plan cards → SurahList or TikrarActivity
Shortcuts → Analytics, Achievements


QuranReaderScreen
Route: QuranReader
Params: { surahId, scrollToAyah? }
Purpose: Read and memorize ayahs with audio.
Key Features:

Arabic text with Uthmani/IndoPak/Tajweed scripts
Translation toggle
Audio playback per ayah
Auto-play next ayah
Mark/unmark as memorized
Repetition counter per ayah
Segment replay (repeat range N times)
Font size controls
Scroll to specific ayah

Important Notes:

Uses FlatList for performance
Loads data based on scriptType setting
Audio URLs from API response
Confetti + modal on surah completion


SurahListScreen
Route: SurahList
Purpose: Browse all 114 surahs.
Key Features:

Search by number, English name, or Arabic name
Progress bar for each surah
Completion badge for finished surahs
Surah metadata (type, ayah count)

Navigation: Click surah → QuranReader

OnboardingScreen
Route: Onboarding
Purpose: First-time setup wizard.
Steps:

Welcome & Hadith quote
Enter name
Choose daily target (5, 10, 15, 20 ayahs)
Set notification times (morning + evening)

On Complete: Initialize state → Navigate to Dashboard

SettingsScreen
Route: Settings
Purpose: App configuration.
Sections:

Account: Name, Daily Target, Delete Data
Notifications: Enable/disable, Morning/evening times
Audio: Auto-play next, Reciter selection
Display: Dark mode, Translations, Script type, Font sizes
Data & Privacy: Privacy Policy, Terms, About, Backup/restore


AnalyticsScreen
Route: Analytics
Purpose: Detailed statistics and charts.
Tabs:

This Week: Daily breakdown chart, total, average
This Month: Weekly breakdown, best week, consistent days
Progress: Surah-by-surah progress list


AchievementsScreen
Route: Achievements
Purpose: View all achievements.
Categories:

Memorization Milestones
Surah Completion
Special Surahs
Consistency Streaks
Special Achievements

Display: Locked (grey) vs Earned (colored with checkmark)

ClassicMushafScreen
Route: ClassicMushaf
Purpose: Page-by-page Quran reading (like physical Mushaf).
Key Features:

604 pages
Horizontal swipe navigation
Jump to page
Saves last read page
Juz indicators
Uthmani script only


Other Screens
ReadingScreen: Choose reading mode (currently shows "Coming Soon" placeholders).
TikrarActivityScreen: Detailed view of revision category with progress tracking.
SplashScreen: Initial app load screen (2 seconds).
AboutScreen: App info, version, contact details.
PrivacyPolicyScreen: Full privacy policy text.
TermsOfServiceScreen: Full terms of service text.

Styling & Theming
Theme Structure
Location: src/styles/theme.js
Color Palette:
javascriptcolors: {
  // Primary Brand (Peaceful Teal)
  primary: '#22575D',
  primaryLight: '#55BAC6',
  secondary: '#d4af37',  // Gold
  
  // Success
  success: '#6B9B7C',
  successLight: '#E8F4EA',
  
  // Status
  warning: '#D4A574',
  error: '#C87B7B',
  info: '#55BAC6',
  
  // Text (Light Mode)
  textPrimary: '#2C3E3F',
  textSecondary: '#556B6D',
  textMuted: '#7A8E90',
  textOnDark: '#FFFFFF',
  
  // Dark Mode
  dark: {
    background: '#0F1419',
    cardBackground: '#1A1F26',
    surface: '#252C35',
    primary: '#55BAC6',
    textPrimary: '#E8ECEC',
    // ... more dark colors
  }
}
Typography:
javascriptfontSize: {
  xs: 12, sm: 14, base: 16, lg: 18, xl: 20,
  '2xl': 24, '3xl': 28, '4xl': 32, '5xl': 48, '6xl': 60
}

fontWeight: {
  normal: '400', medium: '500', semibold: '600', bold: '700'
}

fontFamily: {
  regular: 'System',
  arabic: 'UthmanicFont'
}
Gradients:
javascriptgradients: {
  primary: ['#22575D', '#55BAC6'],
  secondary: ['#B8947D', '#D4C4B0'],
  success: ['#6B9B7C', '#8FBC9F']
}
Spacing: xs: 4, sm: 8, md: 12, lg: 16, xl: 20, 2xl: 24, 3xl: 32, ...
Shadows: sm, md, lg, xl with elevation values

Dark Mode Support
Helper Function:
javascriptgetThemedColors(isDarkMode): ThemeColors
Usage Pattern:
javascriptconst themedColors = getThemedColors(settings.darkMode);

// In styles
backgroundColor: settings.darkMode ? themedColors.cardBackground : Theme.colors.cardBackground

Configuration
app.json
json{
  "expo": {
    "name": "Quran Hifdh",
    "slug": "quran-hifdh",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "backgroundColor": "#22575D"
    },
    "ios": {
      "bundleIdentifier": "com.shayan.quranhifdh"
    },
    "android": {
      "package": "com.shayan.quranhifdh",
      "versionCode": 3,
      "permissions": [
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "SCHEDULE_EXACT_ALARM"
      ]
    },
    "plugins": [
      ["expo-font", { "fonts": [...] }],
      ["expo-notifications", {...}],
      "expo-dev-client"
    ]
  }
}
eas.json
json{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  }
}

Important Patterns
1. Date Handling
Always use QuranUtils.localISO() for date strings:
javascriptconst today = QuranUtils.localISO();  // 'YYYY-MM-DD'
2. State Updates
Always update state through services:
javascript// Correct
await QuranUtils.markAyahMemorized(surahId, ayahNumber);

// Incorrect - don't directly modify state
state.ayahProgress[surahId][ayahNumber] = { memorized: true };
3. Loading States
Use skeleton loaders for better UX:
javascriptif (loading) {
  return <DashboardSkeleton darkMode={settings.darkMode} />;
}
4. Error Handling
Use ErrorHandler for consistent error messages:
javascripttry {
  await someOperation();
} catch (error) {
  ErrorHandler.handleStorageError(error, 'operation name');
}
5. Navigation
Always check if navigation ref exists:
javascriptif (navigationRef.current) {
  navigationRef.current.navigate('ScreenName');
}
6. Audio Playback
Always stop previous audio before playing new:
javascriptawait AudioService.stopAudio();
const success = await AudioService.playAyahFromUrl(audioUrl, onComplete);
7. Accessibility
Always add accessibility props to touchable components:
javascript<TouchableOpacity
  accessible={true}
  accessibilityLabel="Description"
  accessibilityHint="What happens when pressed"
  accessibilityRole="button"
>
8. Dark Mode
Always check darkMode and use themedColors:
javascriptconst themedColors = getThemedColors(settings.darkMode);

<View style={[
  styles.card,
  settings.darkMode && { backgroundColor: themedColors.cardBackground }
]} />
9. Font Loading
Fonts are loaded in App.js before anything else:
javascriptconst loaded = await loadFonts();
setFontsLoaded(loaded);
10. Performance

Use React.memo for expensive components
Use getItemLayout for FlatLists when possible
Remove clipped subviews for long lists
Lazy load data when needed


API Integration
Base URL
https://quran.shayanshehzadqureshi.workers.dev/
Key Endpoints
Get Surah with Translation & Audio:
GET /api/qf/verses?chapter={id}&perPage=300&reciterId={id}&textFormat={format}

Response:
{
  chapter: { id, name_simple, name_arabic, verses_count },
  verses: [{ number, text, translationHtml, audioUrl }],
  bismillah: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"
}
Get All Chapters:
GET /api/qf/chapters

Response:
{
  chapters: [{ id, name_simple, name_arabic, verses_count, revelation_place }]
}
Get Page Data (Mushaf):
GET /api/qf/page?pageNumber={num}&textFormat=uthmani

Response:
{
  page: { number, juz_number, hizb_number },
  verses: [{ key, number, text, translation }]
}
Get Reciters:
GET /api/qf/reciters

Response:
{
  reciters: [{ id, name, translated_name, style, qirat }]
}

Testing & Development
Dev Tools (__DEV__ only)
Testing Utils (src/utils/TestingUtils.js):
javascript// Run diagnostics
await TestingUtils.runDiagnostics();

// Load test data
await TestingUtils.loadTestData();

// Clear all data
await TestingUtils.clearAllData();
Access in Settings (only in development builds):

Settings → Testing & Diagnostics section appears


Common Issues & Solutions
1. Audio Not Playing

Check internet connection
Verify audioUrl is not null/undefined
Ensure previous audio was stopped
Check device volume

2. Fonts Not Loading

Ensure fonts are in assets/fonts/
Check app.json expo-font plugin configuration
Fonts load in App.js before anything else

3. Notifications Not Showing

Check permissions in device settings
Verify notifications are enabled in app settings
Check that times are not in the past (5-minute buffer)

4. Data Not Persisting

Check AsyncStorage permissions
Verify StorageService.saveState() is awaited
Check error logs in ErrorHandler

5. Dark Mode Not Applied

Ensure settings.darkMode is loaded from state
Use getThemedColors(settings.darkMode) helper
Check conditional styling in components


Build & Deployment
Development Build
basheas build --profile development --platform ios
eas build --profile development --platform android
Production Build
basheas build --profile production --platform ios
eas build --profile production --platform android
Submit to Stores
basheas submit --platform ios
eas submit --platform android

Important Notes
Data Privacy

All data stored locally - no backend server
No user accounts or authentication
No data collection except anonymous crash reports
Users can delete all data from settings

Islamic Considerations

Uthmanic script for authentic Quran text
Multiple reciter support for audio
Tajweed color-coding for proper pronunciation
Respects Quran with proper Basmala display

Performance

Uses FlatList with optimization for large lists
Lazy loading for Mushaf pages
Skeleton loaders for better perceived performance
Audio preloading disabled (streams on-demand)

Offline Support

Quran text requires internet (API-based)
Audio requires internet (streamed)
Progress/settings stored locally
Works offline after initial data load


Future Enhancements (Referenced in Code)

Coming Soon Placeholders:

Word-by-word translation mode
Data import/export functionality


Potential Features:

Backup to cloud
Multiple user profiles
Custom revision algorithms
Quizzes and tests
Social features (leaderboards)




Contact & Support
Developer: Shayan Qureshi
Email: shayanshehzadqureshi@gmail.com
Project ID: fea4e8e0-f651-4ddf-b910-50034f434b07

Version History
v1.0.0 (Current)

Initial release
Full memorization tracking
7-day rolling revision system
Achievement system
Analytics dashboard
Multi-script support (Uthmani, IndoPak, Tajweed)
Dark mode
Audio playback with multiple reciters
Notifications
Classic Mushaf page reader
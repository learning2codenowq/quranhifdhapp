Quran Hifdh App - Complete Documentation
📱 App Overview
Name: Quran Hifdh
Package: com.shayan.quranhifdh
Version: 1.0.0 (versionCode: 3)
Platform: React Native (Expo)
Purpose: A comprehensive Quran memorization companion app with structured learning, revision methods, progress tracking, and achievements.

🎨 Design System & Theme
Color Palette
javascriptPrimary Colors:
- Primary: #22575D (Peaceful Teal - Dark)
- Primary Light: #55BAC6 (Light Teal)
- Secondary: #d4af37 (Gold)
- Secondary Light: #f1cd57ff (Light Gold)

Success & Achievement:
- Success: #6B9B7C (Sage Green)
- Success Light: #E8F4EA

Status Colors:
- Warning: #D4A574
- Error: #C87B7B
- Info: #55BAC6

Text Colors (Light Mode):
- Text Primary: #2C3E3F
- Text Secondary: #556B6D
- Text Muted: #7A8E90
- Text On Dark: #FFFFFF
- Text On Primary: #FFFFFF

Neutral Colors:
- White: #FFFFFF
- Gray100-900: Various shades

Dark Mode Colors:
- Background: #0F1419
- Card Background: #1A1F26
- Surface: #252C35
- Primary: #55BAC6
- Secondary: #E8C468
- Text Primary: #E8ECEC
- Text Secondary: #A8B5B6
- Text Muted: #7A8E90
Typography
javascriptFont Families:
- Regular/System: 'System'
- Arabic (Uthmani): 'UthmanicFont' (KFGQPC_Uthmanic_Script_HAFS_Regular.otf)
- Arabic (IndoPak): 'IndoPakFont' (IndoPak.ttf)

Font Sizes:
- xs: 12, sm: 14, base: 16, lg: 18, xl: 20
- 2xl: 24, 3xl: 28, 4xl: 32, 5xl: 48, 6xl: 60

Font Weights:
- normal: 400, medium: 500, semibold: 600, bold: 700
Spacing System
javascriptxs: 4, sm: 8, md: 12, lg: 16, xl: 20
2xl: 24, 3xl: 32, 4xl: 40, 5xl: 48, 6xl: 64
Border Radius
javascriptsm: 4, md: 8, lg: 12, xl: 16, 2xl: 20, 3xl: 24, full: 999
Gradients
javascriptPrimary: ['#22575D', '#55BAC6']
Secondary: ['#B8947D', '#D4C4B0']
Success: ['#6B9B7C', '#8FBC9F']
Dark Mode Primary: ['#1A1F26', '#252C35']

🏗️ App Architecture
Navigation Structure
App.js (Main Entry)
├── SplashScreen (2 seconds)
├── OnboardingScreen (first-time users)
└── Main Stack Navigator
    ├── Dashboard (Bottom Tab: Home)
    ├── Reading (Bottom Tab: Reading)
    │   ├── ClassicMushafScreen (Coming Soon)
    │   └── WordByWordScreen (Coming Soon)
    ├── Settings (Bottom Tab: Settings)
    ├── SurahList
    ├── QuranReader
    ├── TikrarActivity
    ├── Achievements
    ├── Analytics
    ├── PrivacyPolicy
    ├── TermsOfService
    └── About
Key Screens & Features
1. OnboardingScreen

Welcome message with Hadith
User name input
Daily target selection (5, 10, 15, 20 ayahs)
Notification setup (morning & evening reminders)
Custom time picker component

2. DashboardScreen

Greeting with user name
Current streak display (book icon)
Progress ring (percentage of Quran memorized)
"Memorize the Quran" button
Today's Plan (TikrarPlan component)

New Memorization section
Revision section (7-day rolling window)


Today's Progress card
Stats Grid (4 cards):

Remaining ayahs
Daily target
Days to Hafidh
Expected completion date


Quick access to Analytics & Achievements
Dark mode support
Skeleton loader with shimmer effect

3. SurahListScreen

Search bar for filtering surahs
114 surah cards with:

Surah number badge
English name
Arabic name
Location (Makkah/Madinah)
Total ayahs count
Progress bar (memorized/total)
Completion checkmark


Dark mode support
Shimmer skeleton loader

4. QuranReaderScreen
The most feature-rich screen:
Display Options:

3 script types: Uthmani (Madina), IndoPak, Tajweed (color-coded)
Tajweed color guide modal with help button
Toggle translations on/off
Adjustable Arabic font size (Small, Medium, Large, Extra Large)
Adjustable translation font size
Dark mode support

Audio Features:

Multiple reciter selection (via Settings)
Play/Pause individual ayahs
Auto-play next ayah (toggle in Settings)
Repeat segment feature:

Select start/end ayah
Set repetition count
Progress indicator during replay
Stop button



Memorization Tools:

Mark ayah as memorized (checkbox)
Unmark memorized ayahs
Repetition counter per ayah (tap to increment, long-press to reset)
Visual indication of memorized ayahs (green background)

UI Components:

Modern loading screen with animations
Basmala display (except Surah 1 & 9)
Ayah number badges
Verse markers in Arabic text
Translation cards
Modern controls
Floating action button for segment replay
Auto-retry on network failures (3 attempts)

5. SettingsScreen
Account Settings:

Change user name
Adjust daily target

Notifications:

Enable/disable daily reminders
Morning reminder time (custom time picker)
Evening reminder time (custom time picker)

Audio Settings:

Auto-play next ayah toggle
Reciter selection modal with:

Recommended reciter (Mishary Alafasy)
Full list of reciters
Search/filter capability



Display Settings:

Dark mode toggle
Show/hide translations
Arabic script type (Uthmani, IndoPak, Tajweed)
Arabic font size
Translation font size

Data & Privacy:

Privacy Policy
Terms of Service
Export/Import data (Coming Soon)
About app

Testing & Diagnostics (Dev Mode Only):

Run diagnostics
Load test data
Reset all data

6. AnalyticsScreen
Three Tabs:
This Week:

Quick stats (Total, Daily Avg)
Daily breakdown chart (7 days)
Revision completion rate

This Month:

Quick stats (Total, Best Week)
Monthly overview card
Weekly breakdown (4 weeks)

Progress:

Surah-by-surah progress list
Percentage completion per surah
Memorized/Total ayahs

Header Summary:

Total memorized
Current streak
Percentage complete

7. AchievementsScreen
Categories:

Memorization Milestones (1, 10, 50, 100, 500, 1000, 6236 ayahs)
Surah Completion (1, 10, 57 surahs)
Specific Surahs (Al-Mulk)
Consistency Streaks (7, 30, 100 days)
Special Achievements

Features:

Locked/unlocked states
Category icons with colors
Progress indicator (X/Y unlocked)
Dark mode support

8. TikrarActivityScreen

Shows revision plan details
Progress tracking for revision categories
Complete button for revision activities
Navigation to surah list for new memorization


🔧 Core Services & Utils
Services
StorageService (src/services/StorageService.js)

Uses AsyncStorage for local data persistence
Key: 'quran_mem_tracker_v2'
Methods:

getState() - Retrieve app state
saveState(state) - Save app state
initializeState(userSettings) - Initialize new user
clearState() - Reset everything
updateRevisionProgress(categoryType, progress) - Update daily revision



State Structure:
javascript{
  ayahProgress: {
    [surahId]: {
      [ayahNumber]: {
        memorized: boolean,
        dateMemorized: 'YYYY-MM-DD',
        difficulty: 1-3
      }
    }
  },
  progress: {
    [date]: numberOfAyahs
  },
  revisionProgress: {
    [date]: {
      newMemorization: count,
      revision: count
    }
  },
  earnedAchievements: [achievementIds],
  settings: {
    dailyGoal: number,
    userName: string,
    darkMode: boolean,
    showTranslations: boolean,
    arabicFontSize: string,
    translationFontSize: string,
    autoPlayNext: boolean,
    scriptType: 'uthmani' | 'indopak' | 'tajweed',
    selectedReciter: number,
    notificationsEnabled: boolean,
    morningTime: { hour, minute },
    eveningTime: { hour, minute }
  }
}
QuranService (src/services/QuranService.js)

Base URL: https://quran.shayanshehzadqureshi.workers.dev/
Methods:

getSurahWithTranslation(surahId, reciterId, scriptType) - Get surah data
getAllSurahs() - Get all 114 surahs
getPageData(pageNumber) - Get mushaf page (for ClassicMushaf)
getReciters() - Get list of available reciters


Timeout: 45 seconds
Retry logic: Exponential backoff (max 2 retries)

AudioService (src/services/AudioService.js)

Uses Expo AV
Methods:

setupAudio() - Configure audio mode
playAyahFromUrl(audioUrl, onComplete) - Play ayah audio
stopAudio() - Stop current audio
pauseAudio() - Pause audio
resumeAudio() - Resume audio
getPlaybackStatus() - Get current status



NotificationService (src/services/NotificationService.js)

Uses Expo Notifications
Methods:

requestPermissions() - Ask for notification permissions
scheduleNotifications(morningTime, eveningTime, dailyGoal) - Schedule daily reminders
saveNotificationSettings() - Save notification preferences
getNotificationSettings() - Load notification settings


Android channel: 'default' (Quran Reminders)
5-minute buffer to prevent immediate triggers

Utils
QuranUtils (src/utils/QuranUtils.js)
Core memorization functions:

markAyahMemorized(surahId, ayahNumber, difficulty)
unmarkAyahMemorized(surahId, ayahNumber)
computeStats(state) - Calculate total memorized, remaining, etc.
computeStreak(progressData) - Calculate current streak
getRevisionPlan(state) - Generate daily revision plan (7-day rolling)
getMemorizationHistory(state) - Get ayahs by date
getTikrarProgress(state, date) - Get daily progress
checkAndAwardAchievements(state) - Check for new achievements
getSurahName(surahId) - Get surah name (1-114)

Revision System:

Simple 7-day rolling window
Day 1: No revision (start memorizing)
Day 2+: Revise previous days (max 6 days)
Always 3 total repetitions
Groups consecutive ayahs by surah

AchievementSystem (src/utils/AchievementSystem.js)

Total achievements: ~15
Types: memorization, surah_completion, specific_surah, streak, special
Methods:

checkAchievements(state) - Check for new achievements
isAchievementEarned(achievement, state) - Verify single achievement
awardAchievements(state, newAchievements) - Save earned achievements



AnalyticsUtils (src/utils/AnalyticsUtils.js)

getWeeklyAnalytics(state) - Last 7 days data
getMonthlyAnalytics(state) - Last 30 days, grouped by week
getSurahProgress(state) - Progress per surah

NetworkUtils (src/utils/NetworkUtils.js)

checkInternetConnection() - Test connectivity
retryWithExponentialBackoff(fn, maxRetries) - Retry failed requests
getErrorMessage(error) - User-friendly error messages

TajweedParser (src/utils/TajweedParser.js)

Parses HTML Tajweed markup into colored segments
Color mapping for Tajweed rules:

Ghunnah: #169777 (Green)
Idgham without Ghunnah: #095d42 (Dark Green)
Qalqalah: #DD0008 (Red)
Madd: #7B1FA2 (Purple)
Silent letters: #AAAAAA (Gray)




🎯 Key Components
ModernLoadingScreen (src/components/ModernLoadingScreen.js)

Circular loader with spinning ring
Pulsing inner circle with book icon
Animated dots
Fade-in entrance
Dark mode support
Customizable message and subtitle

TikrarPlan (src/components/TikrarPlan.js)

Displays daily revision plan
Two categories: New Memorization, Revision
Progress bars
Completion status
Help button with explanation
Dark mode support

SurahCompletionModal (src/components/SurahCompletionModal.js)

Confetti animation (react-native-confetti-cannon)
Celebration message
Surah info display
Haptic feedback
Continue button

AchievementModal (src/components/AchievementModal.js)

Shows newly earned achievements
Scrollable list
Gradient cards
Trophy icon
Continue button

SkeletonLoader (src/components/SkeletonLoader.js)

Shimmer animation (left to right)
Dark mode support
Components:

SkeletonLine - For text placeholders
SkeletonCircle - For avatar/icon placeholders
DashboardSkeleton - Full dashboard loading state
SurahListSkeleton - Surah list loading state



AnimatedButton (src/components/AnimatedButton.js)

Variants: primary, secondary, success, outline
Sizes: small, medium, large
Icon support (left/right)
Loading state
Haptic feedback
Dark mode aware

AnimatedCard (src/components/AnimatedCard.js)

Variants: default, elevated, outlined
Padding options: none, small, default, large
Touchable with press handler
Shadow styles

BottomNavigation (src/components/BottomNavigation.js)

3 tabs: Home, Reading, Settings
Active state with filled circle
Icons change color on active
Safe area insets
Accessibility support

CustomTimePicker (src/components/CustomTimePicker.js)

Hour/Minute selection
+/- buttons
12-hour format display
Modal overlay
Customizable title and subtitle


📦 Dependencies (Key Packages)
json{
  "expo": "~52.0.0",
  "react-native": "0.76.0",
  "react": "18.3.1",
  
  "Navigation": {
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.4.0",
    "react-native-screens": "~4.0.0",
    "react-native-safe-area-context": "^4.0.0"
  },
  
  "UI": {
    "expo-linear-gradient": "~14.0.1",
    "react-native-svg": "15.8.0",
    "react-native-confetti-cannon": "^1.5.2",
    "@expo/vector-icons": "^14.0.0"
  },
  
  "Storage": {
    "@react-native-async-storage/async-storage": "^2.0.0"
  },
  
  "Audio": {
    "expo-av": "~15.0.0"
  },
  
  "Notifications": {
    "expo-notifications": "~0.29.0"
  },
  
  "Fonts": {
    "expo-font": "~13.0.0"
  },
  
  "Build": {
    "expo-build-properties": "~0.13.0",
    "expo-dev-client": "~5.0.0"
  }
}

🔐 Privacy & Permissions
Data Collection
Local Storage Only:

All memorization data stored on device
No cloud sync (yet)
No analytics tracking
No personal data sent to servers

Permissions Required:

Internet: For fetching Quran content
Notifications: For daily reminders
Vibration: For haptic feedback

Permissions Blocked:

Camera
Microphone
Location (Fine & Coarse)

External APIs

Quran content API (anonymous requests)
Audio recitation URLs (from trusted Islamic sources)


🚀 Build Configuration
Android
json{
  "package": "com.shayan.quranhifdh",
  "versionCode": 3,
  "compileSdkVersion": 34,
  "targetSdkVersion": 34,
  "minSdkVersion": 23
}
iOS
json{
  "bundleIdentifier": "com.shayan.quranhifdh",
  "buildNumber": "1",
  "supportsTablet": true
}
EAS Build
bash# Development build
eas build --platform android --profile development

# Production build
eas build --platform android --profile production

# iOS build
eas build --platform ios --profile production

🐛 Known Issues & Limitations

Notification Limitations in Expo Go

Full notification support requires development build
Use eas build for production


Audio on iOS

Some older iOS versions may have audio playback delays
Using expo-av latest version resolves most issues


Font Loading

Uthmanic and IndoPak fonts load on splash
Fallback to system font if loading fails


Large Surahs

Al-Baqarah (286 ayahs) may take longer to load
Retry logic handles network timeouts


Dark Mode

All screens support dark mode
Theme persists across app restarts




📝 Testing Utils (Dev Mode)
TestingUtils (src/utils/TestingUtils.js)
Only available in __DEV__ mode:

Run Diagnostics

Tests storage operations
Tests revision calculations
Tests achievement system
Tests analytics


Load Test Data

Generates 90 days of realistic data
Multiple surahs with progress
Includes streaks and achievements


Reset All Data

Clears all storage
Restarts onboarding flow




🎨 UI/UX Patterns
Loading States

Splash Screen: 2 seconds with app logo
Skeleton Loaders: With shimmer effect
Modern Loading Screen: Circular animated loader
Activity Indicators: For quick operations

Feedback

Haptic: On button presses, counter resets
Visual: Progress bars, completion badges
Modals: Achievements, surah completion
Toasts: Success/error messages

Navigation

Bottom Tabs: Always visible on main screens
Stack Navigation: For detailed views
Back Buttons: Top-left on all screens
Gestures: Swipe back (iOS)

Accessibility

All touchables have labels
Minimum touch target: 44x44
High contrast in dark mode
Screen reader support


📱 Screen Sizes Support

Phone: All sizes (iOS & Android)
Tablet: Basic support (optimized for phone)


🌐 Localization
Currently English only

UI text: English
Quran text: Arabic
Translations: English (Sahih International)


🔮 Future Features (Planned)
🎓 Quran Tutor Marketplace

Connect students with qualified Quran teachers
Video call integration
Scheduling system
Payment processing
Teacher profiles and ratings

☁️ Cloud Sync

Backup progress to cloud
Sync across devices
Export/import data

📊 Advanced Analytics

Heatmap calendar view
Detailed revision history
Memorization speed trends
Comparison with goals

🎯 Gamification

Leaderboards (optional, privacy-focused)
More achievement types
Streak challenges
Monthly goals

🔊 Audio Features

Offline audio download
Multiple translation audio
Speed control (0.5x - 2x)
Background audio playback

📚 Learning Tools

Tafsir (commentary) integration
Word-by-word translation
Vocabulary builder
Grammar notes

🤝 Social Features

Share progress (privacy-focused)
Study groups
Memorization partners matching
Progress accountability

🎨 Customization

Custom themes
More font options
Layout preferences
Widget support

📖 Reading Modes

Classic Mushaf view (page-by-page)
Juz view
Hizb view
Night reading mode with reduced blue light

🔔 Smart Notifications

Adaptive reminder timing
Motivational quotes
Progress milestones
Streak warnings

📈 Goal Setting

Weekly/monthly goals
Custom targets
Milestone tracking
Progress predictions

🌙 Islamic Features

Prayer times integration
Qibla direction
Islamic calendar
Dua collection

💬 Community

Forum/Discussion board
Q&A with scholars
Memorization tips sharing
Success stories


📞 Support & Contact

Email: shayanshehzadqureshi@gmail.com
Privacy Policy: https://learning2codenowq.github.io/quran-hifdh-privacy/


📄 License & Credits

App Developer: Shayan Shehzad Qureshi
Quran Text: Public domain
Recitations: Various qualified reciters
Fonts: KFGQPC & IndoPak (freely licensed)


🔄 Version History

v1.0.0 (versionCode 3): Initial Play Store release

Complete memorization tracking
Revision system
Analytics & achievements
Dark mode
Multiple reciters
Tajweed support




Last Updated: January 2025
Status: Production Ready 🚀
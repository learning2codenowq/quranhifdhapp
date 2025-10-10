import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StorageService } from '../services/StorageService';
import { QuranUtils } from '../utils/QuranUtils';
import TikrarPlan from '../components/TikrarPlan';
import AchievementModal from '../components/AchievementModal';
import AnimatedProgressRing from '../components/AnimatedProgressRing';
import LoadingSpinner from '../components/LoadingSpinner';
import { Icon, AppIcons } from '../components/Icon';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../styles/theme';
import { Logger } from '../utils/Logger';
import { getThemedColors } from '../styles/theme';
import { DashboardSkeleton } from '../components/SkeletonLoader';
import ContinueCard from '../components/ContinueCard';
import ConfettiCannon from 'react-native-confetti-cannon';
import WeeklyProgress from '../components/WeeklyProgress';

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [state, setState] = useState(null);
  const [settings, setSettings] = useState({ darkMode: false });
  const [refreshing, setRefreshing] = useState(false);
  const [revisionPlan, setRevisionPlan] = useState(null);
  const [achievementModal, setAchievementModal] = useState({
    visible: false,
    achievements: []
  });
  const [totalAchievements, setTotalAchievements] = useState(0);
  const [userName, setUserName] = useState('Student');
  const [nextSegment, setNextSegment] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiShownToday, setConfettiShownToday] = useState(false);
  const confettiRef = useRef(null);

  useEffect(() => {
    loadData();
    
    const unsubscribe = navigation.addListener('focus', () => {
     // Logger.log('Dashboard focused - reloading data');
      loadData();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
  try {
    console.log('📊 Loading dashboard data...');
    let appState = await StorageService.getState();
    if (!appState) {
      appState = await StorageService.initializeState();
    }
    
    // Load dark mode setting
    if (appState?.settings) {
      setSettings({
        darkMode: appState.settings.darkMode || false
      });
    }
      
    const name = appState?.settings?.userName || 'Student';
    setUserName(name);
    
    const { updatedState, newAchievements } = await QuranUtils.checkAndAwardAchievements(appState);
    setState(updatedState);
    
    const computedStats = QuranUtils.computeStats(updatedState);
    const todaysRevision = QuranUtils.getRevisionPlan(updatedState);
    
    setStats(computedStats);
    setRevisionPlan(todaysRevision);
    
    const earnedCount = updatedState.earnedAchievements?.length || 0;
    setTotalAchievements(earnedCount);
    
    // Get next segment
    const segment = QuranUtils.getNextMemorizationSegment(updatedState);
    console.log('🎯 Next segment:', segment);
    console.log('📍 Last memorized position:', updatedState.lastMemorizedPosition);
    setNextSegment(segment);
    
    // FIXED: Check for BOTH daily goal AND revision completion
    const today = QuranUtils.localISO();
    const todayProgress = updatedState?.progress?.[today] || 0;
    const dailyGoal = updatedState?.settings?.dailyGoal || 10;
    
    // Check if revision is complete
    const todayTikrarProgress = QuranUtils.getTikrarProgress(updatedState);
    const revisionTarget = todaysRevision?.revision?.target || 0;
    const revisionCompleted = todayTikrarProgress.revision >= revisionTarget;
    
    // Check if confetti was already shown today
    const lastConfettiDate = updatedState?.lastConfettiDate;
    const confettiAlreadyShown = lastConfettiDate === today;
    
    console.log('🎊 Confetti check:', {
      todayProgress,
      dailyGoal,
      newMemCompleted: todayProgress >= dailyGoal,
      revisionTarget,
      revisionCompleted,
      confettiAlreadyShown,
      lastConfettiDate
    });
    
    // FIXED: Only show confetti if BOTH tasks complete AND not shown today yet
    const bothTasksComplete = todayProgress >= dailyGoal && revisionCompleted;
    
    if (bothTasksComplete && !confettiAlreadyShown && !showConfetti) {
      console.log('🎊 TRIGGERING CONFETTI - Both tasks complete!');
      setShowConfetti(true);
      
      // Mark confetti as shown today
      updatedState.lastConfettiDate = today;
      await StorageService.saveState(updatedState);
      
      setTimeout(() => {
        confettiRef.current?.start();
      }, 500);
      
      setTimeout(() => {
        setShowConfetti(false);
      }, 4000);
    }
    
    if (newAchievements.length > 0) {
      setAchievementModal({
        visible: true,
        achievements: newAchievements
      });
    }
  } catch (error) {
    console.error('❌ Error loading dashboard data:', error);
  }
};

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleCategoryPress = (categoryType) => {
    if (!revisionPlan) return;
    
    const categoryData = revisionPlan[categoryType];
    navigation.navigate('TikrarActivity', {
      categoryType,
      categoryData
    });
  };

  const handleCloseAchievements = () => {
    setAchievementModal({
      visible: false,
      achievements: []
    });
  };
  const handleContinueMemorization = () => {
  if (!nextSegment) {
    console.warn('No next segment available');
    return;
  }
  
  console.log('🎯 Navigating to:', nextSegment);
  
  // If new user, go to surah list
  if (nextSegment.isNewUser) {
    navigation.navigate('SurahList');
  } else {
    // Existing user, go to their last position
    navigation.navigate('QuranReader', { 
      surahId: nextSegment.surahId,
      scrollToAyah: nextSegment.startAyah
    });
  }
};

  if (!stats) {
  const themedColors = getThemedColors(settings.darkMode);
  console.log('🎨 Render check:', {
  hasNextSegment: !!nextSegment,
  isNewUser: nextSegment?.isNewUser,
  willShowCard: nextSegment && !nextSegment.isNewUser
});
  
  return (
   <LinearGradient 
     colors={settings.darkMode ? themedColors.gradients.primary : Theme.gradients.primary} 
     style={styles.container}
   >
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}></SafeAreaView>
     <DashboardSkeleton darkMode={settings.darkMode} />
   </LinearGradient>
 );
}

  const displayStats = stats ? {
    percentComplete: Number(stats.percentComplete) || 0,
    memorized: Number(stats.memorized) || 0,
    total: Number(stats.total) || 6236,
    remaining: Number(stats.remaining) || 6236,
    daily: Number(stats.daily) || 10,
    daysLeft: Number(stats.daysLeft) || 624
  } : {
    percentComplete: 0,
    memorized: 0,
    total: 6236,
    remaining: 6236,
    daily: 10,
    daysLeft: 624
  };
  const isNewUser = displayStats.memorized === 0 && !state?.progress;
  const hasAnyProgress = displayStats.memorized > 0;

  const today = QuranUtils.localISO();
  const todayProgress = state?.progress?.[today] || 0;

  const daysLeftTillHafidh = Math.ceil(displayStats.remaining / displayStats.daily);
  const hafidhhETA = new Date();
  hafidhhETA.setDate(hafidhhETA.getDate() + daysLeftTillHafidh);

  const currentStreak = QuranUtils.computeStreak(state?.progress || {});

  // src/screens/DashboardScreen.js - Replace the entire return statement (starting from line 234)

const themedColors = getThemedColors(settings.darkMode);

return (
  <LinearGradient 
    colors={settings.darkMode ? themedColors.gradients.primary : Theme.gradients.primary} 
    style={styles.container}
  >
    {showConfetti && (
  <ConfettiCannon
    ref={confettiRef}
    count={200}
    origin={{ x: -10, y: 0 }}
    autoStart={false}
    fadeOut={true}
    fallSpeed={3000}
  />
)}
    <ScrollView 
      contentContainerStyle={styles.scrollContent} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[Theme.colors.secondary]}
          tintColor={Theme.colors.secondary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.greetingRow}>
            <Text style={styles.greeting}>As-salamu alaykum,</Text>
            <Text style={styles.userName}>{userName}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Icon 
              name="flame" 
              type="Ionicons" 
              size={16} 
              color={Theme.colors.warning} 
            />
            <Text style={styles.streakNumber}>{currentStreak}</Text>
            <Text style={styles.streakLabel}>day streak</Text>
          </View>
        </View>
      </View>

      {/* Hero Action Card */}
      {nextSegment && (
        <View style={styles.heroSection}>
          <TouchableOpacity
            style={styles.heroCard}
            onPress={handleContinueMemorization}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#6B9B7C', '#8FBC9F']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            >
              <View style={styles.heroContent}>
                <Text style={styles.heroLabel}>
                  {nextSegment.isNewUser ? 'NEXT UP' : 'CONTINUE'}
                </Text>
                <Text style={styles.heroTitle}>
                  {nextSegment.isNewUser ? 'Start Memorizing' : nextSegment.surahName}
                </Text>
                {!nextSegment.isNewUser && (
                  <Text style={styles.heroSubtitle}>
                    From Ayah {nextSegment.startAyah}
                  </Text>
                )}
                <View style={styles.heroButton}>
                  <Text style={styles.heroButtonText}>Start Session</Text>
                  <Icon 
                    name="arrow-forward" 
                    type="Ionicons" 
                    size={20} 
                    color="white" 
                  />
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Browse All Surahs - Small Button */}
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => navigation.navigate('SurahList')}
          >
            <Text style={styles.browseButtonText}>Browse All Surahs</Text>
            <Icon 
              name="chevron-forward" 
              type="Ionicons" 
              size={16} 
              color={Theme.colors.secondary} 
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Today's Progress Bar */}
      <View style={styles.todayProgressSection}>
        <View style={styles.todayProgressHeader}>
          <Text style={styles.todayProgressLabel}>Today's Progress</Text>
          <Text style={styles.todayProgressNumbers}>
            {todayProgress}/{displayStats.daily}
          </Text>
        </View>
        <View style={styles.todayProgressBarContainer}>
          <View 
            style={[
              styles.todayProgressBarFill, 
              { width: `${Math.min(100, (todayProgress / displayStats.daily) * 100)}%` }
            ]} 
          />
        </View>
      </View>

      {/* Today's Plan */}
      {revisionPlan && (
        <View style={styles.todayPlanSection}>
          <Text style={styles.sectionTitle}>Today's Plan</Text>
          
          {/* New Memorization Card */}
          <TouchableOpacity
            style={[
              styles.planCard,
              styles.planCardNew,
              todayProgress >= displayStats.daily && styles.planCardCompleted
            ]}
            onPress={() => navigation.navigate('SurahList')}
          >
            <View style={styles.planCardContent}>
              <View style={styles.planCardLeft}>
                <View style={[styles.planIcon, styles.planIconNew]}>
                  <Icon 
                    name="book" 
                    type="Ionicons" 
                    size={20} 
                    color={Theme.colors.success} 
                  />
                </View>
                <View style={styles.planCardText}>
                  <Text style={styles.planCardTitle}>New Memorization</Text>
                  <Text style={styles.planCardSubtitle}>
                    Memorize {displayStats.daily} new ayahs
                  </Text>
                </View>
              </View>
              <View style={styles.planCardRight}>
                <Text style={styles.planCardProgress}>
                  {todayProgress}/{displayStats.daily}
                </Text>
                {todayProgress >= displayStats.daily && (
                  <Icon 
                    name="checkmark-circle" 
                    type="Ionicons" 
                    size={24} 
                    color={Theme.colors.success} 
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>

          {/* Revision Card */}
          <TouchableOpacity
            style={[
              styles.planCard,
              styles.planCardRevision,
              !revisionPlan.revision.target && styles.planCardInactive
            ]}
            onPress={() => handleCategoryPress('revision')}
            disabled={!revisionPlan.revision.target}
          >
            <View style={styles.planCardContent}>
              <View style={styles.planCardLeft}>
                <View style={[styles.planIcon, styles.planIconRevision]}>
                  <Icon 
                    name="refresh" 
                    type="Ionicons" 
                    size={20} 
                    color={Theme.colors.primary} 
                  />
                </View>
                <View style={styles.planCardText}>
                  <Text style={styles.planCardTitle}>Revision</Text>
                  <Text style={styles.planCardSubtitle}>
                    {revisionPlan.revision.target > 0 
                      ? revisionPlan.revision.displayText 
                      : 'Come back tomorrow'}
                  </Text>
                </View>
              </View>
              {revisionPlan.revision.target > 0 && (
                <View style={styles.planCardRight}>
                  <Text style={styles.planCardProgress}>0/3</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* This Week Section */}
<WeeklyProgress state={state} darkMode={settings.darkMode} />

      {/* Progress Overview Card with Ring */}
<View style={styles.progressOverviewSection}>
  <Text style={styles.sectionTitle}>Progress Overview</Text>
  <View style={[
    styles.progressOverviewCard,
    settings.darkMode && { backgroundColor: themedColors.cardBackground }
  ]}>
    <View style={styles.progressRingContainer}>
      <AnimatedProgressRing 
  percentage={displayStats.percentComplete || 0} 
  size={140}
  darkMode={settings.darkMode}
/>
    </View>
    
    <View style={styles.progressStatsGrid}>
      <View style={styles.progressStatItem}>
        <Text style={[
          styles.progressStatValue,
          settings.darkMode && { color: themedColors.textPrimary }
        ]}>
          {displayStats.memorized.toLocaleString()}
        </Text>
        <Text style={[
          styles.progressStatLabel,
          settings.darkMode && { color: themedColors.textSecondary }
        ]}>Memorized</Text>
      </View>
      <View style={[
        styles.progressStatDivider,
        settings.darkMode && { backgroundColor: themedColors.border }
      ]} />
      <View style={styles.progressStatItem}>
        <Text style={[
          styles.progressStatValue,
          settings.darkMode && { color: themedColors.textPrimary }
        ]}>
          {displayStats.remaining.toLocaleString()}
        </Text>
        <Text style={[
          styles.progressStatLabel,
          settings.darkMode && { color: themedColors.textSecondary }
        ]}>Remaining</Text>
      </View>
      <View style={[
        styles.progressStatDivider,
        settings.darkMode && { backgroundColor: themedColors.border }
      ]} />
      <View style={styles.progressStatItem}>
        <Text style={[
          styles.progressStatValue,
          settings.darkMode && { color: themedColors.textPrimary }
        ]}>
          {daysLeftTillHafidh}
        </Text>
        <Text style={[
          styles.progressStatLabel,
          settings.darkMode && { color: themedColors.textSecondary }
        ]}>Days Left</Text>
      </View>
    </View>

    <View style={[
      styles.milestoneSection,
      settings.darkMode && { backgroundColor: themedColors.surface }
    ]}>
      <Text style={[
        styles.milestoneLabel,
        settings.darkMode && { color: themedColors.textSecondary }
      ]}>Expected Completion</Text>
      <Text style={[
        styles.milestoneDate,
        settings.darkMode && { color: themedColors.primary }
      ]}>
        {hafidhhETA.toLocaleDateString('en-US', { 
          month: 'long', 
          day: 'numeric', 
          year: 'numeric' 
        })}
      </Text>
    </View>
  </View>
</View>

      {/* Analytics Card */}
      <TouchableOpacity 
        style={styles.actionCard}
        onPress={() => navigation.navigate('Analytics')}
      >
        <View style={styles.actionCardContent}>
          <View style={styles.actionCardLeft}>
            <View style={styles.actionCardIcon}>
              <Icon 
                name="stats-chart" 
                type="Ionicons" 
                size={24} 
                color={Theme.colors.info} 
              />
            </View>
            <View>
              <Text style={styles.actionCardTitle}>Analytics</Text>
              <Text style={styles.actionCardSubtitle}>View detailed insights</Text>
            </View>
          </View>
          <Icon 
            name="chevron-forward" 
            type="Ionicons" 
            size={20} 
            color={Theme.colors.textMuted} 
          />
        </View>
      </TouchableOpacity>

      {/* Achievements Card */}
      {totalAchievements > 0 && (
        <TouchableOpacity 
          style={styles.actionCard}
          onPress={() => navigation.navigate('Achievements')}
        >
          <View style={styles.actionCardContent}>
            <View style={styles.actionCardLeft}>
              <View style={styles.actionCardIcon}>
                <Icon 
                  name="trophy" 
                  type="Ionicons" 
                  size={24} 
                  color={Theme.colors.warning} 
                />
              </View>
              <View>
                <Text style={styles.actionCardTitle}>Achievements</Text>
                <Text style={styles.actionCardSubtitle}>
                  {totalAchievements} earned
                </Text>
              </View>
            </View>
            <Icon 
              name="chevron-forward" 
              type="Ionicons" 
              size={20} 
              color={Theme.colors.textMuted} 
            />
          </View>
        </TouchableOpacity>
      )}

      {/* Achievement Modal */}
      <AchievementModal 
        visible={achievementModal.visible}
        achievements={achievementModal.achievements}
        onClose={handleCloseAchievements}
      />
    </ScrollView>
  </LinearGradient>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  
  // Header
  header: {
    marginBottom: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greetingRow: {
    flexDirection: 'column',
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '400',
  },
  userName: {
    fontSize: 24,
    color: Theme.colors.textOnDark,
    fontWeight: Theme.typography.fontWeight.bold,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  streakNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.textOnDark,
  },
  streakLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },

  // Hero Section
  heroSection: {
    marginBottom: 24,
  },
  heroCard: {
    borderRadius: 24,
    overflow: 'hidden',
    ...Theme.shadows.xl,
    marginBottom: 12,
  },
  heroGradient: {
    padding: 32,
  },
  heroContent: {
    alignItems: 'flex-start',
  },
  heroLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 24,
    fontWeight: '500',
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 6,
  },
  browseButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Theme.colors.primary,
  },

  // Today's Progress Bar
  todayProgressSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    ...Theme.shadows.sm,
  },
  todayProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  todayProgressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.textPrimary,
  },
  todayProgressNumbers: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.success,
  },
  todayProgressBarContainer: {
    height: 8,
    backgroundColor: Theme.colors.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  todayProgressBarFill: {
    height: '100%',
    backgroundColor: Theme.colors.success,
    borderRadius: 4,
  },

  // Today's Plan
  todayPlanSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.textOnDark,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  planCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    ...Theme.shadows.sm,
  },
  planCardNew: {
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.success,
  },
  planCardRevision: {
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.primary,
  },
  planCardCompleted: {
    backgroundColor: Theme.colors.successLight,
  },
  planCardInactive: {
    opacity: 0.6,
  },
  planCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  planIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  planIconNew: {
    backgroundColor: 'rgba(107, 155, 124, 0.15)',
  },
  planIconRevision: {
    backgroundColor: 'rgba(34, 87, 93, 0.15)',
  },
  planCardText: {
    flex: 1,
  },
  planCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
    marginBottom: 4,
  },
  planCardSubtitle: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    lineHeight: 18,
  },
  planCardRight: {
    alignItems: 'flex-end',
  },
  planCardProgress: {
    fontSize: 18,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
  },
  // Progress Overview Section with Ring
progressOverviewSection: {
  marginBottom: 24,
},
progressOverviewCard: {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: 24,
  padding: 24,
  ...Theme.shadows.md,
},
progressRingContainer: {
  alignItems: 'center',
  marginBottom: 24,
},
progressStatsGrid: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-around',
  marginBottom: 24,
},
progressStatItem: {
  alignItems: 'center',
},
progressStatValue: {
  fontSize: 24,
  fontWeight: '800',
  color: Theme.colors.primary,
  marginBottom: 4,
},
progressStatLabel: {
  fontSize: 12,
  color: Theme.colors.textSecondary,
  fontWeight: '600',
},
progressStatDivider: {
  width: 1,
  height: 40,
  backgroundColor: Theme.colors.gray200,
},
milestoneSection: {
  backgroundColor: Theme.colors.successLight,
  borderRadius: 16,
  padding: 16,
  alignItems: 'center',
},
milestoneLabel: {
  fontSize: 13,
  color: Theme.colors.textSecondary,
  fontWeight: '600',
  marginBottom: 4,
},
milestoneDate: {
  fontSize: 18,
  fontWeight: '700',
  color: Theme.colors.primary,
},

  // Action Cards
  actionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    ...Theme.shadows.sm,
  },
  actionCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Theme.colors.textPrimary,
    marginBottom: 2,
  },
  actionCardSubtitle: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
  },
});
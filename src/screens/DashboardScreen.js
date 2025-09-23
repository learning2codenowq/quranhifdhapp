import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StorageService } from '../services/StorageService';
import { QuranUtils } from '../utils/QuranUtils';
import TikrarPlan from '../components/TikrarPlan';
import AchievementModal from '../components/AchievementModal';
import AnimatedProgressRing from '../components/AnimatedProgressRing';
import AnimatedCard from '../components/AnimatedCard';
import AnimatedButton from '../components/AnimatedButton';
import LoadingSpinner from '../components/LoadingSpinner';
import { Icon, AppIcons } from '../components/Icon';
import { Theme } from '../styles/theme';
import { Logger } from '../utils/Logger';

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [state, setState] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [revisionPlan, setRevisionPlan] = useState(null);
  const [achievementModal, setAchievementModal] = useState({
    visible: false,
    achievements: []
  });
  const [totalAchievements, setTotalAchievements] = useState(0);
  const [userName, setUserName] = useState('Student');

  useEffect(() => {
    loadData();
    
    const unsubscribe = navigation.addListener('focus', () => {
      Logger.log('Dashboard focused - reloading data');
      loadData();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      Logger.log('Loading dashboard data...');
      let appState = await StorageService.getState();
      if (!appState) {
        appState = await StorageService.initializeState();
      }
      
      Logger.log('App state loaded:', {
        ayahProgressKeys: Object.keys(appState?.ayahProgress || {}),
        progressKeys: Object.keys(appState?.progress || {}),
        userName: appState?.settings?.userName
      });
      
      const name = appState?.settings?.userName || 'Student';
      setUserName(name);
      
      const { updatedState, newAchievements } = await QuranUtils.checkAndAwardAchievements(appState);
      setState(updatedState);
      
      const computedStats = QuranUtils.computeStats(updatedState);
      const todaysRevision = QuranUtils.getRevisionPlan(updatedState);
      
      Logger.log('Computed stats:', computedStats);
      Logger.log('Revision plan exists:', !!todaysRevision);
      
      setStats(computedStats);
      setRevisionPlan(todaysRevision);
      
      const earnedCount = updatedState.earnedAchievements?.length || 0;
      setTotalAchievements(earnedCount);
      
      if (newAchievements.length > 0) {
        setAchievementModal({
          visible: true,
          achievements: newAchievements
        });
      }
    } catch (error) {
      Logger.error('Error loading dashboard data:', error);
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

  if (!stats) {
    return (
      <LinearGradient colors={Theme.gradients.primary} style={styles.container}>
        <LoadingSpinner message="Loading your progress..." />
      </LinearGradient>
    );
  }

  const displayStats = stats || {
    percentComplete: 0,
    memorized: 0,
    total: 6236,
    remaining: 6236,
    daily: 10,
    daysLeft: 624
  };

  const today = QuranUtils.localISO();
  const todayProgress = state?.progress?.[today] || 0;

  const daysLeftTillHafidh = Math.ceil(displayStats.remaining / displayStats.daily);
  const hafidhhETA = new Date();
  hafidhhETA.setDate(hafidhhETA.getDate() + daysLeftTillHafidh);

  const currentStreak = QuranUtils.computeStreak(state?.progress || {});

  return (
    <LinearGradient colors={Theme.gradients.primary} style={styles.container}>
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
            <Text style={styles.currentDate}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
            </Text>
          </View>
          <Text style={styles.title}>Quran Hifdh</Text>
        </View>

        {/* Current Streak */}
        <AnimatedCard style={styles.streakCard} variant="elevated">
          <View style={styles.streakContent}>
            <Icon 
              name={AppIcons.flame.name} 
              type={AppIcons.flame.type} 
              size={32} 
              color={Theme.colors.warning} 
            />
            <View style={styles.streakTextContainer}>
              <Text style={styles.streakNumber}>{currentStreak}</Text>
              <Text style={styles.streakLabel}>Day Streak</Text>
            </View>
          </View>
        </AnimatedCard>

        {/* Progress Ring */}
        <View style={styles.progressSection}>
          <AnimatedProgressRing 
            percentage={displayStats.percentComplete} 
            size={200} 
          />
          <Text style={styles.progressStats}>
            {displayStats.memorized.toLocaleString()} / {displayStats.total.toLocaleString()} ayahs
          </Text>
        </View>

        {/* Main Action Button */}
        <AnimatedButton
          title="Memorize the Quran"
          onPress={() => navigation.navigate('SurahList')}
          variant="secondary"
          size="large"
          icon={AppIcons.book}
          style={styles.memorizeButton}
        />

        {/* Revision Plan */}
        {revisionPlan && (
          <TikrarPlan 
            revisionPlan={revisionPlan}
            state={state}
            onCategoryPress={handleCategoryPress}
          />
        )}

        {/* Today's Progress */}
        <View style={styles.todaySection}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <AnimatedCard style={styles.todayCard}>
            <View style={styles.todayContent}>
              <View style={styles.todayStats}>
                <View style={styles.todayStatsHeader}>
                  <Icon 
                    name={AppIcons.checkmark.name} 
                    type={AppIcons.checkmark.type} 
                    size={24} 
                    color={Theme.colors.success} 
                  />
                  <Text style={styles.todayNumber}>{todayProgress}</Text>
                </View>
                <Text style={styles.todayLabel}>ayahs memorized</Text>
              </View>
              
              <View style={styles.todayProgressWrapper}>
                <View style={styles.todayProgressBarContainer}>
                  <View 
                    style={[
                      styles.todayProgressBarFill, 
                      { width: `${Math.min(100, (todayProgress / displayStats.daily) * 100)}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.todayGoal}>Goal: {displayStats.daily}</Text>
              </View>
            </View>
          </AnimatedCard>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <AnimatedCard style={styles.statCard}>
            <Icon 
              name={AppIcons.trending.name} 
              type={AppIcons.trending.type} 
              size={24} 
              color={Theme.colors.info} 
              style={styles.statIcon}
            />
            <Text style={styles.statValue}>{displayStats.remaining.toLocaleString()}</Text>
            <Text style={styles.statTitle}>Remaining</Text>
            <Text style={styles.statSubtitle}>Ayahs left</Text>
          </AnimatedCard>

          <AnimatedCard style={styles.statCard}>
            <Icon 
              name={AppIcons.calendar.name} 
              type={AppIcons.calendar.type} 
              size={24} 
              color={Theme.colors.secondary} 
              style={styles.statIcon}
            />
            <Text style={styles.statValue}>{displayStats.daily}</Text>
            <Text style={styles.statTitle}>Daily Target</Text>
            <Text style={styles.statSubtitle}>Ayahs/day</Text>
          </AnimatedCard>

          <AnimatedCard style={styles.statCard}>
            <Icon 
              name={AppIcons.trophy.name} 
              type={AppIcons.trophy.type} 
              size={24} 
              color={Theme.colors.warning} 
              style={styles.statIcon}
            />
            <Text style={[styles.statValue, styles.hafidhhValue]}>{daysLeftTillHafidh}</Text>
            <Text style={styles.statTitle}>Days to Hafidh</Text>
            <Text style={styles.statSubtitle}>At current pace</Text>
          </AnimatedCard>

          <AnimatedCard style={styles.statCard}>
            <Icon 
              name={AppIcons.star.name} 
              type={AppIcons.star.type} 
              size={24} 
              color={Theme.colors.success} 
              style={styles.statIcon}
            />
            <Text style={styles.statValue}>
              {hafidhhETA.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
            </Text>
            <Text style={styles.statTitle}>Expected Date</Text>
            <Text style={styles.statSubtitle}>{hafidhhETA.getFullYear()}</Text>
          </AnimatedCard>
        </View>

        {/* Analytics Card */}
        <AnimatedCard 
          style={styles.analyticsCard}
          onPress={() => navigation.navigate('Analytics')}
        >
          <View style={styles.cardContent}>
            <Icon 
              name={AppIcons.stats.name} 
              type={AppIcons.stats.type} 
              size={32} 
              color={Theme.colors.info} 
            />
            <View style={styles.cardTextContent}>
              <Text style={styles.cardTitle}>Analytics</Text>
              <Text style={styles.cardSubtitle}>View detailed progress insights</Text>
            </View>
            <Icon 
              name="chevron-forward" 
              type="Ionicons" 
              size={20} 
              color={Theme.colors.secondary} 
            />
          </View>
        </AnimatedCard>

        {/* Achievements Card */}
        {totalAchievements > 0 && (
          <AnimatedCard 
            style={styles.achievementCard}
            onPress={() => navigation.navigate('Achievements')}
          >
            <View style={styles.cardContent}>
              <Icon 
                name={AppIcons.medal.name} 
                type={AppIcons.medal.type} 
                size={32} 
                color={Theme.colors.warning} 
              />
              <View style={styles.cardTextContent}>
                <Text style={styles.cardTitle}>Achievements</Text>
                <Text style={styles.cardSubtitle}>{totalAchievements} earned</Text>
              </View>
              <Icon 
                name="chevron-forward" 
                type="Ionicons" 
                size={20} 
                color={Theme.colors.secondary} 
              />
            </View>
          </AnimatedCard>
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
    paddingTop: 60,
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: Theme.spacing['6xl'],
  },
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing['3xl'],
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  greeting: {
    fontSize: Theme.typography.fontSize.lg,
    color: 'rgba(255, 255, 255, 0.8)',
    marginRight: Theme.spacing.sm,
  },
  userName: {
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.textOnDark,
    fontWeight: Theme.typography.fontWeight.semibold,
  },
  currentDate: {
    fontSize: Theme.typography.fontSize.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.lg,
  },
  title: {
    fontSize: Theme.typography.fontSize['4xl'],
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.textOnDark,
    textAlign: 'center',
  },
  streakCard: {
    marginBottom: Theme.spacing.xl,
  },
  streakContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakTextContainer: {
    marginLeft: Theme.spacing.md,
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: Theme.typography.fontSize['3xl'],
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.primary,
  },
  streakLabel: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    fontWeight: Theme.typography.fontWeight.medium,
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: Theme.spacing['3xl'],
  },
  progressStats: {
    fontSize: Theme.typography.fontSize.base,
    color: Theme.colors.textOnDark,
    fontWeight: Theme.typography.fontWeight.medium,
    marginTop: Theme.spacing.md,
  },
  memorizeButton: {
    marginBottom: Theme.spacing['3xl'],
  },
  todaySection: {
    marginBottom: Theme.spacing['3xl'],
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.textOnDark,
    marginBottom: Theme.spacing.lg,
  },
  todayCard: {
    padding: Theme.spacing.xl,
  },
  todayContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todayStats: {
    alignItems: 'center',
  },
  todayStatsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  todayNumber: {
    fontSize: Theme.typography.fontSize['4xl'],
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.primary,
    marginLeft: Theme.spacing.sm,
  },
  todayLabel: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: Theme.typography.fontWeight.medium,
  },
  todayProgressWrapper: {
    flex: 1,
    marginLeft: Theme.spacing.xl,
  },
  todayProgressBarContainer: {
    height: 8,
    backgroundColor: Theme.colors.gray200,
    borderRadius: Theme.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: Theme.spacing.sm,
  },
  todayProgressBarFill: {
    height: '100%',
    backgroundColor: Theme.colors.success,
    borderRadius: Theme.borderRadius.sm,
  },
  todayGoal: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    textAlign: 'right',
    fontWeight: Theme.typography.fontWeight.medium,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing['3xl'],
  },
  statCard: {
    width: (Theme.layout.screenWidth - Theme.spacing.xl * 2 - Theme.spacing.md) / 2,
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  statIcon: {
    marginBottom: Theme.spacing.sm,
  },
  statValue: {
    fontSize: Theme.typography.fontSize['2xl'],
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.xs,
  },
  hafidhhValue: {
    color: Theme.colors.secondary,
  },
  statTitle: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: Theme.typography.fontWeight.semibold,
  },
  statSubtitle: {
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.textMuted,
    textAlign: 'center',
    marginTop: Theme.spacing.xs,
  },
  analyticsCard: {
    marginBottom: Theme.spacing.lg,
  },
  achievementCard: {
    marginBottom: Theme.spacing.lg,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTextContent: {
    flex: 1,
    marginLeft: Theme.spacing.lg,
  },
  cardTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.xs,
  },
  cardSubtitle: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
  },
});
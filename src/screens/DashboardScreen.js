import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StorageService } from '../services/StorageService';
import { QuranUtils } from '../utils/QuranUtils';
import TikrarPlan from '../components/TikrarPlan';
import AchievementModal from '../components/AchievementModal';
import AnimatedProgressRing from '../components/AnimatedProgressRing';
import LoadingSpinner from '../components/LoadingSpinner';
import { Icon, AppIcons } from '../components/Icon';
import { Theme } from '../styles/theme';
import { Logger } from '../utils/Logger';
import { DashboardSkeleton } from '../components/SkeletonLoader';

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
     // Logger.log('Dashboard focused - reloading data');
      loadData();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      // Logger.log('Loading dashboard data...');
      let appState = await StorageService.getState();
      if (!appState) {
        appState = await StorageService.initializeState();
      }
      
      // Logger.log('App state loaded:', {
      //  ayahProgressKeys: Object.keys(appState?.ayahProgress || {}),
      //  progressKeys: Object.keys(appState?.progress || {}),
      //  userName: appState?.settings?.userName
      // });
      
      const name = appState?.settings?.userName || 'Student';
      setUserName(name);
      
      const { updatedState, newAchievements } = await QuranUtils.checkAndAwardAchievements(appState);
      setState(updatedState);
      
      const computedStats = QuranUtils.computeStats(updatedState);
      const todaysRevision = QuranUtils.getRevisionPlan(updatedState);
      
      // Logger.log('Computed stats:', computedStats);
      // Logger.log('Revision plan exists:', !!todaysRevision);
      
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
      // Logger.error('Error loading dashboard data:', error);
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
       <DashboardSkeleton />
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

        <View style={styles.modernStreakCard}>
  <View style={styles.streakIconContainer}>
    <Icon 
      name={AppIcons.book.name} 
      type={AppIcons.book.type} 
      size={24} 
      color={Theme.colors.primary} 
    />
  </View>
  <View style={styles.streakInfo}>
    <Text style={styles.streakNumber}>{currentStreak}</Text>
    <Text style={styles.streakLabel}>Day Streak</Text>
  </View>
</View>

        {/* Progress Ring */}
        <View style={styles.progressSection}>
          <AnimatedProgressRing 
            percentage={displayStats.percentComplete || 0} 
            size={200} 
          />
          <Text style={styles.progressStats}>
  {displayStats.memorized.toLocaleString()} / {displayStats.total.toLocaleString()} ayahs
  {isNewUser && (
    <Text style={styles.newUserHint}>{'\n'}Start your journey below!</Text>
  )}
</Text>
        </View>

        {/* Main Action Button */}
<TouchableOpacity
  style={styles.memorizeButtonContainer}
  onPress={() => navigation.navigate('SurahList')}
  activeOpacity={0.9}
  accessible={true}
  accessibilityLabel="Start memorizing the Quran"
  accessibilityHint="Navigate to surah list to begin memorization"
  accessibilityRole="button"
>
  <LinearGradient
    colors={['#d4af37', '#f4d03f']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.memorizeButton}
  >
    <Icon 
      name={AppIcons.book.name} 
      type={AppIcons.book.type} 
      size={24} 
      color="white" 
      style={styles.buttonIcon}
    />
    <Text style={styles.memorizeButtonText}>Memorize the Quran</Text>
  </LinearGradient>
</TouchableOpacity>

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
          <View style={styles.todayCard}>
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
          </View>
        </View>

        {/* Stats Grid */}
<View style={styles.statsGrid}>
  {/* Remaining Ayahs */}
  <View style={[styles.statCard, styles.statCardBlue]}>
    <View style={[styles.statIconContainer, styles.statIconBlue]}>
      <Icon 
        name={AppIcons.trending.name} 
        type={AppIcons.trending.type} 
        size={24} 
        color={Theme.colors.info} 
      />
    </View>
    <Text style={[styles.statValue, styles.statValueBlue]}>
      {displayStats.remaining.toLocaleString()}
    </Text>
    <Text style={styles.statTitle}>Remaining</Text>
    <Text style={styles.statSubtitle}>Ayahs left</Text>
  </View>

  {/* Daily Target */}
  <View style={[styles.statCard, styles.statCardGold]}>
    <View style={[styles.statIconContainer, styles.statIconGold]}>
      <Icon 
        name={AppIcons.calendar.name} 
        type={AppIcons.calendar.type} 
        size={24} 
        color={Theme.colors.secondary} 
      />
    </View>
    <Text style={[styles.statValue, styles.statValueGold]}>
      {displayStats.daily}
    </Text>
    <Text style={styles.statTitle}>Daily Target</Text>
    <Text style={styles.statSubtitle}>Ayahs/day</Text>
  </View>

  {/* Days to Hafidh */}
  <View style={[styles.statCard, styles.statCardOrange]}>
    <View style={[styles.statIconContainer, styles.statIconOrange]}>
      <Icon 
        name={AppIcons.trophy.name} 
        type={AppIcons.trophy.type} 
        size={24} 
        color={Theme.colors.warning} 
      />
    </View>
    <Text style={[styles.statValue, styles.statValueOrange]}>
      {daysLeftTillHafidh}
    </Text>
    <Text style={styles.statTitle}>Days to Hafidh</Text>
    <Text style={styles.statSubtitle}>At current pace</Text>
  </View>

  {/* Expected Date */}
  <View style={[styles.statCard, styles.statCardGreen]}>
    <View style={[styles.statIconContainer, styles.statIconGreen]}>
      <Icon 
        name={AppIcons.star.name} 
        type={AppIcons.star.type} 
        size={24} 
        color={Theme.colors.success} 
      />
    </View>
    <Text style={[styles.statValue, styles.statValueGreen]}>
      {hafidhhETA.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
    </Text>
    <Text style={styles.statTitle}>Expected Date</Text>
    <Text style={styles.statSubtitle}>{hafidhhETA.getFullYear()}</Text>
  </View>
</View>

        {/* Analytics Card */}
<TouchableOpacity 
  style={styles.analyticsCard}
  onPress={() => navigation.navigate('Analytics')}
  activeOpacity={0.85}
>
  <View style={styles.cardContent}>
    <View style={styles.cardIconContainer}>
      <Icon 
        name={AppIcons.stats.name} 
        type={AppIcons.stats.type} 
        size={28} 
        color={Theme.colors.info} 
      />
    </View>
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
</TouchableOpacity>

        {/* Achievements Card */}
{totalAchievements > 0 && (
  <TouchableOpacity 
    style={styles.achievementCard}
    onPress={() => navigation.navigate('Achievements')}
    activeOpacity={0.85}
  >
    <View style={styles.cardContent}>
      <View style={styles.cardIconContainer}>
        <Icon 
          name={AppIcons.medal.name} 
          type={AppIcons.medal.type} 
          size={28} 
          color={Theme.colors.warning} 
        />
      </View>
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
  paddingBottom: 100,
  },
  header: {
  alignItems: 'center',
  marginBottom: 36,
  paddingHorizontal: 4,
  },
  headerContent: {
  alignItems: 'center',
  marginBottom: 16,
  },
  greetingRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
  },
  greeting: {
  fontSize: 16,
  color: 'rgba(255, 255, 255, 0.85)',
  marginRight: Theme.spacing.xs,
  fontWeight: '400',
  },
  userName: {
  fontSize: 16,
  color: Theme.colors.textOnDark,
  fontWeight: Theme.typography.fontWeight.bold,
  },
  currentDate: {
  fontSize: 13,
  color: 'rgba(255, 255, 255, 0.75)',
  textAlign: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.15)',
  paddingHorizontal: 16,
  paddingVertical: 6,
  borderRadius: Theme.borderRadius.full,
  overflow: 'hidden',
  marginTop: 4,
  },
  title: {
  fontSize: 36,
  fontWeight: Theme.typography.fontWeight.bold,
  color: Theme.colors.textOnDark,
  textAlign: 'center',
  letterSpacing: 0.5,
  marginTop: 12,
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
  marginBottom: 36,
  marginTop: 8,
  },
  cardIconContainer: {
  borderRadius: 12,
  padding: 10,
  marginRight: 16,
  },
  progressStats: {
  fontSize: 17,
  color: Theme.colors.textOnDark,
  fontWeight: Theme.typography.fontWeight.semibold,
  marginTop: 16,
  letterSpacing: 0.3,
  },
  memorizeButtonContainer: {
  marginBottom: 36,
  marginTop: 4,
  shadowColor: '#d4af37',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 8,
  elevation: 8,
  },
  buttonIcon: {
  marginRight: 12,
  },
  memorizeButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 30,
  paddingVertical: 20,
  paddingHorizontal: 32,
  },
  memorizeButtonText: {
  color: 'white',
  fontSize: 18,
  fontWeight: 'bold',
  letterSpacing: 0.5,
  },
  todaySection: {
  marginBottom: 36,
  },
  sectionTitle: {
  fontSize: 22,
  fontWeight: Theme.typography.fontWeight.bold,
  color: Theme.colors.textOnDark,
  marginBottom: 16,
  letterSpacing: 0.3,
  },
  todayCard: {
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  borderRadius: 20,
  padding: 24,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 6,
  borderLeftWidth: 4,
  borderLeftColor: Theme.colors.success,
  },
  todayContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 20,
  },
  todayStats: {
  alignItems: 'center',
  minWidth: 100,
  },
  todayStatsHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 4,
  },
  todayNumber: {
  fontSize: 40,
  fontWeight: Theme.typography.fontWeight.bold,
  color: Theme.colors.primary,
  marginLeft: Theme.spacing.sm,
  letterSpacing: -0.5,
  },
  todayLabel: {
  fontSize: 13,
  color: Theme.colors.textSecondary,
  textAlign: 'center',
  fontWeight: Theme.typography.fontWeight.medium,
  marginTop: 2,
  },
  todayProgressWrapper: {
  flex: 1,
  },
  todayProgressBarContainer: {
  height: 8,
  backgroundColor: Theme.colors.gray200,
  borderRadius: Theme.borderRadius.sm,
  overflow: 'hidden',
  marginBottom: 8,
  },
  todayProgressBarFill: {
    height: '100%',
    backgroundColor: Theme.colors.success,
    borderRadius: Theme.borderRadius.sm,
  },
  todayGoal: {
  fontSize: 13,
  color: Theme.colors.textSecondary,
  textAlign: 'right',
  fontWeight: Theme.typography.fontWeight.semibold,
  },
  statsGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginBottom: 36,
  gap: 12,
  },
  statCard: {
  width: (Theme.layout.screenWidth - 20 * 2 - 12) / 2,
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  borderRadius: 20,
  padding: 20,
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 6,
  },
  statCardBlue: {
  borderTopWidth: 3,
  borderTopColor: '#3498db',
  },
  statCardGold: {
  borderTopWidth: 3,
  borderTopColor: '#d4af37',
  },
  statCardOrange: {
  borderTopWidth: 3,
  borderTopColor: '#ffc107',
  },
  statCardGreen: {
  borderTopWidth: 3,
  borderTopColor: '#009c4a',
  },
  statIconContainer: {
  borderRadius: 16,
  padding: 14,
  marginBottom: 12,
  },
  statIconBlue: {
  backgroundColor: 'rgba(52, 152, 219, 0.1)',
  },
  statIconGold: {
  backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  statIconOrange: {
  backgroundColor: 'rgba(255, 193, 7, 0.1)',
  },
  statIconGreen: {
  backgroundColor: 'rgba(0, 156, 74, 0.1)',
  },
  statValue: {
  fontSize: 32,
  fontWeight: '800',
  marginBottom: Theme.spacing.xs,
  letterSpacing: -0.5,
  },
  statValueBlue: {
  color: '#3498db',
  },
  statValueGold: {
  color: '#d4af37',
  },
  statValueOrange: {
  color: '#ffc107',
  },
  statValueGreen: {
  color: '#009c4a',
  },
  statTitle: {
  fontSize: 13,
  color: Theme.colors.textSecondary,
  textAlign: 'center',
  fontWeight: Theme.typography.fontWeight.bold,
  marginBottom: 4,
  letterSpacing: 0.3,
  },
  statSubtitle: {
  fontSize: 11,
  color: Theme.colors.textMuted,
  textAlign: 'center',
  fontWeight: '500',
  },
  statValue: {
    fontSize: Theme.typography.fontSize['2xl'],
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.xs,
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
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  borderRadius: 20,
  padding: 22,
  marginBottom: 16,
  shadowColor: '#3498db',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 6,
  borderLeftWidth: 4,
  borderLeftColor: Theme.colors.info,
  },
  achievementCard: {
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  borderRadius: 20,
  padding: 22,
  marginBottom: 16,
  shadowColor: '#ffc107',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.2,
  shadowRadius: 8,
  elevation: 6,
  borderLeftWidth: 4,
  borderLeftColor: Theme.colors.warning,
  },
  cardContent: {
  flexDirection: 'row',
  alignItems: 'center',
  },
  cardTextContent: {
  flex: 1,
  marginRight: 8,
  },
  cardTitle: {
  fontSize: 18,
  fontWeight: Theme.typography.fontWeight.bold,
  color: Theme.colors.primary,
  marginBottom: 4,
  letterSpacing: 0.2,
  },
  cardSubtitle: {
  fontSize: 14,
  color: Theme.colors.textSecondary,
  fontWeight: '500',
  },
  modernStreakCard: {
  backgroundColor: 'rgba(255, 255, 255, 0.98)',
  borderRadius: 20,
  paddingVertical: 18,
  paddingHorizontal: 24,
  marginBottom: 32,
  alignSelf: 'center',
  minWidth: 180,
  maxWidth: 240,
  flexDirection: 'row',
  alignItems: 'center',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 6,
  borderLeftWidth: 4,
  borderLeftColor: Theme.colors.primary,
  },
  streakIconContainer: {
  backgroundColor: 'rgba(5, 40, 21, 0.1)',
  borderRadius: 12,
  padding: 12,
  marginRight: 16,
  },
  streakInfo: {
  flex: 1,
  alignItems: 'flex-start',
  },
  streakNumber: {
  fontSize: 32,
  fontWeight: 'bold',
  color: Theme.colors.primary,
  lineHeight: 36,
  letterSpacing: -0.5,
  },
  streakLabel: {
  fontSize: 12,
  color: Theme.colors.textSecondary,
  fontWeight: '600',
  marginTop: 2,
  letterSpacing: 0.3,
  },
  newUserHint: {
  fontSize: 14,
  color: 'rgba(255, 255, 255, 0.8)',
  fontWeight: 'normal',
  fontStyle: 'italic',
  },
});
import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { StorageService } from '../services/StorageService';
import { AnalyticsUtils } from '../utils/AnalyticsUtils';
import { QuranUtils } from '../utils/QuranUtils';
import AnimatedCard from '../components/AnimatedCard';
import { Icon, AppIcons } from '../components/Icon';
import { Theme } from '../styles/theme';
import { useSettings } from '../hooks/useSettings';
import { useAppState } from '../contexts';
import ScreenLayout from '../layouts/ScreenLayout';
import ScreenHeader from '../layouts/ScreenHeader';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen({ navigation }) {
  const { settings, themedColors } = useSettings();
  const { state } = useAppState();
  const [activeTab, setActiveTab] = useState('week');

  // ALL USEMEMO - Cache analytics calculations
  const weeklyData = useMemo(() => {
    return state ? AnalyticsUtils.getWeeklyAnalytics(state) : null;
  }, [state]);

  const monthlyData = useMemo(() => {
    return state ? AnalyticsUtils.getMonthlyAnalytics(state) : null;
  }, [state]);

  const surahProgress = useMemo(() => {
    return state ? AnalyticsUtils.getSurahProgress(state) : [];
  }, [state]);

  // Memoize tab handler
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Memoize HeaderStatsCard
  const HeaderStatsCard = useCallback(() => {
    const stats = QuranUtils.computeStats(state);
    const currentStreak = QuranUtils.computeStreak(state?.progress || {});

    return (
      <AnimatedCard style={[styles.headerCard, settings.darkMode && { backgroundColor: themedColors.cardBackground }]}>
        <View style={styles.headerCardContent}>
          <View style={styles.headerStat}>
            <View style={styles.iconCircle}>
              <Icon name="checkmark-circle" type="Ionicons" size={24} color={Theme.colors.success} />
            </View>
            <Text style={[styles.headerStatValue, settings.darkMode && { color: themedColors.textPrimary }]}>{stats.memorized}</Text>
            <Text style={[styles.headerStatLabel, settings.darkMode && { color: themedColors.textSecondary }]}>Memorized</Text>
          </View>

          <View style={styles.headerDivider} />

          <View style={styles.headerStat}>
            <View style={styles.iconCircle}>
              <Icon name="book" type="Ionicons" size={24} color={Theme.colors.warning} />
            </View>
            <Text style={[styles.headerStatValue, settings.darkMode && { color: themedColors.textPrimary }]}>{currentStreak}</Text>
            <Text style={[styles.headerStatLabel, settings.darkMode && { color: themedColors.textSecondary }]}>Day Streak</Text>
          </View>

          <View style={styles.headerDivider} />

          <View style={styles.headerStat}>
            <View style={styles.iconCircle}>
              <Icon name="trending-up" type="Ionicons" size={24} color={Theme.colors.secondary} />
            </View>
            <Text style={[styles.headerStatValue, settings.darkMode && { color: themedColors.textPrimary }]}>{Math.round(stats.percentComplete)}%</Text>
            <Text style={[styles.headerStatLabel, settings.darkMode && { color: themedColors.textSecondary }]}>Complete</Text>
          </View>
        </View>
      </AnimatedCard>
    );
  }, [state, settings.darkMode, themedColors]);

  // NOW CONDITIONAL RETURN
  if (!weeklyData || !monthlyData) {
    return (
      <ScreenLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.secondary} />
          <Text style={styles.loadingText}>Loading Analytics...</Text>
        </View>
      </ScreenLayout>
    );
  }

  // Weekly Progress Bar Component
  const WeeklyProgressBar = ({ day, maxValue }) => {
    const height = maxValue > 0 ? Math.max((day.memorized / maxValue) * 80, 4) : 4;
    const barColor = day.memorized > 0 ? Theme.colors.success : Theme.colors.gray300;

    return (
      <View style={styles.weeklyBarContainer}>
        <View style={styles.weeklyBarWrapper}>
          <View style={[styles.weeklyBar, { height, backgroundColor: barColor }]} />
        </View>
        <Text style={[styles.weeklyBarLabel, settings.darkMode && { color: themedColors.textSecondary }]}>{day.dayName}</Text>
        <Text style={[styles.weeklyBarValue, settings.darkMode && { color: themedColors.textPrimary }]}>{day.memorized}</Text>
      </View>
    );
  };

  // Stat Pill Component (small rounded stat)
  const StatPill = ({ icon, value, label, color = Theme.colors.primary }) => (
    <View style={[styles.statPill, settings.darkMode && { backgroundColor: themedColors.surface }]}>
      <Icon name={icon} type="Ionicons" size={20} color={color} />
      <View style={styles.statPillText}>
        <Text style={[styles.statPillValue, { color }, settings.darkMode && { color }]}>{value}</Text>
        <Text style={[styles.statPillLabel, settings.darkMode && { color: themedColors.textSecondary }]}>{label}</Text>
      </View>
    </View>
  );

  // Surah Progress Item
  const SurahProgressItem = ({ surah }) => (
    <View style={[styles.surahItem, settings.darkMode && { backgroundColor: themedColors.surface }]}>
      <View style={styles.surahInfo}>
        <Text style={[styles.surahName, settings.darkMode && { color: themedColors.textPrimary }]}>{surah.name}</Text>
        <Text style={[styles.surahStats, settings.darkMode && { color: themedColors.textSecondary }]}>
          {surah.memorized} / {surah.totalAyahs} ayahs
        </Text>
      </View>
      <View style={styles.surahProgressContainer}>
        <View style={styles.surahProgressBar}>
          <View 
            style={[
              styles.surahProgressFill, 
              { width: `${surah.percentage}%`, backgroundColor: Theme.colors.success }
            ]} 
          />
        </View>
        <Text style={[styles.surahPercent, settings.darkMode && { color: themedColors.textPrimary }]}>
          {Math.round(surah.percentage)}%
        </Text>
      </View>
    </View>
  );

  return (
  <ScreenLayout>
    <ScreenHeader 
      title="Analytics"
      onBack={() => navigation.goBack()}
    />

          {/* Header Summary Card */}
          <View style={styles.headerCardWrapper}>
            <HeaderStatsCard />
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'week' && styles.activeTab]}
              onPress={() => setActiveTab('week')}
            >
              <Text style={[styles.tabText, activeTab === 'week' && styles.activeTabText]}>
                This Week
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'month' && styles.activeTab]}
              onPress={() => setActiveTab('month')}
            >
              <Text style={[styles.tabText, activeTab === 'month' && styles.activeTabText]}>
                This Month
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'progress' && styles.activeTab]}
              onPress={() => setActiveTab('progress')}
            >
              <Text style={[styles.tabText, activeTab === 'progress' && styles.activeTabText]}>
                Progress
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.content} 
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            
            {/* This Week Tab */}
            {activeTab === 'week' && (
              <>
                {/* Quick Stats */}
                <View style={styles.statsRow}>
                  <StatPill 
                    icon="calendar-outline" 
                    value={weeklyData.totalWeekAyahs}
                    label="Total"
                    color={Theme.colors.secondary}
                  />
                  <StatPill 
                    icon="stats-chart" 
                    value={weeklyData.averageDaily.toFixed(1)}
                    label="Daily Avg"
                    color={Theme.colors.success}
                  />
                </View>

                {/* Weekly Chart */}
                <AnimatedCard style={[styles.chartCard, settings.darkMode && { backgroundColor: themedColors.cardBackground }]}>
                  <Text style={[styles.cardTitle, settings.darkMode && { color: themedColors.textPrimary }]}>Daily Breakdown</Text>
                  <View style={styles.weeklyChart}>
                    {weeklyData.dailyData.map((day, index) => (
                      <WeeklyProgressBar 
                        key={index}
                        day={day}
                        maxValue={Math.max(...weeklyData.dailyData.map(d => d.memorized))}
                      />
                    ))}
                  </View>
                  <Text style={[styles.chartNote, settings.darkMode && { color: themedColors.textMuted }]}>
                    {weeklyData.revisionCompletionRate} days with revision completed
                  </Text>
                </AnimatedCard>
              </>
            )}

            {/* This Month Tab */}
            {activeTab === 'month' && (
              <>
                {/* Quick Stats */}
                <View style={styles.statsRow}>
                  <StatPill 
                    icon="trophy" 
                    value={monthlyData.totalMonthAyahs}
                    label="Total"
                    color={Theme.colors.secondary}
                  />
                  <StatPill 
                    icon="star" 
                    value={monthlyData.bestWeek}
                    label="Best Week"
                    color={Theme.colors.warning}
                  />
                </View>

                {/* Monthly Stats Card */}
                <AnimatedCard style={[styles.monthlyCard, settings.darkMode && { backgroundColor: themedColors.cardBackground }]}>
                  <Text style={[styles.cardTitle, settings.darkMode && { color: themedColors.textPrimary }]}>Monthly Overview</Text>
                  
                  <View style={styles.monthlyStatRow}>
                    <View style={styles.monthlyStatItem}>
                      <Icon name="calendar" type="Ionicons" size={20} color={Theme.colors.info} />
                      <Text style={[styles.monthlyStatLabel, settings.darkMode && { color: themedColors.textSecondary }]}>Consistent Days</Text>
                      <Text style={[styles.monthlyStatValue, settings.darkMode && { color: themedColors.textPrimary }]}>{monthlyData.consistentDays} / 30</Text>
                    </View>

                    <View style={styles.monthlyDivider} />

                    <View style={styles.monthlyStatItem}>
                      <Icon name="trending-up" type="Ionicons" size={20} color={Theme.colors.success} />
                      <Text style={[styles.monthlyStatLabel, settings.darkMode && { color: themedColors.textSecondary }]}>Weekly Average</Text>
                      <Text style={[styles.monthlyStatValue, settings.darkMode && { color: themedColors.textPrimary }]}>
                        {(monthlyData.totalMonthAyahs / 4).toFixed(0)}
                      </Text>
                    </View>
                  </View>
                </AnimatedCard>

                {/* Weekly Breakdown */}
                <AnimatedCard style={[styles.chartCard, settings.darkMode && { backgroundColor: themedColors.cardBackground }]}>
                  <Text style={[styles.cardTitle, settings.darkMode && { color: themedColors.textPrimary }]}>Weekly Breakdown</Text>
                  <View style={styles.weeklyBreakdown}>
                    {monthlyData.weeklyData.map((week, index) => (
                      <View key={index} style={styles.weekBreakdownItem}>
                        <Text style={[styles.weekBreakdownLabel, settings.darkMode && { color: themedColors.textSecondary }]}>
                          Week {week.week}
                        </Text>
                        <View style={styles.weekBreakdownBar}>
                          <View 
                            style={[
                              styles.weekBreakdownFill,
                              { 
                                width: `${(week.total / monthlyData.bestWeek) * 100}%`,
                                backgroundColor: Theme.colors.secondary
                              }
                            ]}
                          />
                        </View>
                        <Text style={[styles.weekBreakdownValue, settings.darkMode && { color: themedColors.textPrimary }]}>
                          {week.total}
                        </Text>
                      </View>
                    ))}
                  </View>
                </AnimatedCard>
              </>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <>

                {/* Surah Progress List */}
                {surahProgress.length > 0 && (
                  <AnimatedCard style={[styles.surahCard, settings.darkMode && { backgroundColor: themedColors.cardBackground }]}>
                    <Text style={[styles.cardTitle, settings.darkMode && { color: themedColors.textPrimary }]}>Surah Progress</Text>
                    {surahProgress.map((surah, index) => (
                      <SurahProgressItem key={index} surah={surah} />
                    ))}
                  </AnimatedCard>
                )}

                {surahProgress.length === 0 && (
                  <AnimatedCard style={[styles.emptyCard, settings.darkMode && { backgroundColor: themedColors.cardBackground }]}>
                    <Icon name="book-outline" type="Ionicons" size={48} color={Theme.colors.textMuted} />
                    <Text style={[styles.emptyText, settings.darkMode && { color: themedColors.textSecondary }]}>
                      Start memorizing to see your surah progress
                    </Text>
                  </AnimatedCard>
                )}
              </>
            )}

          </ScrollView>
        </ScreenLayout>
);
}

const styles = StyleSheet.create({
  headerCardWrapper: {
    paddingHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.lg,
  },
  headerCard: {
    padding: Theme.spacing.xl,
  },
  headerCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  headerStat: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  headerStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: 4,
  },
  headerStatLabel: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  headerDivider: {
    width: 1,
    height: 50,
    backgroundColor: Theme.colors.gray200,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: Theme.borderRadius.full,
    marginHorizontal: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.xl,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: Theme.colors.white,
  },
  tabText: {
    color: Theme.colors.textOnDark,
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: Theme.typography.fontWeight.medium,
  },
  activeTabText: {
    color: Theme.colors.primary,
    fontWeight: Theme.typography.fontWeight.bold,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: Theme.spacing['6xl'],
  },
  statsRow: {
    flexDirection: 'row',
    gap: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  statPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.white,
    borderRadius: Theme.borderRadius.xl,
    padding: Theme.spacing.lg,
    gap: Theme.spacing.md,
    ...Theme.shadows.sm,
  },
  statPillText: {
    flex: 1,
  },
  statPillValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statPillLabel: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
  chartCard: {
    padding: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.lg,
  },
  weeklyChart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: Theme.spacing.md,
  },
  weeklyBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  weeklyBarWrapper: {
    height: 80,
    justifyContent: 'flex-end',
    marginBottom: Theme.spacing.sm,
  },
  weeklyBar: {
    width: 28,
    borderRadius: Theme.borderRadius.md,
  },
  weeklyBarLabel: {
    fontSize: 11,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  weeklyBarValue: {
    fontSize: 13,
    color: Theme.colors.primary,
    fontWeight: 'bold',
  },
  chartNote: {
    fontSize: 12,
    color: Theme.colors.textMuted,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  monthlyCard: {
    padding: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
  },
  monthlyStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthlyStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  monthlyStatLabel: {
    fontSize: 12,
    color: Theme.colors.textSecondary,
    marginTop: Theme.spacing.sm,
    marginBottom: Theme.spacing.xs,
    textAlign: 'center',
  },
  monthlyStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.primary,
  },
  monthlyDivider: {
    width: 1,
    height: 60,
    backgroundColor: Theme.colors.gray200,
    marginHorizontal: Theme.spacing.md,
  },
  weeklyBreakdown: {
    gap: Theme.spacing.md,
  },
  weekBreakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  weekBreakdownLabel: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    width: 60,
    fontWeight: '500',
  },
  weekBreakdownBar: {
    flex: 1,
    height: 8,
    backgroundColor: Theme.colors.gray200,
    borderRadius: Theme.borderRadius.sm,
    overflow: 'hidden',
  },
  weekBreakdownFill: {
    height: '100%',
    borderRadius: Theme.borderRadius.sm,
  },
  weekBreakdownValue: {
    fontSize: 14,
    color: Theme.colors.primary,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'right',
  },
  journeyCard: {
    padding: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
  },
  journeyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  journeyStatItem: {
    alignItems: 'center',
  },
  journeyStatValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginTop: Theme.spacing.sm,
    marginBottom: Theme.spacing.xs,
  },
  journeyStatLabel: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  surahCard: {
    padding: Theme.spacing.xl,
  },
  surahItem: {
    backgroundColor: Theme.colors.gray100,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.md,
  },
  surahInfo: {
    marginBottom: Theme.spacing.sm,
  },
  surahName: {
    fontSize: 16,
    fontWeight: Theme.typography.fontWeight.semibold,
    color: Theme.colors.primary,
    marginBottom: 4,
  },
  surahStats: {
    fontSize: 13,
    color: Theme.colors.textSecondary,
  },
  surahProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.spacing.md,
  },
  surahProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Theme.colors.gray200,
    borderRadius: Theme.borderRadius.sm,
    overflow: 'hidden',
  },
  surahProgressFill: {
    height: '100%',
    borderRadius: Theme.borderRadius.sm,
  },
  surahPercent: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    minWidth: 40,
    textAlign: 'right',
  },
  emptyCard: {
    padding: Theme.spacing['4xl'],
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: Theme.spacing.lg,
    lineHeight: 20,
  },
});
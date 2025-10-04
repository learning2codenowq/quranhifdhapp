import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StorageService } from '../services/StorageService';
import { AnalyticsUtils } from '../utils/AnalyticsUtils';
import { QuranUtils } from '../utils/QuranUtils';
import AnimatedCard from '../components/AnimatedCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Icon, AppIcons } from '../components/Icon';
import { Theme } from '../styles/theme';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen({ navigation }) {
  const [state, setState] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [surahProgress, setSurahProgress] = useState([]);
  const [projections, setProjections] = useState(null);
  const [activeTab, setActiveTab] = useState('week');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const appState = await StorageService.getState();
    if (appState) {
      setState(appState);
      setWeeklyData(AnalyticsUtils.getWeeklyAnalytics(appState));
      setMonthlyData(AnalyticsUtils.getMonthlyAnalytics(appState));
      setSurahProgress(AnalyticsUtils.getSurahProgress(appState));
      setProjections(AnalyticsUtils.getProjections(appState));
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color = Theme.colors.primary }) => (
    <AnimatedCard style={styles.statCard}>
      <View style={styles.statContent}>
        <Icon 
          name={icon.name} 
          type={icon.type} 
          size={28} 
          color={color} 
          style={styles.statIcon}
        />
        <View style={styles.statTextContent}>
          <Text style={[styles.statValue, { color }]}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
          <Text style={styles.statSubtitle}>{subtitle}</Text>
        </View>
      </View>
    </AnimatedCard>
  );

  const DailyBar = ({ day, maxValue }) => {
    const height = maxValue > 0 ? Math.max((day.memorized / maxValue) * 60, 2) : 2;
    const tikrarColor = day.tikrarCompleted >= 0.75 ? Theme.colors.success : Theme.colors.warning;
    
    return (
      <View style={styles.dayBarContainer}>
        <View style={[styles.dayBar, { height, backgroundColor: tikrarColor }]} />
        <Text style={styles.dayLabel}>{day.dayName}</Text>
        <Text style={styles.dayValue}>{day.memorized}</Text>
      </View>
    );
  };

  if (!weeklyData || !monthlyData) {
  return (
    <LinearGradient colors={Theme.gradients.primary} style={styles.container}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.secondary} />
        <Text style={styles.loadingText}>Analyzing your progress...</Text>
      </View>
    </LinearGradient>
  );
}

  return (
    <LinearGradient colors={Theme.gradients.primary} style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}></SafeAreaView>
      <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon 
              name={AppIcons.back.name} 
              type={AppIcons.back.type} 
              size={24} 
              color={Theme.colors.textOnDark} 
            />
            <Text style={styles.backText}>Dashboard</Text>
          </TouchableOpacity>
          
          <View style={styles.headerTitleContainer}>
            <Icon 
              name={AppIcons.stats.name} 
              type={AppIcons.stats.type} 
              size={32} 
              color={Theme.colors.secondary} 
            />
            <Text style={styles.headerTitle}>Analytics</Text>
          </View>
        </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'week' && styles.activeTab]}
            onPress={() => setActiveTab('week')}
          >
            <Icon 
              name={AppIcons.calendar.name} 
              type={AppIcons.calendar.type} 
              size={18} 
              color={activeTab === 'week' ? Theme.colors.primary : Theme.colors.textOnDark} 
            />
            <Text style={[styles.tabText, activeTab === 'week' && styles.activeTabText]}>
              This Week
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'month' && styles.activeTab]}
            onPress={() => setActiveTab('month')}
          >
            <Icon 
              name="calendar-outline" 
              type="Ionicons" 
              size={18} 
              color={activeTab === 'month' ? Theme.colors.primary : Theme.colors.textOnDark} 
            />
            <Text style={[styles.tabText, activeTab === 'month' && styles.activeTabText]}>
              This Month
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'projections' && styles.activeTab]}
            onPress={() => setActiveTab('projections')}
          >
            <Icon 
              name={AppIcons.trending.name} 
              type={AppIcons.trending.type} 
              size={18} 
              color={activeTab === 'projections' ? Theme.colors.primary : Theme.colors.textOnDark} 
            />
            <Text style={[styles.tabText, activeTab === 'projections' && styles.activeTabText]}>
              Projections
            </Text>
          </TouchableOpacity>
        </View>

        {/* Weekly Analytics */}
        {activeTab === 'week' && (
          <>
            <View style={styles.statsContainer}>
              <StatCard 
                title="Week Total"
                value={weeklyData.totalWeekAyahs}
                subtitle="ayahs memorized"
                icon={AppIcons.checkmark}
                color={Theme.colors.secondary}
              />
              <StatCard 
                title="Daily Average"
                value={weeklyData.averageDaily.toFixed(1)}
                subtitle="ayahs per day"
                icon={AppIcons.trending}
                color={Theme.colors.success}
              />
              <StatCard 
                title="Current Streak"
                value={weeklyData.streak}
                subtitle="consecutive days"
                icon={AppIcons.flame}
                color={Theme.colors.warning}
              />
              <StatCard 
                title="Revision Rate"
                value={`${weeklyData.revisionCompletionRate}/7`}
                subtitle="days completed"
                icon={AppIcons.star}
                color={Theme.colors.primary}
              />
            </View>

            <AnimatedCard style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Icon 
                  name="bar-chart" 
                  type="Ionicons" 
                  size={24} 
                  color={Theme.colors.primary} 
                />
                <Text style={styles.chartTitle}>Daily Progress</Text>
              </View>
              
              <View style={styles.barsContainer}>
                {weeklyData.dailyData.map((day, index) => (
                  <DailyBar 
                    key={index} 
                    day={day} 
                    maxValue={Math.max(...weeklyData.dailyData.map(d => d.memorized))}
                  />
                ))}
              </View>
            </AnimatedCard>
          </>
        )}

        {/* Monthly Analytics */}
        {activeTab === 'month' && (
          <>
            <View style={styles.statsContainer}>
              <StatCard 
                title="Month Total"
                value={monthlyData.totalMonthAyahs}
                subtitle="ayahs memorized"
                icon={AppIcons.trophy}
                color={Theme.colors.secondary}
              />
              <StatCard 
                title="Best Week"
                value={monthlyData.bestWeek}
                subtitle="ayahs in one week"
                icon={AppIcons.star}
                color={Theme.colors.success}
              />
              <StatCard 
                title="Consistent Days"
                value={monthlyData.consistentDays}
                subtitle="out of 30 days"
                icon={AppIcons.flame}
                color={Theme.colors.warning}
              />
              <StatCard 
                title="Weekly Average"
                value={(monthlyData.totalMonthAyahs / 4).toFixed(0)}
                subtitle="ayahs per week"
                icon={AppIcons.trending}
                color={Theme.colors.primary}
              />
            </View>

            <AnimatedCard style={styles.chartCard}>
              <View style={styles.chartHeader}>
                <Icon 
                  name="stats-chart" 
                  type="Ionicons" 
                  size={24} 
                  color={Theme.colors.primary} 
                />
                <Text style={styles.chartTitle}>Weekly Breakdown</Text>
              </View>
              
              <View style={styles.weeklyBars}>
                {monthlyData.weeklyData.map((week, index) => (
                  <View key={index} style={styles.weekBarContainer}>
                    <View 
                      style={[
                        styles.weekBar, 
                        { 
                          height: Math.max((week.total / monthlyData.bestWeek) * 80, 5),
                          backgroundColor: Theme.colors.secondary
                        }
                      ]} 
                    />
                    <Text style={styles.weekLabel}>Week {week.week}</Text>
                    <Text style={styles.weekValue}>{week.total}</Text>
                  </View>
                ))}
              </View>
            </AnimatedCard>
          </>
        )}

        {/* Projections */}
        {activeTab === 'projections' && projections && (
          <>
            <AnimatedCard style={styles.projectionCard}>
              <View style={styles.projectionHeader}>
                <Icon 
                  name="rocket" 
                  type="Ionicons" 
                  size={28} 
                  color={Theme.colors.secondary} 
                />
                <Text style={styles.projectionTitle}>Completion Projections</Text>
              </View>
              
              <View style={styles.projectionItem}>
  <View style={styles.projectionLabelContainer}>
    <Icon 
      name="flash" 
      type="Ionicons" 
      size={16} 
      color={Theme.colors.success} 
    />
    <Text style={styles.projectionLabel}>Optimistic</Text>
  </View>
  <Text style={styles.projectionDate}>
    {projections.optimistic.date.toLocaleDateString()}
  </Text>
  <Text style={styles.projectionDays}>
    {projections.optimistic.days} days
  </Text>
</View>

<View style={styles.projectionItem}>
  <View style={styles.projectionLabelContainer}>
    <Icon 
      name="checkmark-circle" 
      type="Ionicons" 
      size={16} 
      color={Theme.colors.info} 
    />
    <Text style={styles.projectionLabel}>Realistic</Text>
  </View>
  <Text style={styles.projectionDate}>
    {projections.realistic.date.toLocaleDateString()}
  </Text>
  <Text style={styles.projectionDays}>
    {projections.realistic.days} days
  </Text>
</View>

<View style={styles.projectionItem}>
  <View style={styles.projectionLabelContainer}>
    <Icon 
      name="time" 
      type="Ionicons" 
      size={16} 
      color={Theme.colors.warning} 
    />
    <Text style={styles.projectionLabel}>Conservative</Text>
  </View>
  <Text style={styles.projectionDate}>
    {projections.conservative.date.toLocaleDateString()}
  </Text>
  <Text style={styles.projectionDays}>
    {projections.conservative.days} days
  </Text>
</View>
            </AnimatedCard>

            {surahProgress.length > 0 && (
              <AnimatedCard style={styles.surahCard}>
                <View style={styles.surahHeader}>
                  <Icon 
                    name={AppIcons.book.name} 
                    type={AppIcons.book.type} 
                    size={24} 
                    color={Theme.colors.primary} 
                  />
                  <Text style={styles.surahTitle}>Surah Progress</Text>
                </View>
                
                {surahProgress.map((surah, index) => (
                  <View key={index} style={styles.surahItem}>
                    <Text style={styles.surahName}>{surah.name}</Text>
                    <View style={styles.surahProgressBar}>
                      <View 
                        style={[
                          styles.surahProgressFill, 
                          { width: `${surah.percentage}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.surahPercent}>{surah.percentage.toFixed(0)}%</Text>
                  </View>
                ))}
              </AnimatedCard>
            )}
          </>
        )}

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
  paddingHorizontal: Theme.spacing.xl,
  paddingTop: 50,
  paddingBottom: Theme.spacing.xl,  // CHANGED: Less bottom padding
},
backButton: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: Theme.spacing.xl,
},
backText: {
  color: Theme.colors.textOnDark,
  fontSize: Theme.typography.fontSize.base,
  marginLeft: Theme.spacing.sm,
  fontWeight: Theme.typography.fontWeight.medium,
},
headerTitleContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: Theme.spacing.lg,  // CHANGED: Less margin (16px instead of 20px)
},
headerTitle: {
  fontSize: Theme.typography.fontSize['4xl'],
  fontWeight: Theme.typography.fontWeight.bold,
  color: Theme.colors.textOnDark,
  marginLeft: Theme.spacing.md,
},
content: {
  flex: 1,
},
contentContainer: {
  paddingHorizontal: Theme.spacing.xl,
  paddingBottom: Theme.spacing['6xl'],
},
tabContainer: {
  flexDirection: 'row',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: Theme.borderRadius.full,
  marginBottom: Theme.spacing.lg,  // CHANGED: Less margin (16px instead of 20px)
  padding: 4,
  marginHorizontal: Theme.spacing.xl,  // ADD THIS: Move tabs inside content area
},
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.xl,
  },
  activeTab: {
    backgroundColor: Theme.colors.white,
  },
  tabText: {
    color: Theme.colors.textOnDark,
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: Theme.typography.fontWeight.medium,
    marginLeft: Theme.spacing.xs,
  },
  activeTabText: {
    color: Theme.colors.primary,
    fontWeight: Theme.typography.fontWeight.semibold,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.xl,
  },
  statCard: {
    width: (width - Theme.spacing.xl * 2 - Theme.spacing.md) / 2,
    marginBottom: Theme.spacing.md,
    padding: Theme.spacing.lg,
  },
  statContent: {
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: Theme.spacing.sm,
  },
  statTextContent: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: Theme.typography.fontSize['2xl'],
    fontWeight: Theme.typography.fontWeight.bold,
    marginBottom: Theme.spacing.xs,
  },
  statTitle: {
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.textSecondary,
    fontWeight: Theme.typography.fontWeight.semibold,
    marginBottom: Theme.spacing.xs,
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.textMuted,
    textAlign: 'center',
  },
  chartCard: {
    padding: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    justifyContent: 'center',
  },
  chartTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.primary,
    marginLeft: Theme.spacing.sm,
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'end',
    height: 100,
    marginBottom: Theme.spacing.lg,
  },
  dayBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dayBar: {
    width: 20,
    borderRadius: Theme.borderRadius.sm,
    marginBottom: Theme.spacing.sm,
  },
  dayLabel: {
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
    fontWeight: Theme.typography.fontWeight.medium,
  },
  dayValue: {
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.primary,
    fontWeight: Theme.typography.fontWeight.bold,
  },
  weeklyBars: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'end',
    height: 120,
  },
  weekBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  weekBar: {
    width: 30,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.md,
  },
  weekLabel: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.xs,
    fontWeight: Theme.typography.fontWeight.medium,
  },
  weekValue: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary,
    fontWeight: Theme.typography.fontWeight.bold,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Theme.spacing.xl,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: Theme.borderRadius.sm,
    marginRight: Theme.spacing.xs,
  },
  legendText: {
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.textSecondary,
    fontWeight: Theme.typography.fontWeight.medium,
  },
  projectionCard: {
    padding: Theme.spacing.xl,
    marginBottom: Theme.spacing.xl,
  },
  projectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    justifyContent: 'center',
  },
  projectionTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.primary,
    marginLeft: Theme.spacing.sm,
  },
  projectionItem: {
  flexDirection: 'column',
  paddingVertical: Theme.spacing.md,
  borderBottomWidth: 1,
  borderBottomColor: Theme.colors.gray200,
},
projectionLabelContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: Theme.spacing.xs,
},
projectionLabel: {
  fontSize: Theme.typography.fontSize.sm,
  color: Theme.colors.textSecondary,
  marginLeft: Theme.spacing.sm,
  fontWeight: Theme.typography.fontWeight.medium,
},
projectionDate: {
  fontSize: Theme.typography.fontSize.base,
  color: Theme.colors.primary,
  fontWeight: Theme.typography.fontWeight.semibold,
  marginBottom: Theme.spacing.xs,
},
projectionDays: {
  fontSize: Theme.typography.fontSize.sm,
  color: Theme.colors.secondary,
  fontWeight: Theme.typography.fontWeight.bold,
},
  surahCard: {
    padding: Theme.spacing.xl,
  },
  surahHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    justifyContent: 'center',
  },
  surahTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.primary,
    marginLeft: Theme.spacing.sm,
  },
  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  surahName: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    width: 100,
    fontWeight: Theme.typography.fontWeight.medium,
  },
  surahProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: Theme.colors.gray200,
    borderRadius: Theme.borderRadius.sm,
    marginHorizontal: Theme.spacing.md,
    overflow: 'hidden',
  },
  surahProgressFill: {
    height: '100%',
    backgroundColor: Theme.colors.success,
    borderRadius: Theme.borderRadius.sm,
  },
  surahPercent: {
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.primary,
    fontWeight: Theme.typography.fontWeight.bold,
    width: 40,
    textAlign: 'right',
  },
  loadingContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  },
  loadingText: {
  color: Theme.colors.textOnDark,
  fontSize: 16,
  marginTop: 16,
  fontWeight: '500',
  },
});
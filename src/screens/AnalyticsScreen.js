import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StorageService } from '../services/StorageService';
import { AnalyticsUtils } from '../utils/AnalyticsUtils';
import { QuranUtils } from '../utils/QuranUtils';

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

  const StatCard = ({ title, value, subtitle, color = '#004d24' }) => (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statSubtitle}>{subtitle}</Text>
    </View>
  );

  const DailyBar = ({ day, maxValue }) => {
    const height = maxValue > 0 ? Math.max((day.memorized / maxValue) * 60, 2) : 2;
    const tikrarColor = day.tikrarCompleted >= 0.75 ? '#009c4a' : '#ffc107';
    
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
      <View style={styles.loadingContainer}>
        <Text>Loading analytics...</Text>
      </View>
    );
  }

  return (
    <LinearGradient colors={['#004d24', '#058743']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'week' && styles.activeTab]}
            onPress={() => setActiveTab('week')}
          >
            <Text style={[styles.tabText, activeTab === 'week' && styles.activeTabText]}>This Week</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'month' && styles.activeTab]}
            onPress={() => setActiveTab('month')}
          >
            <Text style={[styles.tabText, activeTab === 'month' && styles.activeTabText]}>This Month</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'projections' && styles.activeTab]}
            onPress={() => setActiveTab('projections')}
          >
            <Text style={[styles.tabText, activeTab === 'projections' && styles.activeTabText]}>Projections</Text>
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
                color="#d4af37"
              />
              <StatCard 
                title="Daily Average"
                value={weeklyData.averageDaily.toFixed(1)}
                subtitle="ayahs per day"
                color="#009c4a"
              />
              <StatCard 
                title="Current Streak"
                value={weeklyData.streak}
                subtitle="consecutive days"
                color="#058743"
              />
              <StatCard 
                title="Tikrar Rate"
                value={`${weeklyData.tikrarCompletionRate}/7`}
                subtitle="days completed"
                color="#004d24"
              />
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Daily Progress</Text>
              <View style={styles.barsContainer}>
                {weeklyData.dailyData.map((day, index) => (
                  <DailyBar 
                    key={index} 
                    day={day} 
                    maxValue={Math.max(...weeklyData.dailyData.map(d => d.memorized))}
                  />
                ))}
              </View>
              <View style={styles.legend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#009c4a' }]} />
                  <Text style={styles.legendText}>Full Tikrar</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: '#ffc107' }]} />
                  <Text style={styles.legendText}>Partial Tikrar</Text>
                </View>
              </View>
            </View>
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
                color="#d4af37"
              />
              <StatCard 
                title="Best Week"
                value={monthlyData.bestWeek}
                subtitle="ayahs in one week"
                color="#009c4a"
              />
              <StatCard 
                title="Consistent Days"
                value={monthlyData.consistentDays}
                subtitle="out of 30 days"
                color="#058743"
              />
              <StatCard 
                title="Weekly Average"
                value={(monthlyData.totalMonthAyahs / 4).toFixed(0)}
                subtitle="ayahs per week"
                color="#004d24"
              />
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.chartTitle}>Weekly Breakdown</Text>
              <View style={styles.weeklyBars}>
                {monthlyData.weeklyData.map((week, index) => (
                  <View key={index} style={styles.weekBarContainer}>
                    <View 
                      style={[
                        styles.weekBar, 
                        { 
                          height: Math.max((week.total / monthlyData.bestWeek) * 80, 5),
                          backgroundColor: '#d4af37'
                        }
                      ]} 
                    />
                    <Text style={styles.weekLabel}>Week {week.week}</Text>
                    <Text style={styles.weekValue}>{week.total}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {/* Projections */}
        {activeTab === 'projections' && projections && (
          <>
            <View style={styles.projectionCard}>
              <Text style={styles.projectionTitle}>Completion Projections</Text>
              
              <View style={styles.projectionItem}>
                <Text style={styles.projectionLabel}>Optimistic</Text>
                <Text style={styles.projectionDate}>
                  {projections.optimistic.date.toLocaleDateString()}
                </Text>
                <Text style={styles.projectionDays}>
                  {projections.optimistic.days} days
                </Text>
              </View>

              <View style={styles.projectionItem}>
                <Text style={styles.projectionLabel}>Realistic</Text>
                <Text style={styles.projectionDate}>
                  {projections.realistic.date.toLocaleDateString()}
                </Text>
                <Text style={styles.projectionDays}>
                  {projections.realistic.days} days
                </Text>
              </View>

              <View style={styles.projectionItem}>
                <Text style={styles.projectionLabel}>Conservative</Text>
                <Text style={styles.projectionDate}>
                  {projections.conservative.date.toLocaleDateString()}
                </Text>
                <Text style={styles.projectionDays}>
                  {projections.conservative.days} days
                </Text>
              </View>
            </View>

            {surahProgress.length > 0 && (
              <View style={styles.surahCard}>
                <Text style={styles.surahTitle}>Surah Progress</Text>
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
              </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    marginBottom: 20,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: 'white',
  },
  tabText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#004d24',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    width: (width - 50) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 10,
    color: '#999',
  },
  chartCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004d24',
    marginBottom: 15,
    textAlign: 'center',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'end',
    height: 100,
    marginBottom: 15,
  },
  dayBarContainer: {
    alignItems: 'center',
    flex: 1,
  },
  dayBar: {
    width: 20,
    borderRadius: 10,
    marginBottom: 8,
  },
  dayLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  dayValue: {
    fontSize: 10,
    color: '#004d24',
    fontWeight: 'bold',
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
    borderRadius: 15,
    marginBottom: 10,
  },
  weekLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  weekValue: {
    fontSize: 12,
    color: '#004d24',
    fontWeight: 'bold',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  projectionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  projectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004d24',
    marginBottom: 15,
    textAlign: 'center',
  },
  projectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  projectionLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  projectionDate: {
    fontSize: 14,
    color: '#004d24',
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  projectionDays: {
    fontSize: 14,
    color: '#d4af37',
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  surahCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
  },
  surahTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004d24',
    marginBottom: 15,
  },
  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  surahName: {
    fontSize: 14,
    color: '#666',
    width: 100,
  },
  surahProgressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  surahProgressFill: {
    height: '100%',
    backgroundColor: '#009c4a',
    borderRadius: 4,
  },
  surahPercent: {
    fontSize: 12,
    color: '#004d24',
    fontWeight: 'bold',
    width: 40,
    textAlign: 'right',
  },
});
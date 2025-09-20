import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StorageService } from '../services/StorageService';
import { QuranUtils } from '../utils/QuranUtils';
import TikrarPlan from '../components/TikrarPlan';
import AchievementModal from '../components/AchievementModal';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ navigation }) {
  const [stats, setStats] = useState(null);
  const [state, setState] = useState(null);
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
      console.log('Dashboard focused - reloading data');
      loadData();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      console.log('Loading dashboard data...');
      let appState = await StorageService.getState();
      if (!appState) {
        appState = await StorageService.initializeState();
      }
      
      console.log('App state loaded:', {
        ayahProgressKeys: Object.keys(appState?.ayahProgress || {}),
        progressKeys: Object.keys(appState?.progress || {}),
        userName: appState?.settings?.userName
      });
      
      // Set user name
      const name = appState?.settings?.userName || 'Student';
      setUserName(name);
      
      // Check for new achievements
      const { updatedState, newAchievements } = await QuranUtils.checkAndAwardAchievements(appState);
      
      setState(updatedState);
      
      // Compute stats and revision plan
      const computedStats = QuranUtils.computeStats(updatedState);
      const todaysRevision = QuranUtils.getRevisionPlan(updatedState);
      
      console.log('Computed stats:', computedStats);
      console.log('Revision plan exists:', !!todaysRevision);
      
      setStats(computedStats);
      setRevisionPlan(todaysRevision);
      
      // Count achievements
      const earnedCount = updatedState.earnedAchievements?.length || 0;
      setTotalAchievements(earnedCount);
      
      // Show achievement modal if there are new achievements
      if (newAchievements.length > 0) {
        setAchievementModal({
          visible: true,
          achievements: newAchievements
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
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

  // Default stats if not loaded
  const displayStats = stats || {
    percentComplete: 0,
    memorized: 0,
    total: 6236,
    remaining: 6236,
    daily: 10,
    daysLeft: 624
  };

  // Get today's progress
  const today = QuranUtils.localISO();
  const todayProgress = state?.progress?.[today] || 0;

  // Calculate days till Hafidh completion
  const daysLeftTillHafidh = Math.ceil(displayStats.remaining / displayStats.daily);
  const hafidhhETA = new Date();
  hafidhhETA.setDate(hafidhhETA.getDate() + daysLeftTillHafidh);

  return (
    <LinearGradient colors={['#2b9153', '#009c4a']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.greeting}>As-salamu alaykum {userName}</Text>
          </View>
          <Text style={styles.title}>Your Hifdh Journey</Text>
        </View>

        {/* Progress Ring */}
        <View style={styles.progressSection}>
          <View style={styles.progressRingContainer}>
            <View style={styles.progressRing}>
              <View style={[
                styles.progressFill,
                { 
                  width: `${Math.min(100, displayStats.percentComplete)}%`,
                  backgroundColor: displayStats.percentComplete > 0 ? '#d4af37' : 'transparent'
                }
              ]} />
              <View style={styles.progressContent}>
                <Text style={styles.progressPercent}>
                  {displayStats.percentComplete.toFixed(1)}%
                </Text>
                <Text style={styles.progressLabel}>Complete</Text>
              </View>
            </View>
          </View>
          <Text style={styles.progressStats}>
            {displayStats.memorized} / {displayStats.total} ayahs
          </Text>
        </View>
        
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
            <View style={styles.todayStats}>
              <Text style={styles.todayNumber}>{todayProgress}</Text>
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
          
          {/* Continue Reading Button */}
          <TouchableOpacity 
            style={styles.continueReadingButton}
            onPress={() => navigation.navigate('SurahList')}
          >
            <Text style={styles.continueReadingButtonText}>Memorize the Quran</Text>
          </TouchableOpacity>
        </View>

        {/* Enhanced Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{displayStats.remaining.toLocaleString()}</Text>
            <Text style={styles.statTitle}>Remaining</Text>
            <Text style={styles.statSubtitle}>Ayahs left</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{displayStats.daily}</Text>
            <Text style={styles.statTitle}>Daily Target</Text>
            <Text style={styles.statSubtitle}>Ayahs/day</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, styles.hafidhhValue]}>{daysLeftTillHafidh}</Text>
            <Text style={styles.statTitle}>Days to Hafidh</Text>
            <Text style={styles.statSubtitle}>At current pace</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{hafidhhETA.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</Text>
            <Text style={styles.statTitle}>Expected Date</Text>
            <Text style={styles.statSubtitle}>{hafidhhETA.getFullYear()}</Text>
          </View>
        </View>

        {/* Analytics Button */}
        <TouchableOpacity 
          style={styles.analyticsSection}
          onPress={() => navigation.navigate('Analytics')}
        >
          <View style={styles.analyticsContent}>
            <Text style={styles.analyticsEmoji}>📊</Text>
            <View style={styles.analyticsText}>
              <Text style={styles.analyticsTitle}>Analytics</Text>
              <Text style={styles.analyticsSubtitle}>View detailed progress</Text>
            </View>
            <Text style={styles.analyticsArrow}>→</Text>
          </View>
        </TouchableOpacity>

        {/* Achievements Section */}
        {totalAchievements > 0 && (
          <TouchableOpacity 
            style={styles.achievementSection}
            onPress={() => navigation.navigate('Achievements')}
          >
            <View style={styles.achievementContent}>
              <Text style={styles.achievementEmoji}>🏆</Text>
              <View style={styles.achievementText}>
                <Text style={styles.achievementTitle}>Achievements</Text>
                <Text style={styles.achievementCount}>{totalAchievements} earned</Text>
              </View>
              <Text style={styles.achievementArrow}>→</Text>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
  },
  greeting: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  progressSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  progressRingContainer: {
    marginBottom: 15,
  },
  progressRing: {
    width: 200,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 40,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 38,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  progressContent: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  progressPercent: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  progressLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressStats: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  todaySection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  todayCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todayStats: {
    alignItems: 'center',
  },
  todayNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#004d24',
  },
  todayLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  todayProgressWrapper: {
    flex: 1,
    marginLeft: 20,
  },
  todayProgressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  todayProgressBarFill: {
    height: '100%',
    backgroundColor: '#009c4a',
    borderRadius: 4,
  },
  todayGoal: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  continueReadingButton: {
    backgroundColor: '#d4af37',
    borderRadius: 25,
    paddingVertical: 12,
    marginTop: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  continueReadingButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    width: (width - 50) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004d24',
    marginBottom: 5,
  },
  hafidhhValue: {
    color: '#d4af37',
  },
  statTitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 2,
  },
  analyticsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  analyticsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  analyticsEmoji: {
    fontSize: 28,
    marginRight: 15,
  },
  analyticsText: {
    flex: 1,
  },
  analyticsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004d24',
    marginBottom: 2,
  },
  analyticsSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  analyticsArrow: {
    fontSize: 18,
    color: '#d4af37',
    fontWeight: 'bold',
  },
  achievementSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  achievementEmoji: {
    fontSize: 28,
    marginRight: 15,
  },
  achievementText: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004d24',
    marginBottom: 2,
  },
  achievementCount: {
    fontSize: 14,
    color: '#666',
  },
  achievementArrow: {
    fontSize: 18,
    color: '#d4af37',
    fontWeight: 'bold',
  },
});
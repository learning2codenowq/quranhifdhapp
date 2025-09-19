import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StorageService } from '../services/StorageService';
import { AchievementSystem } from '../utils/AchievementSystem';

export default function AchievementsScreen({ navigation }) {
  const [earnedAchievements, setEarnedAchievements] = useState([]);
  const [totalAchievements] = useState(AchievementSystem.achievements.length);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    const state = await StorageService.getState();
    const earned = state?.earnedAchievements || [];
    setEarnedAchievements(earned);
  };

  const getAchievementData = (achievementId) => {
    return AchievementSystem.achievements.find(a => a.id === achievementId);
  };

  const AchievementCard = ({ achievement, isEarned }) => (
    <View style={[styles.achievementCard, !isEarned && styles.lockedCard]}>
      <View style={styles.achievementIcon}>
        <Text style={styles.achievementEmoji}>
          {isEarned ? '🏆' : '🔒'}
        </Text>
      </View>
      <View style={styles.achievementInfo}>
        <Text style={[styles.achievementTitle, !isEarned && styles.lockedText]}>
          {achievement.title}
        </Text>
        <Text style={[styles.achievementDesc, !isEarned && styles.lockedText]}>
          {achievement.description}
        </Text>
        <Text style={styles.achievementType}>
          {achievement.type.replace('_', ' ').toUpperCase()}
        </Text>
      </View>
      {isEarned && (
        <View style={styles.earnedBadge}>
          <Text style={styles.earnedText}>✓</Text>
        </View>
      )}
    </View>
  );

  const categorizedAchievements = {
    memorization: AchievementSystem.achievements.filter(a => a.type === 'memorization'),
    streak: AchievementSystem.achievements.filter(a => a.type === 'streak'),
    tikrar_completion: AchievementSystem.achievements.filter(a => a.type === 'tikrar_completion'),
    special: AchievementSystem.achievements.filter(a => ['surah_completion', 'specific_surah', 'juz_completion', 'special'].includes(a.type))
  };

  return (
    <LinearGradient colors={['#004d24', '#058743']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Dashboard</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Achievements</Text>
        <Text style={styles.headerSubtitle}>
          {earnedAchievements.length} / {totalAchievements} Unlocked
        </Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Memorization Milestones</Text>
          {categorizedAchievements.memorization.map(achievement => (
            <AchievementCard 
              key={achievement.id}
              achievement={achievement}
              isEarned={earnedAchievements.includes(achievement.id)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consistency Streaks</Text>
          {categorizedAchievements.streak.map(achievement => (
            <AchievementCard 
              key={achievement.id}
              achievement={achievement}
              isEarned={earnedAchievements.includes(achievement.id)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tikrar Mastery</Text>
          {categorizedAchievements.tikrar_completion.map(achievement => (
            <AchievementCard 
              key={achievement.id}
              achievement={achievement}
              isEarned={earnedAchievements.includes(achievement.id)}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Recognition</Text>
          {categorizedAchievements.special.map(achievement => (
            <AchievementCard 
              key={achievement.id}
              achievement={achievement}
              isEarned={earnedAchievements.includes(achievement.id)}
            />
          ))}
        </View>

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  backText: {
    color: 'white',
    fontSize: 16,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  lockedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  achievementIcon: {
    marginRight: 15,
  },
  achievementEmoji: {
    fontSize: 32,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#004d24',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    lineHeight: 20,
  },
  achievementType: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  lockedText: {
    color: '#999',
  },
  earnedBadge: {
    backgroundColor: '#009c4a',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earnedText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
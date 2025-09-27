import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StorageService } from '../services/StorageService';
import { AchievementSystem } from '../utils/AchievementSystem';
import AnimatedCard from '../components/AnimatedCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Icon, AppIcons } from '../components/Icon';
import { Theme } from '../styles/theme';

export default function AchievementsScreen({ navigation }) {
  const [earnedAchievements, setEarnedAchievements] = useState([]);
  const totalAchievements = React.useMemo(() => {
  const memorization = AchievementSystem.achievements.filter(a => a.type === 'memorization');
  const streak = AchievementSystem.achievements.filter(a => a.type === 'streak');
    return memorization.length + streak.length;
   }, []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    setLoading(true);
    const state = await StorageService.getState();
    const earned = state?.earnedAchievements || [];
    setEarnedAchievements(earned);
    setLoading(false);
  };

  const getAchievementData = (achievementId) => {
    return AchievementSystem.achievements.find(a => a.id === achievementId);
  };

  const getAchievementIcon = (type, isEarned) => {
    if (!isEarned) {
      return { name: 'lock-closed', type: 'Ionicons', color: Theme.colors.textMuted };
    }

    switch (type) {
      case 'memorization':
        return { name: AppIcons.checkmark.name, type: AppIcons.checkmark.type, color: Theme.colors.success };
      case 'streak':
        return { name: AppIcons.flame.name, type: AppIcons.flame.type, color: Theme.colors.warning };
      case 'surah_completion':
      case 'specific_surah':
        return { name: AppIcons.book.name, type: AppIcons.book.type, color: Theme.colors.info };
      case 'juz_completion':
        return { name: AppIcons.star.name, type: AppIcons.star.type, color: Theme.colors.secondary };
      default:
        return { name: AppIcons.trophy.name, type: AppIcons.trophy.type, color: Theme.colors.primary };
    }
  };

  const AchievementCard = ({ achievement, isEarned }) => {
    const iconData = getAchievementIcon(achievement.type, isEarned);
    
    return (
      <AnimatedCard 
        style={[
          styles.achievementCard, 
          !isEarned && styles.lockedCard,
          isEarned && styles.earnedCard
        ]}
        variant={isEarned ? "elevated" : "outlined"}
      >
        <View style={styles.achievementContent}>
          <View style={[
            styles.achievementIconContainer,
            { backgroundColor: isEarned ? `${iconData.color}20` : Theme.colors.gray100 }
          ]}>
            <Icon 
              name={iconData.name}
              type={iconData.type}
              size={32}
              color={iconData.color}
            />
          </View>
          
          <View style={styles.achievementInfo}>
            <Text style={[
              styles.achievementTitle, 
              !isEarned && styles.lockedText
            ]}>
              {achievement.title}
            </Text>
            <Text style={[
              styles.achievementDesc, 
              !isEarned && styles.lockedText
            ]}>
              {achievement.description}
            </Text>
            <View style={styles.achievementTypeContainer}>
              <Text style={styles.achievementType}>
                {achievement.type.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>

          {isEarned && (
            <View style={styles.earnedBadge}>
              <Icon 
                name="checkmark" 
                type="Ionicons" 
                size={20} 
                color={Theme.colors.textOnPrimary} 
              />
            </View>
          )}
        </View>
      </AnimatedCard>
    );
  };

  const categorizedAchievements = {
  memorization: AchievementSystem.achievements.filter(a => a.type === 'memorization'),
  streak: AchievementSystem.achievements.filter(a => a.type === 'streak')
};

  const getCategoryIcon = (category) => {
  switch (category) {
    case 'memorization':
      return { name: 'library', type: 'Ionicons' };
    case 'streak':
      return { name: 'book', type: 'Ionicons' };
    default:
      return { name: 'trophy', type: 'Ionicons' };
  }
};

  const getCategoryTitle = (category) => {
  switch (category) {
    case 'memorization':
      return 'Memorization Milestones';
    case 'streak':
      return 'Consistency Streaks';
    default:
      return 'Achievements';
  }
};

  if (loading) {
    return (
      <LinearGradient colors={Theme.gradients.primary} style={styles.container}>
        <LoadingSpinner message="Loading achievements..." />
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={Theme.gradients.primary} style={styles.container}>
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
            name={AppIcons.trophy.name} 
            type={AppIcons.trophy.type} 
            size={32} 
            color={Theme.colors.secondary} 
          />
          <Text style={styles.headerTitle}>Achievements</Text>
        </View>
        
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {earnedAchievements.length} / {totalAchievements} Unlocked
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${(earnedAchievements.length / totalAchievements) * 100}%` }
              ]}
            />
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        
        {Object.entries(categorizedAchievements).map(([category, achievements]) => (
          <View key={category} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Icon 
                name={getCategoryIcon(category).name}
                type={getCategoryIcon(category).type}
                size={24}
                color={Theme.colors.secondary}
              />
              <Text style={styles.sectionTitle}>{getCategoryTitle(category)}</Text>
            </View>
            
            {achievements.map(achievement => (
              <AchievementCard 
                key={achievement.id}
                achievement={achievement}
                isEarned={earnedAchievements.includes(achievement.id)}
              />
            ))}
          </View>
        ))}

      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: 50,
    paddingBottom: Theme.spacing['3xl'],
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
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
    marginBottom: Theme.spacing.xl,
  },
  headerTitle: {
    fontSize: Theme.typography.fontSize['4xl'],
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.textOnDark,
    marginLeft: Theme.spacing.md,
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
  },
  progressText: {
    fontSize: Theme.typography.fontSize.base,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: Theme.spacing.sm,
    fontWeight: Theme.typography.fontWeight.medium,
  },
  progressBar: {
    width: '80%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: Theme.borderRadius.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.secondary,
    borderRadius: Theme.borderRadius.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: Theme.spacing['6xl'],
  },
  section: {
    marginBottom: Theme.spacing['3xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.textOnDark,
    marginLeft: Theme.spacing.sm,
  },
  achievementCard: {
    marginBottom: Theme.spacing.md,
    padding: Theme.spacing.lg,
  },
  lockedCard: {
    opacity: 0.6,
  },
  earnedCard: {
    backgroundColor: Theme.colors.successLight,
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.success,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  achievementIconContainer: {
    width: 60,
    height: 60,
    borderRadius: Theme.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.lg,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.primary,
    marginBottom: Theme.spacing.xs,
  },
  achievementDesc: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.sm,
    lineHeight: Theme.typography.lineHeight.relaxed * Theme.typography.fontSize.sm,
  },
  achievementTypeContainer: {
    alignSelf: 'flex-start',
  },
  achievementType: {
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.textMuted,
    fontWeight: Theme.typography.fontWeight.semibold,
    backgroundColor: Theme.colors.gray100,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
  },
  lockedText: {
    color: Theme.colors.textMuted,
  },
  earnedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Theme.colors.success,
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.md,
  },
});
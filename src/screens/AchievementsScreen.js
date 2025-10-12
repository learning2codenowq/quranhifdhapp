import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StorageService } from '../services/StorageService';
import { AchievementSystem } from '../utils/AchievementSystem';
import AnimatedCard from '../components/AnimatedCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Icon, AppIcons } from '../components/Icon';
import { Theme } from '../styles/theme';
import ScreenLayout from '../layouts/ScreenLayout';
import ScreenHeader from '../layouts/ScreenHeader';
import { useSettings } from '../hooks/useSettings';

export default function AchievementsScreen({ navigation }) {
  const { settings, themedColors } = useSettings();
  
  const [earnedAchievements, setEarnedAchievements] = useState([]);
  const [totalAchievements, setTotalAchievements] = useState(0);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
  setLoading(true);
  const state = await StorageService.getState();
  const earned = state?.earnedAchievements || [];
    setEarnedAchievements(earned);
    setTotalAchievements(AchievementSystem.achievements.length);
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
        return { name: AppIcons.diamond.name, type: AppIcons.diamond.type, color: Theme.colors.warning };
      case 'surah_completion':
        return { name: AppIcons.book.name, type: AppIcons.book.type, color: Theme.colors.info };
      case 'specific_surah':
        return { name: AppIcons.star.name, type: AppIcons.star.type, color: Theme.colors.secondary };
      case 'juz_completion':
        return { name: AppIcons.medal.name, type: AppIcons.medal.type, color: Theme.colors.secondary };
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
    surah_completion: AchievementSystem.achievements.filter(a => a.type === 'surah_completion'),
    specific_surah: AchievementSystem.achievements.filter(a => a.type === 'specific_surah'),
    streak: AchievementSystem.achievements.filter(a => a.type === 'streak'),
    special: AchievementSystem.achievements.filter(a => a.type === 'special')
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'memorization':
        return { name: 'library', type: 'Ionicons' };
      case 'surah_completion':
        return { name: 'book', type: 'Ionicons' };
      case 'specific_surah':
        return { name: 'star', type: 'Ionicons' };
      case 'streak':
        return { name: 'diamond', type: 'Ionicons' };
      case 'special':
        return { name: 'trophy', type: 'Ionicons' };
      default:
        return { name: 'trophy', type: 'Ionicons' };
    }
  };

  const getCategoryTitle = (category) => {
    switch (category) {
      case 'memorization':
        return 'Memorization Milestones';
      case 'surah_completion':
        return 'Surah Completion';
      case 'specific_surah':
        return 'Special Surahs';
      case 'streak':
        return 'Consistency Streaks';
      case 'special':
        return 'Special Achievements';
      default:
        return 'Achievements';
    }
  };

  if (loading) {
  return (
    <ScreenLayout>
      <LoadingSpinner message="Loading achievements..." />
    </ScreenLayout>
  );
}

  return (
  <ScreenLayout scrollable={true}>
    <ScreenHeader 
      title="Achievements"
      subtitle={`${earnedAchievements.length} / ${totalAchievements} Unlocked`}
      onBack={() => navigation.goBack()}
    />
    
    <View style={styles.content}>
      
      {/* Progress Bar */}
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

      {/* Achievement Categories */}
      {Object.entries(categorizedAchievements).map(([category, achievements]) => {
        if (achievements.length === 0) return null;
        
        return (
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
        );
      })}
      
    </View>
  </ScreenLayout>
);
}

const styles = StyleSheet.create({
  progressContainer: {
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  borderRadius: Theme.borderRadius.lg,
  padding: Theme.spacing.lg,
  marginBottom: Theme.spacing.xl,
},
progressText: {
  fontSize: Theme.typography.fontSize.base,
  fontWeight: Theme.typography.fontWeight.semibold,
  color: Theme.colors.textOnDark,
  marginBottom: Theme.spacing.sm,
  textAlign: 'center',
},
progressBar: {
  height: 8,
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: Theme.borderRadius.full,
  overflow: 'hidden',
},
progressFill: {
  height: '100%',
  backgroundColor: Theme.colors.secondary,
  borderRadius: Theme.borderRadius.full,
},
  content: {
  paddingHorizontal: Theme.spacing.lg,
  paddingTop: Theme.spacing.md,
  paddingBottom: Theme.spacing.xl,
},
  contentContainer: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: Theme.spacing['6xl'],
  },
  section: {
  marginBottom: Theme.spacing.xl,
},
sectionHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: Theme.spacing.md,
  gap: Theme.spacing.sm,
},
sectionTitle: {
  fontSize: Theme.typography.fontSize.xl,
  fontWeight: Theme.typography.fontWeight.bold,
  color: Theme.colors.textOnDark,
},
  achievementCard: {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: Theme.borderRadius.lg,
  padding: Theme.spacing.lg,
  marginBottom: Theme.spacing.md,
  ...Theme.shadows.md,
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
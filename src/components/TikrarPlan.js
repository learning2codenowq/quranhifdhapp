import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { QuranUtils } from '../utils/QuranUtils';

const CategoryCard = memo(({ title, data, type, color = '#004d24', currentProgress, target, isCompleted, onPress, isActive = true }) => {
  const progressPercent = target > 0 ? (currentProgress / target) * 100 : 0;

  return (
    <TouchableOpacity 
      style={[
        styles.categoryCard, 
        { borderLeftColor: color },
        isCompleted && styles.completedCard,
        !isActive && styles.inactiveCard
      ]}
      onPress={() => isActive && onPress(type)}
      disabled={!isActive}
    >
      <View style={styles.categoryHeader}>
        <Text style={[styles.categoryTitle, { color: isActive ? color : '#999' }]}>
          {title}
        </Text>
        <View style={styles.progressBadge}>
          {!isActive ? (
            <Text style={styles.inactiveBadge}>Inactive</Text>
          ) : isCompleted ? (
            <Text style={styles.completedBadge}>✓ Done</Text>
          ) : (
            <Text style={styles.progressBadgeText}>
              {currentProgress}/{target}
            </Text>
          )}
        </View>
      </View>
      
      <Text style={[styles.categoryDescription, !isActive && styles.inactiveText]}>
        {data.description}
      </Text>
      
      {isActive && (
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.min(100, progressPercent)}%`,
                  backgroundColor: isCompleted ? '#009c4a' : color
                }
              ]} 
            />
          </View>
          <Text style={styles.progressPercentText}>
            {Math.round(progressPercent)}% Complete
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

const TikrarPlan = memo(({ tikrarPlan, state, onCategoryPress }) => {
  if (!tikrarPlan || !state) {
    console.log('TikrarPlan: Missing data', { tikrarPlan: !!tikrarPlan, state: !!state });
    return null;
  }

  // Get today's tikrar progress
  const todayProgress = QuranUtils.getTikrarProgress(state);

  const showHelp = () => {
    Alert.alert(
      'Tikrar Method',
      'Repetition of Yesterday: Repeat each ayah you memorized yesterday 5 times to strengthen retention.\n\nConnection: Recite all ayahs memorized in the last 30 days once to maintain connection.\n\nRevision: Review older memorized ayahs in a 6-day rotation cycle for long-term retention.',
      [{ text: 'Got it!' }]
    );
  };

  // Calculate overall daily completion
  const categories = ['repetitionOfYesterday', 'connection', 'revision'];
  const completedCategories = categories.filter(cat => {
    if (cat === 'repetitionOfYesterday') {
      return tikrarPlan[cat].active 
        ? (todayProgress[cat] || 0) >= tikrarPlan[cat].totalRecitations
        : true;
    }
    
    const progress = todayProgress[cat] || 0;
    const target = tikrarPlan[cat].ayahs?.length || 0;
    return target === 0 ? true : progress >= target;
  }).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Today's Tikrar Plan</Text>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={showHelp}
          >
            <Text style={styles.helpIcon}>?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.overallProgress}>
          <Text style={styles.overallProgressText}>
            {completedCategories}/3 Categories Complete
          </Text>
          <View style={styles.overallProgressBar}>
            <View 
              style={[
                styles.overallProgressFill, 
                { width: `${(completedCategories / 3) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      <CategoryCard 
        title="Repetition of Yesterday"
        data={tikrarPlan.repetitionOfYesterday}
        type="repetitionOfYesterday"
        color="#009c4a"
        currentProgress={
          tikrarPlan.repetitionOfYesterday.active 
            ? (todayProgress.repetitionOfYesterday || 0)
            : tikrarPlan.repetitionOfYesterday.completed
        }
        target={tikrarPlan.repetitionOfYesterday.totalRecitations}
        isCompleted={
          tikrarPlan.repetitionOfYesterday.active 
            ? (todayProgress.repetitionOfYesterday || 0) >= tikrarPlan.repetitionOfYesterday.totalRecitations
            : true
        }
        isActive={tikrarPlan.repetitionOfYesterday.active}
        onPress={onCategoryPress}
      />

      <CategoryCard 
        title="Connection"
        data={tikrarPlan.connection}
        type="connection"
        color="#058743"
        currentProgress={todayProgress.connection || 0}
        target={Math.max(1, tikrarPlan.connection.ayahs?.length || 0)}
        isCompleted={
          tikrarPlan.connection.ayahs?.length === 0 ? true : 
          (todayProgress.connection || 0) >= (tikrarPlan.connection.ayahs?.length || 0)
        }
        isActive={true}
        onPress={onCategoryPress}
      />

      <CategoryCard 
        title="Revision"
        data={tikrarPlan.revision}
        type="revision"
        color="#004d24"
        currentProgress={todayProgress.revision || 0}
        target={Math.max(1, tikrarPlan.revision.ayahs?.length || 0)}
        isCompleted={
          tikrarPlan.revision.ayahs?.length === 0 ? true :
          (todayProgress.revision || 0) >= (tikrarPlan.revision.ayahs?.length || 0)
        }
        isActive={true}
        onPress={onCategoryPress}
      />

      {completedCategories === 3 && (
        <View style={styles.congratsCard}>
          <Text style={styles.congratsText}>🎉 All Tikrar completed for today!</Text>
          <Text style={styles.congratsSubtext}>
            Total recitations: {tikrarPlan.totalDailyLoad}
          </Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004d24',
  },
  helpButton: {
    marginLeft: 10,
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  helpIcon: {
    fontSize: 14,
    color: '#d4af37',
    fontWeight: 'bold',
  },
  overallProgress: {
    alignItems: 'center',
    width: '100%',
  },
  overallProgressText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  overallProgressBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  overallProgressFill: {
    height: '100%',
    backgroundColor: '#009c4a',
    borderRadius: 4,
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  completedCard: {
    backgroundColor: '#f0f8f0',
  },
  inactiveCard: {
    opacity: 0.6,
    backgroundColor: '#f5f5f5',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  progressBadgeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  completedBadge: {
    fontSize: 12,
    color: '#009c4a',
    fontWeight: '600',
  },
  inactiveBadge: {
    fontSize: 12,
    color: '#999',
    fontWeight: '600',
  },
  categoryDescription: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
    marginBottom: 10,
  },
  inactiveText: {
    color: '#999',
  },
  progressSection: {
    marginTop: 5,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 5,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressPercentText: {
    fontSize: 11,
    color: '#999',
    textAlign: 'right',
  },
  congratsCard: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c3e6c3',
  },
  congratsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2d5a2d',
    marginBottom: 5,
  },
  congratsSubtext: {
    fontSize: 14,
    color: '#5a8a5a',
  },
});

export default TikrarPlan;
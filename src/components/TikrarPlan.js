import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { QuranUtils } from '../utils/QuranUtils';

const CategoryCard = memo(({ title, data, type, color = '#004d24', currentProgress, target, isCompleted, onPress, isActive = true, displayText }) => {
  const progressPercent = target > 0 ? (currentProgress / target) * 100 : 0;
  const hasRevision = type === 'revision' && target > 0;
  const noRevisionYet = type === 'revision' && target === 0;

  return (
    <TouchableOpacity 
      style={[
        styles.categoryCard, 
        { borderLeftColor: color },
        isCompleted && styles.completedCard,
        noRevisionYet && styles.inactiveCard
      ]}
      onPress={() => onPress(type)}
      disabled={false} // Always allow clicking to show details
    >
      <View style={styles.categoryHeader}>
        <Text style={[styles.categoryTitle, { color: noRevisionYet ? '#999' : color }]}>
          {title}
        </Text>
        <View style={styles.progressBadge}>
          {noRevisionYet ? (
            <Text style={styles.inactiveBadge}>Tomorrow</Text>
          ) : isCompleted ? (
            <Text style={styles.completedBadge}>✓ Done</Text>
          ) : (
            <Text style={styles.progressBadgeText}>
              {currentProgress}/{target}
            </Text>
          )}
        </View>
      </View>
      
      <Text style={[styles.categoryDescription, noRevisionYet && styles.inactiveText]}>
        {data.description}
      </Text>
      
      {/* Show specific ayahs for revision */}
      {type === 'revision' && displayText && hasRevision && (
        <Text style={styles.revisionDetails}>
          📖 Today: {displayText}
        </Text>
      )}
      
      {/* Show encouragement for no revision */}
      {type === 'revision' && noRevisionYet && (
        <Text style={styles.encouragementText}>
          🌟 {displayText}
        </Text>
      )}
      
      {hasRevision && (
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

const TikrarPlan = memo(({ revisionPlan, state, onCategoryPress }) => {
  if (!revisionPlan || !state) {
    console.log('RevisionPlan: Missing data', { revisionPlan: !!revisionPlan, state: !!state });
    return null;
  }

  // Get today's progress
  const todayProgress = QuranUtils.getTikrarProgress(state);

  const showHelp = () => {
    Alert.alert(
      'Revision Method',
      'New Memorization: Memorize your daily target of new ayahs.\n\nRevision: Review your memorized ayahs in a 6-day cycle. You will complete all memorized ayahs every week.',
      [{ text: 'Got it!' }]
    );
  };

  // Calculate completion status
  const newMemCompleted = (todayProgress.newMemorization || 0) >= revisionPlan.newMemorization.target;
  const revisionCompleted = (todayProgress.revision || 0) >= revisionPlan.revision.target;
  const totalCompleted = (newMemCompleted ? 1 : 0) + (revisionCompleted ? 1 : 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Today's Plan</Text>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={showHelp}
          >
            <Text style={styles.helpIcon}>?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.overallProgress}>
          <Text style={styles.overallProgressText}>
            {totalCompleted}/2 Tasks Complete
          </Text>
          <View style={styles.overallProgressBar}>
            <View 
              style={[
                styles.overallProgressFill, 
                { width: `${(totalCompleted / 2) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      <CategoryCard 
        title="New Memorization"
        data={revisionPlan.newMemorization}
        type="newMemorization"
        color="#009c4a"
        currentProgress={todayProgress.newMemorization || 0}
        target={revisionPlan.newMemorization.target}
        isCompleted={newMemCompleted}
        isActive={true}
        onPress={onCategoryPress}
      />

      <CategoryCard 
        title="Revision"
        data={revisionPlan.revision}
        type="revision"
        color="#004d24"
        currentProgress={todayProgress.revision || 0}
        target={revisionPlan.revision.target}
        isCompleted={revisionCompleted}
        isActive={revisionPlan.revision.target > 0}
        onPress={onCategoryPress}
        displayText={revisionPlan.revision.displayText}
      />

      {totalCompleted === 2 && (
        <View style={styles.congratsCard}>
          <Text style={styles.congratsText}>🎉 All tasks completed for today!</Text>
          <Text style={styles.congratsSubtext}>
            Total: {revisionPlan.totalDailyLoad} ayahs
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
  revisionDetails: {
    fontSize: 14,
    color: '#004d24',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 77, 36, 0.1)',
    borderRadius: 8,
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
  encouragementText: {
  fontSize: 14,
  color: '#999',
  fontStyle: 'italic',
  marginTop: 8,
  marginBottom: 5,
  paddingHorizontal: 10,
  paddingVertical: 8,
  backgroundColor: 'rgba(153, 153, 153, 0.1)',
  borderRadius: 8,
  textAlign: 'center',
},
});

export default TikrarPlan;
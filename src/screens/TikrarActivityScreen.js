import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { StorageService } from '../services/StorageService';
import { QuranUtils } from '../utils/QuranUtils';
import { Theme } from '../styles/theme';
import ScreenLayout from '../layouts/ScreenLayout';
import ScreenHeader from '../layouts/ScreenHeader';
import { useSettings } from '../hooks/useSettings';

export default function TikrarActivityScreen({ route, navigation }) {
  const { settings, themedColors } = useSettings();
  
  const { categoryType, categoryData } = route.params;
  const [completed, setCompleted] = useState(0);
  const [state, setState] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  // Add navigation listener to reload data when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('TikrarActivity focused - reloading data');
      loadData();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      const appState = await StorageService.getState();
      setState(appState);
      
      // Load existing progress for today
      const todayProgress = QuranUtils.getTikrarProgress(appState);
      const currentProgress = todayProgress[categoryType] || 0;
      setCompleted(currentProgress);
      
      console.log('TikrarActivity data loaded:', {
        categoryType,
        currentProgress,
        todayProgress
      });
    } catch (error) {
      console.error('Error loading TikrarActivity data:', error);
    }
  };

  const getTitle = () => {
    switch (categoryType) {
      case 'newMemorization': return 'New Memorization';
      case 'revision': return 'Revision';
      default: return 'Revision Activity';
    }
  };

  const getTarget = () => {
    return categoryData.target || 0;
  };

  const getButtonText = () => {
    const target = getTarget();
    if (categoryType === 'newMemorization') {
      return 'Start Memorizing';
    } else if (categoryType === 'revision') {
      if (target === 0) {
        return 'No Revision Today';
      } else if (completed >= target) {
        return 'Completed ✓';
      } else {
        return `Mark Completed (+1)`;
      }
    }
    return 'Continue';
  };

  const handleComplete = async () => {
    if (categoryType === 'newMemorization') {
      navigation.navigate('SurahList');
    } else if (categoryType === 'revision') {
      const target = getTarget();
      if (completed < target) {
        // For revision, increment by 1 recitation at a time
        const newCompleted = completed + 1;
        setCompleted(newCompleted);
        
        // Save progress
        await StorageService.updateRevisionProgress(categoryType, newCompleted);
        
        if (newCompleted >= target) {
          Alert.alert(
            'Revision Complete!',
            'Great job! You have completed today\'s revision.',
            [
              { text: 'Continue', onPress: () => navigation.goBack() }
            ]
          );
        }
      }
    }
  };

  const progress = getTarget() > 0 ? (completed / getTarget()) * 100 : 0;
  const isCompleted = completed >= getTarget();
  const isActive = getTarget() > 0;

  return (
  <ScreenLayout scrollable={true}>
    <ScreenHeader 
      title={getTitle()}
      subtitle={`Target: ${getTarget()} segments`}
      onBack={() => navigation.goBack()}
    />
    
    <View style={styles.content}>
      <View style={styles.descriptionCard}>
        <Text style={styles.description}>{categoryData.description}</Text>
      </View>

      {isActive && (
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Progress</Text>
          <Text style={styles.progressStats}>
            {completed} / {getTarget()} {categoryType === 'revision' ? 'times completed' : 'ayahs'}
          </Text>
          
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${progress}%` }]} 
            />
          </View>
          <Text style={styles.progressPercent}>{progress.toFixed(0)}% Complete</Text>
        </View>
      )}

      <TouchableOpacity 
        style={[
          styles.actionButton, 
          isCompleted && styles.completedButton,
          !isActive && styles.inactiveButton
        ]} 
        onPress={handleComplete}
        disabled={!isActive || (categoryType === 'revision' && isCompleted)}
      >
        <Text style={styles.actionButtonText}>
          {getButtonText()}
        </Text>
      </TouchableOpacity>

      {/* Show specific ayahs for revision */}
      {categoryType === 'revision' && categoryData.displayText && isActive && (
        <View style={styles.ayahListCard}>
          <Text style={styles.ayahListTitle}>Today's Revision</Text>
          <Text style={styles.revisionText}>{categoryData.displayText}</Text>
          <Text style={styles.revisionNote}>
            Recite this combined portion from memory, then mark it as completed. Do this 3 times total.
          </Text>
        </View>
      )}

      {/* No revision message */}
      {categoryType === 'revision' && !isActive && (
        <View style={styles.noRevisionCard}>
          <Text style={styles.noRevisionText}>🎉</Text>
          <Text style={styles.noRevisionTitle}>No Revision Today</Text>
          <Text style={styles.noRevisionDescription}>
            {categoryData.displayText || "Come back tomorrow to start your revision journey!"}
          </Text>
        </View>
      )}
    </View>
  </ScreenLayout>
);
}

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  content: {
  flex: 1,
  paddingHorizontal: Theme.spacing.lg,
  paddingTop: Theme.spacing.xl,
},
  descriptionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'center',
  },
  progressCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: 10,
  },
  progressStats: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: 15,
  },
  progressBar: {
    width: '100%',
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.success,
    borderRadius: 6,
  },
  progressPercent: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    backgroundColor: Theme.colors.secondary,
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 20,
    elevation: 3,
  },
  completedButton: {
    backgroundColor: Theme.colors.success,
  },
  inactiveButton: {
    backgroundColor: '#999',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  ayahListCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
  },
  ayahListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  revisionText: {
    fontSize: 16,
    color: Theme.colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: 'rgba(0, 77, 36, 0.1)',
    borderRadius: 8,
  },
  revisionNote: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  noRevisionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
  },
  noRevisionText: {
    fontSize: 48,
    marginBottom: 15,
  },
  noRevisionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  noRevisionDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
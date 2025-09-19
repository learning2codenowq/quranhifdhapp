import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StorageService } from '../services/StorageService';
import { QuranUtils } from '../utils/QuranUtils';

export default function TikrarActivityScreen({ route, navigation }) {
  const { categoryType, categoryData } = route.params;
  const [completed, setCompleted] = useState(0);
  const [state, setState] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const appState = await StorageService.getState();
    setState(appState);
    
    // Load existing progress for today
    const todayProgress = QuranUtils.getTikrarProgress(appState);
    const currentProgress = todayProgress[categoryType] || 0;
    setCompleted(currentProgress);
  };

  const getTitle = () => {
    switch (categoryType) {
      case 'newMemorization': return 'New Memorization';
      case 'repetitionOfYesterday': return 'Repetition of Yesterday';
      case 'connection': return 'Connection';
      case 'revision': return 'Revision';
      default: return 'Tikrar Activity';
    }
  };

  const getTarget = () => {
    switch (categoryType) {
      case 'newMemorization': return categoryData.target;
      case 'repetitionOfYesterday': return categoryData.totalRecitations;
      case 'connection': return categoryData.ayahs?.length || 0;
      case 'revision': return categoryData.ayahs?.length || 0;
      default: return 0;
    }
  };

  const handleComplete = async () => {
    if (categoryType === 'newMemorization') {
      navigation.navigate('QuranReader');
    } else {
      const target = getTarget();
      if (completed < target) {
        const newCompleted = completed + 1;
        setCompleted(newCompleted);
        
        // Save progress
        await StorageService.updateTikrarProgress(categoryType, newCompleted);
        
        if (newCompleted >= target) {
          Alert.alert(
            'Category Complete!',
            `You have completed ${getTitle()}`,
            [
              { text: 'Continue', onPress: () => navigation.goBack() }
            ]
          );
        }
      }
    }
  };

  const progress = getTarget() > 0 ? (completed / getTarget()) * 100 : 0;

  return (
    <LinearGradient colors={['#004d24', '#058743']} style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{getTitle()}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.descriptionCard}>
          <Text style={styles.description}>{categoryData.description}</Text>
        </View>

        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Progress</Text>
          <Text style={styles.progressStats}>
            {completed} / {getTarget()} {categoryType === 'repetitionOfYesterday' ? 'recitations' : 'ayahs'}
          </Text>
          
          <View style={styles.progressBar}>
            <View 
              style={[styles.progressFill, { width: `${progress}%` }]} 
            />
          </View>
          <Text style={styles.progressPercent}>{progress.toFixed(0)}% Complete</Text>
        </View>

        {categoryType === 'newMemorization' ? (
          <TouchableOpacity style={styles.actionButton} onPress={handleComplete}>
            <Text style={styles.actionButtonText}>Start Memorizing</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.actionButton, completed >= getTarget() && styles.completedButton]} 
            onPress={handleComplete}
            disabled={completed >= getTarget()}
          >
            <Text style={styles.actionButtonText}>
              {completed >= getTarget() ? 'Completed ✓' : 'Mark Recited (+1)'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Show ayah details for connection and revision */}
        {(categoryType === 'connection' || categoryType === 'revision') && categoryData.ayahs && (
          <View style={styles.ayahListCard}>
            <Text style={styles.ayahListTitle}>
              {categoryType === 'connection' ? 'Connection Ayahs' : 'Revision Ayahs'}
            </Text>
            {categoryData.ayahs.slice(0, 10).map((ayah, index) => (
              <Text key={index} style={styles.ayahItem}>
                Surah {ayah.surahId}, Ayah {ayah.ayahNumber}
              </Text>
            ))}
            {categoryData.ayahs.length > 10 && (
              <Text style={styles.moreAyahs}>
                ...and {categoryData.ayahs.length - 10} more ayahs
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

// Keep the same styles as before
const styles = StyleSheet.create({
  // ... (same styles as before)
  container: {
    flex: 1,
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
    paddingHorizontal: 20,
    paddingBottom: 30,
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
    color: '#004d24',
    marginBottom: 10,
  },
  progressStats: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004d24',
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
    backgroundColor: '#009c4a',
    borderRadius: 6,
  },
  progressPercent: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    backgroundColor: '#d4af37',
    borderRadius: 25,
    paddingVertical: 15,
    marginBottom: 20,
    elevation: 3,
  },
  completedButton: {
    backgroundColor: '#009c4a',
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
    color: '#004d24',
    marginBottom: 15,
  },
  ayahItem: {
    fontSize: 14,
    color: '#666',
    paddingVertical: 3,
  },
  moreAyahs: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 5,
  },
});
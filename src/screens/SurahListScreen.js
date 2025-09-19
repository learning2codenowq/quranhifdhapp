import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QuranService } from '../services/QuranService';
import { StorageService } from '../services/StorageService';

const { width } = Dimensions.get('window');

export default function SurahListScreen({ navigation }) {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memorizedStats, setMemorizedStats] = useState({});

  useEffect(() => {
    loadSurahs();
    loadMemorizedStats();
  }, []);

  // Add focus listener to reload progress when returning from QuranReader
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('SurahList focused - reloading progress');
      loadMemorizedStats(); // Reload only the progress stats, not the full surah list
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadSurahs = async () => {
    try {
      setLoading(true);
      const surahList = await QuranService.getAllSurahs();
      setSurahs(surahList);
    } catch (error) {
      console.error('Error loading surahs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMemorizedStats = async () => {
    try {
      const state = await StorageService.getState();
      const stats = {};
      
      if (state?.ayahProgress) {
        Object.keys(state.ayahProgress).forEach(surahId => {
          const surahProgress = state.ayahProgress[surahId];
          const memorizedCount = Object.values(surahProgress).filter(
            ayah => ayah.memorized
          ).length;
          stats[surahId] = memorizedCount;
        });
      }
      
      console.log('Updated memorized stats:', stats);
      setMemorizedStats(stats);
    } catch (error) {
      console.error('Error loading memorized stats:', error);
    }
  };

  const getSurahProgress = (surah) => {
    const memorized = memorizedStats[surah.id] || 0;
    const total = surah.total_ayahs || 0;
    const percentage = total > 0 ? (memorized / total) * 100 : 0;
    return { memorized, total, percentage };
  };

  const SurahItem = ({ item }) => {
    const progress = getSurahProgress(item);
    const isCompleted = progress.percentage === 100;
    const hasProgress = progress.memorized > 0;

    return (
      <TouchableOpacity
        style={[
          styles.surahCard,
          isCompleted && styles.completedSurah
        ]}
        onPress={() => navigation.navigate('QuranReader', { surahId: item.id })}
      >
        <View style={styles.surahHeader}>
          <View style={styles.surahInfo}>
            <Text style={styles.surahNumber}>{item.id}</Text>
            <View style={styles.surahNames}>
              <Text style={styles.surahName}>{item.name}</Text>
              <Text style={styles.surahArabicName}>{item.arabic_name}</Text>
            </View>
          </View>
          
          <View style={styles.surahMeta}>
            <Text style={styles.surahType}>{item.type}</Text>
            <Text style={styles.ayahCount}>{item.total_ayahs} ayahs</Text>
          </View>
        </View>

        {hasProgress && (
          <View style={styles.progressSection}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>
                {progress.memorized}/{progress.total} memorized
              </Text>
              <Text style={styles.progressPercentage}>
                {Math.round(progress.percentage)}%
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBarFill,
                  { 
                    width: `${progress.percentage}%`,
                    backgroundColor: isCompleted ? '#009c4a' : '#d4af37'
                  }
                ]}
              />
            </View>
          </View>
        )}

        {isCompleted && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✓ Completed</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const LoadingScreen = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#d4af37" />
      <Text style={styles.loadingText}>Loading Surahs...</Text>
      <Text style={styles.loadingSubtext}>Please wait while we fetch the Quran chapters</Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaProvider>
        <LinearGradient colors={['#004d24', '#058743']} style={styles.container}>
          <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
            <LoadingScreen />
          </SafeAreaView>
        </LinearGradient>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <LinearGradient colors={['#004d24', '#058743']} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>← Back to Dashboard</Text>
            </TouchableOpacity>
            
            <Text style={styles.title}>Quran Surahs</Text>
            <Text style={styles.subtitle}>Choose a surah to memorize</Text>
          </View>

          <FlatList
            data={surahs}
            keyExtractor={(item) => item.id.toString()}
            renderItem={SurahItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  backText: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  surahCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    marginBottom: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  completedSurah: {
    backgroundColor: '#f0f8f0',
    borderWidth: 2,
    borderColor: '#009c4a',
  },
  surahHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  surahInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  surahNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d4af37',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 15,
    minWidth: 50,
    textAlign: 'center',
  },
  surahNames: {
    flex: 1,
  },
  surahName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  surahArabicName: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  surahMeta: {
    alignItems: 'flex-end',
  },
  surahType: {
    fontSize: 12,
    color: '#95a5a6',
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 4,
  },
  ayahCount: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  progressSection: {
    marginTop: 10,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#5a6c7d',
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  completedBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#009c4a',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  completedText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
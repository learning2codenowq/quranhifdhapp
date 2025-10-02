import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QuranService } from '../services/QuranService';
import { StorageService } from '../services/StorageService';
import AnimatedCard from '../components/AnimatedCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Icon, AppIcons } from '../components/Icon';
import { Theme } from '../styles/theme';
import { getThemedColors } from '../styles/theme';
import { SurahListSkeleton } from '../components/SkeletonLoader';

export default function SurahListScreen({ navigation }) {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({ darkMode: false });
  const [memorizedStats, setMemorizedStats] = useState({});

  useEffect(() => {
    loadSurahs();
    loadMemorizedStats();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadMemorizedStats();
    });
    
    return unsubscribe;
  }, [navigation]);

  const loadSurahs = async () => {
  try {
    setLoading(true);
    
    // Load dark mode setting - ADD THIS
    const state = await StorageService.getState();
    if (state?.settings) {
      setSettings({ darkMode: state.settings.darkMode || false });
    }
    
    const surahList = await QuranService.getAllSurahs();
    setSurahs(surahList);
  } catch (error) {
    console.error('Error loading surahs:', error);
    Alert.alert(
      'Connection Error',
      error.message || 'Unable to load Surahs. Please check your internet connection and try again.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Retry', onPress: () => loadSurahs() }
      ]
    );
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
      
      setMemorizedStats(stats);
    } catch (error) {
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
      <AnimatedCard
  style={[
    styles.surahCard,
    isCompleted && styles.completedSurah,
    settings.darkMode && { backgroundColor: themedColors.cardBackground }
  ]}
  onPress={() => navigation.navigate('QuranReader', { surahId: item.id })}
  variant={isCompleted ? "elevated" : "default"}
  accessible={true}
  accessibilityLabel={`${item.name}, ${item.arabic_name}`}
  accessibilityHint={`Open surah ${item.name} for memorization. ${isCompleted ? 'Completed' : hasProgress ? `${progress.memorized} of ${progress.total} ayahs memorized` : 'Not started yet'}`}
  accessibilityRole="button"
>
        <View style={styles.surahHeader}>
          <View style={styles.surahNumberContainer}>
            <Text style={styles.surahNumber}>{item.id}</Text>
          </View>
          
          <View style={styles.surahInfo}>
            <Text style={styles.surahName}>{item.name}</Text>
            <Text style={styles.surahArabicName}>{item.arabic_name}</Text>
            <View style={styles.surahMeta}>
              <View style={styles.metaItem}>
                <Icon 
                  name="location" 
                  type="Ionicons" 
                  size={12} 
                  color={Theme.colors.textMuted} 
                />
                <Text style={styles.surahType}>{item.type}</Text>
              </View>
              <View style={styles.metaItem}>
                <Icon 
                  name={AppIcons.book.name} 
                  type={AppIcons.book.type} 
                  size={12} 
                  color={Theme.colors.textMuted} 
                />
                <Text style={styles.ayahCount}>{item.total_ayahs} ayahs</Text>
              </View>
            </View>
          </View>

          {isCompleted && (
            <View style={styles.completedBadge}>
              <Icon 
                name={AppIcons.checkmark.name} 
                type={AppIcons.checkmark.type} 
                size={16} 
                color={Theme.colors.textOnPrimary} 
              />
            </View>
          )}
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
                    backgroundColor: isCompleted ? Theme.colors.success : Theme.colors.secondary
                  }
                ]}
              />
            </View>
          </View>
        )}
      </AnimatedCard>
    );
  };

  if (loading) {
  return (
    <SafeAreaProvider>
      <LinearGradient colors={Theme.gradients.primary} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
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
              <Text style={styles.title}>Quran Surahs</Text>
              <Text style={styles.subtitle}>Choose a surah to memorize</Text>
            </View>
          </View>
          <SurahListSkeleton />
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

  const themedColors = getThemedColors(settings.darkMode);

return (
  <SafeAreaProvider>
    <LinearGradient 
      colors={settings.darkMode ? themedColors.gradients.primary : Theme.gradients.primary} 
      style={styles.container}
    >
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
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
              <Text style={styles.title}>Quran Surahs</Text>
              <Text style={styles.subtitle}>Choose a surah to memorize</Text>
            </View>
          </View>

          <FlatList
  data={surahs}
  keyExtractor={(item) => item.id.toString()}
  renderItem={SurahItem}
  contentContainerStyle={styles.listContent}
  showsVerticalScrollIndicator={false}
  ItemSeparatorComponent={() => <View style={{ height: Theme.spacing.sm }} />}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={10}
  windowSize={10}
  getItemLayout={(data, index) => ({
    length: 120, // Estimated height of each surah card
    offset: 128 * index, // 120 + 8 for separator
    index,
  })}
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
  header: {
    paddingHorizontal: Theme.spacing.xl,
    paddingTop: Theme.spacing.xl,
    paddingBottom: Theme.spacing['3xl'],
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  backText: {
    color: Theme.colors.textOnDark,
    fontSize: Theme.typography.fontSize.base,
    marginLeft: Theme.spacing.sm,
    fontWeight: Theme.typography.fontWeight.medium,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: Theme.typography.fontSize['4xl'],
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.textOnDark,
    textAlign: 'center',
    marginBottom: Theme.spacing.sm,
  },
  subtitle: {
    fontSize: Theme.typography.fontSize.base,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: Theme.spacing.xl,
    paddingBottom: Theme.spacing['6xl'],
  },
  surahCard: {
    padding: Theme.spacing.xl,
  },
  completedSurah: {
    backgroundColor: Theme.colors.successLight,
    borderWidth: 2,
    borderColor: Theme.colors.success,
  },
  surahHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.lg,
    position: 'relative',
  },
  surahNumberContainer: {
    backgroundColor: Theme.colors.secondary,
    borderRadius: Theme.borderRadius.full,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Theme.spacing.lg,
    ...Theme.shadows.sm,
  },
  surahNumber: {
    fontSize: Theme.typography.fontSize.lg,
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.textOnPrimary,
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: Theme.typography.fontSize.xl,
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.textPrimary,
    marginBottom: Theme.spacing.xs,
  },
  surahArabicName: {
    fontFamily: Theme.typography.fontFamily.arabic,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.textSecondary,
    marginBottom: Theme.spacing.sm,
  },
  surahMeta: {
    flexDirection: 'row',
    gap: Theme.spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surahType: {
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.textMuted,
    fontWeight: Theme.typography.fontWeight.medium,
    marginLeft: Theme.spacing.xs,
    textTransform: 'capitalize',
  },
  ayahCount: {
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.textMuted,
    fontWeight: Theme.typography.fontWeight.medium,
    marginLeft: Theme.spacing.xs,
  },
  completedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Theme.colors.success,
    borderRadius: Theme.borderRadius.full,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.sm,
  },
  progressSection: {
    marginTop: Theme.spacing.sm,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  progressText: {
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.textSecondary,
    fontWeight: Theme.typography.fontWeight.medium,
  },
  progressPercentage: {
    fontSize: Theme.typography.fontSize.sm,
    fontWeight: Theme.typography.fontWeight.bold,
    color: Theme.colors.secondary,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: Theme.colors.gray200,
    borderRadius: Theme.borderRadius.sm,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: Theme.borderRadius.sm,
  },
});
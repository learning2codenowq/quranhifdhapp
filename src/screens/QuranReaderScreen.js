import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Modal,
  ScrollView,
  TextInput,
  Animated,
  Platform,
  Vibration
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QuranService } from '../services/QuranService';
import { QuranUtils } from '../utils/QuranUtils';
import { StorageService } from '../services/StorageService';
import { AudioService } from '../services/AudioService';
import { cleanArabicText } from '../utils/TextCleaner';
import { Logger } from '../utils/Logger'
import { NetworkUtils } from '../utils/NetworkUtils';
import ModernLoadingScreen from '../components/ModernLoadingScreen';
import SurahCompletionModal from '../components/SurahCompletionModal';
import { parseTajweedText, hasTajweedMarkup } from '../utils/TajweedParser';
import { Theme } from '../styles/theme'; 
import { getThemedColors } from '../styles/theme';
import { Icon, AppIcons } from '../components/Icon';


export default function QuranReaderScreen({ route, navigation }) {
  const surahId = route?.params?.surahId || 1;
  
  const [surahData, setSurahData] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTajweedHelp, setShowTajweedHelp] = useState(false);
  const [memorizedAyahs, setMemorizedAyahs] = useState([]);
  const [audioStatus, setAudioStatus] = useState({ isPlaying: false, hasSound: false });
  const [playingAyah, setPlayingAyah] = useState(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [ayahAudioUrls, setAyahAudioUrls] = useState({});
  const [ayahCounters, setAyahCounters] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedSurahInfo, setCompletedSurahInfo] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState('');



  // Settings state
  const [settings, setSettings] = useState({
  showTranslations: true,
  arabicFontSize: 'Medium',
  translationFontSize: 'Medium',
  autoPlayNext: true,
  darkMode: false, 
  scriptType: 'uthmani',  
});

  const themedColors = getThemedColors(settings.darkMode);

  const [selectedReciterId, setSelectedReciterId] = useState(null);
  
  // Replay segment states
  const [showReplayModal, setShowReplayModal] = useState(false);
  const [replaySegment, setReplaySegment] = useState({
    startAyah: '',
    endAyah: '',
    repetitions: '3'
  });
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayProgress, setReplayProgress] = useState({
    current: 0,
    total: 0,
    currentAyah: 0,
    totalAyahs: 0
  });

  // Ref for immediate stop checking
  const isReplayingRef = React.useRef(false);
  const flatListRef = React.useRef(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const counterLongPressTimer = useRef(null);

  console.log('🎯 QuranReaderScreen mounted');
  console.log('🔢 surahId from params:', surahId);
  console.log('📦 route.params:', route?.params);

// Main component effect - handles surah loading
useEffect(() => {
  console.log('🔥 Component effect', { surahId, isInitialized, scriptType: settings.scriptType });
  
  if (!surahId) {
    console.log('❌ No surahId');
    return;
  }
  
  // Reset initialization when surahId OR scriptType changes
  setIsInitialized(false);
  
  const loadEverything = async () => {
    try {
      console.log('📥 Loading settings...');
      await loadSettings();
      console.log('✅ Settings loaded');
      
      // Small delay to ensure settings state is updated
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('🌐 Checking internet connection...');
      const hasInternet = await NetworkUtils.checkInternetConnection();
      if (!hasInternet) {
        setLoading(false);
        Alert.alert(
          'No Internet Connection',
          'Please check your internet connection and try again.',
          [
            { text: 'Go Back', onPress: () => navigation.goBack() },
            { text: 'Retry', onPress: () => loadEverything() }
          ]
        );
        return;
      }
      console.log('✅ Internet connected');
      
      console.log('📥 Loading surah data...');
      await loadSurahData();
      console.log('✅ Surah data loaded');
      
      loadMemorizedAyahs();
      AudioService.setupAudio();
      
      setIsInitialized(true);
      console.log('✅ Everything initialized');
    } catch (error) {
      console.error('❌ Error during initialization:', error);
      setLoading(false);
    }
  };
  
  loadEverything();
  
  return () => {
    console.log('🧹 Cleanup');
    AudioService.stopAudio();
  };
}, [surahId, selectedReciterId, settings.scriptType]);

// Separate effect for auto-scrolling to ayah
useEffect(() => {
  if (!route.params?.scrollToAyah || ayahs.length === 0 || !flatListRef.current) {
    return;
  }
  
  const scrollToAyahNumber = route.params.scrollToAyah;
  
  // Wait for FlatList to render and data to load
  const timer = setTimeout(() => {
    if (ayahs.length > 0 && flatListRef.current) {
      console.log('🎯 Auto-scrolling to ayah:', scrollToAyahNumber);
      scrollToAyah(scrollToAyahNumber);
    }
  }, 1000);
  
  return () => clearTimeout(timer);
}, [route.params?.scrollToAyah, ayahs.length]);

  const loadSettings = async () => {
  try {
    const state = await StorageService.getState();
    if (state?.settings) {
      const newSettings = {
        showTranslations: state.settings.showTranslations !== false,
        arabicFontSize: state.settings.arabicFontSize || 'Medium',
        translationFontSize: state.settings.translationFontSize || 'Medium',
        autoPlayNext: state.settings.autoPlayNext !== false,
        darkMode: state.settings.darkMode || false,
        scriptType: state.settings.scriptType || 'uthmani',
      };
      Logger.log('🎵 Loaded settings:', newSettings);
      setSettings(newSettings);
      setSelectedReciterId(state.settings.selectedReciter || null);
    }
    setSettingsLoaded(true); // ADD THIS LINE
  } catch (error) {
    Logger.error('Error loading settings:', error);
    setSettingsLoaded(true); // ADD THIS LINE
  }
};
const TajweedHelpModal = () => (
  <Modal 
    visible={showTajweedHelp} 
    transparent={true} 
    animationType="fade"
    onRequestClose={() => setShowTajweedHelp(false)}
  >
    <View style={styles.tajweedModalOverlay}>
      <View style={[
        styles.tajweedHelpModal,
        settings.darkMode && { backgroundColor: themedColors.cardBackground }
      ]}>
        <View style={styles.tajweedModalHeader}>
          <Text style={[
            styles.tajweedModalTitle,
            settings.darkMode && { color: themedColors.textPrimary }
          ]}>Tajweed Guide</Text>
          <TouchableOpacity onPress={() => setShowTajweedHelp(false)}>
            <Icon name="close" type="Ionicons" size={24} color={settings.darkMode ? themedColors.textMuted : Theme.colors.textMuted} />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          style={styles.tajweedContent}
          contentContainerStyle={styles.tajweedContentContainer}
          showsVerticalScrollIndicator={true}
        >
          <Text style={[
            styles.tajweedDescription,
            settings.darkMode && { color: themedColors.textSecondary }
          ]}>
            Tajweed rules help you pronounce the Quran correctly. Each color represents a specific pronunciation rule.
          </Text>
          
          {/* Ghunnah - GREEN */}
          <View style={styles.tajweedRule}>
            <View style={[styles.colorBox, { backgroundColor: '#169777' }]} />
            <View style={styles.ruleTextContainer}>
              <Text style={[
                styles.ruleText,
                settings.darkMode && { color: themedColors.textPrimary }
              ]}>Ghunnah (غُنَّة)</Text>
              <Text style={[styles.ruleDescription, settings.darkMode && { color: themedColors.textMuted }]}>
                Nasal sound held for 2 counts
              </Text>
            </View>
          </View>
          
          {/* Ikhfa - GREEN */}
          <View style={styles.tajweedRule}>
            <View style={[styles.colorBox, { backgroundColor: '#169777' }]} />
            <View style={styles.ruleTextContainer}>
              <Text style={[
                styles.ruleText,
                settings.darkMode && { color: themedColors.textPrimary }
              ]}>Ikhfa (إخْفَاء)</Text>
              <Text style={[styles.ruleDescription, settings.darkMode && { color: themedColors.textMuted }]}>
                Hiding the sound with nasal pronunciation
              </Text>
            </View>
          </View>
          
          {/* Idgham without Ghunnah - DARK GREEN */}
          <View style={styles.tajweedRule}>
            <View style={[styles.colorBox, { backgroundColor: '#095d42' }]} />
            <View style={styles.ruleTextContainer}>
              <Text style={[
                styles.ruleText,
                settings.darkMode && { color: themedColors.textPrimary }
              ]}>Idgham without Ghunnah</Text>
              <Text style={[styles.ruleDescription, settings.darkMode && { color: themedColors.textMuted }]}>
                Merging letters without nasal sound
              </Text>
            </View>
          </View>
          
          {/* Qalqalah - RED */}
          <View style={styles.tajweedRule}>
            <View style={[styles.colorBox, { backgroundColor: '#DD0008' }]} />
            <View style={styles.ruleTextContainer}>
              <Text style={[
                styles.ruleText,
                settings.darkMode && { color: themedColors.textPrimary }
              ]}>Qalqalah (قَلْقَلَة)</Text>
              <Text style={[styles.ruleDescription, settings.darkMode && { color: themedColors.textMuted }]}>
                Echoing/bouncing sound (letters: ق ط ب ج د)
              </Text>
            </View>
          </View>
          
          {/* Madd - PURPLE */}
          <View style={styles.tajweedRule}>
            <View style={[styles.colorBox, { backgroundColor: '#7B1FA2' }]} />
            <View style={styles.ruleTextContainer}>
              <Text style={[
                styles.ruleText,
                settings.darkMode && { color: themedColors.textPrimary }
              ]}>Madd (مَدّ)</Text>
              <Text style={[styles.ruleDescription, settings.darkMode && { color: themedColors.textMuted }]}>
                Prolongation for 4-6 counts
              </Text>
            </View>
          </View>
          
          {/* Silent Letters - GREY */}
          <View style={styles.tajweedRule}>
            <View style={[styles.colorBox, { backgroundColor: '#AAAAAA' }]} />
            <View style={styles.ruleTextContainer}>
              <Text style={[
                styles.ruleText,
                settings.darkMode && { color: themedColors.textPrimary }
              ]}>Silent Letters</Text>
              <Text style={[styles.ruleDescription, settings.darkMode && { color: themedColors.textMuted }]}>
                Hamzat al-Wasl, Lam Shamsiyyah - not pronounced
              </Text>
            </View>
          </View>

          {/* Additional Info */}
          <View style={styles.tajweedNote}>
            <Text style={[
              styles.tajweedNoteText,
              settings.darkMode && { color: themedColors.textSecondary }
            ]}>
              💡 Tip: Study each rule with a qualified teacher for proper pronunciation.
            </Text>
          </View>
        </ScrollView>
        
        <TouchableOpacity 
          style={styles.tajweedCloseButton}
          onPress={() => setShowTajweedHelp(false)}
        >
          <Text style={styles.tajweedCloseText}>Got it!</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);
  const getDefaultReciterId = async () => {
    try {
      const reciters = await QuranService.getReciters();
      const alafasy = reciters.find(r => 
        r.name?.toLowerCase().includes('alafasy') || 
        r.name?.toLowerCase().includes('afasy')
      );
      return alafasy?.id || (reciters[0]?.id || 7); // Default to Alafasy or first reciter
    } catch (error) {
      console.error('Error getting default reciter:', error);
      return 7; // Fallback to Alafasy's typical ID
    }
  };

  const loadSurahData = async () => {
  let retryCount = 0;
  const maxRetries = 3;
  
  const attemptLoad = async () => {
    try {if (retryCount > 0) {
      setLoadingProgress(`Retry attempt ${retryCount}/${maxRetries}`);
    }
      console.log(`🚀 Loading surah ${surahId} (Attempt ${retryCount + 1}/${maxRetries})`);
      setLoading(true);
      
      // Increased timeout to 60 seconds
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 60000)
      );
      
      const apiPromise = QuranService.getSurahWithTranslation(
        surahId, 
        selectedReciterId,
        settings.scriptType
      );
      
      console.log('🔄 Making API call with reciter:', selectedReciterId, 'and script:', settings.scriptType);
      const data = await Promise.race([apiPromise, timeoutPromise]);
      console.log('✅ API call succeeded, got data:', data);
      
      setSurahData(data.surah);
      setAyahs(data.ayahs || []);
      
      // Store audio URLs for each ayah
      const audioMap = {};
      (data.ayahs || []).forEach(ayah => {
        if (ayah.audioUrl) {
          audioMap[ayah.verse_number] = ayah.audioUrl;
        }
      });
      setAyahAudioUrls(audioMap);
      
      console.log('✅ Successfully loaded surah data');
      
    } catch (error) {
      console.error(`❌ Error in loadSurahData (Attempt ${retryCount + 1}):`, error);
      
      // Retry logic
      if (retryCount < maxRetries - 1) {
        retryCount++;
        console.log(`🔄 Retrying... (${retryCount}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
        return attemptLoad(); // Recursive retry
      }
      
      // All retries failed
      Logger.error('Error loading surah after retries:', error);
      Alert.alert(
        'Connection Error',
        `Failed to load surah after ${maxRetries} attempts. Please check your internet connection and try again.`,
        [
          { text: 'Go Back', onPress: () => navigation.goBack() },
          { text: 'Retry', onPress: () => loadSurahData() }
        ]
      );
      throw error;
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  };
  
  return attemptLoad();
};

  const loadMemorizedAyahs = async () => {
    try {
      const state = await StorageService.getState();
      if (state && state.ayahProgress) {
        const memorized = [];
        Object.keys(state.ayahProgress).forEach(surahIdKey => {
          Object.keys(state.ayahProgress[surahIdKey]).forEach(ayahNumber => {
            const ayahData = state.ayahProgress[surahIdKey][ayahNumber];
            if (ayahData.memorized) {
              memorized.push({
                surahId: parseInt(surahIdKey),
                ayahNumber: parseInt(ayahNumber)
              });
            }
          });
        });
        setMemorizedAyahs(memorized);
      }
    } catch (error) {
      Logger.error('Error loading memorized ayahs:', error);
    }
  };

  const isAyahMemorized = (currentSurahId, ayahNumber) => {
    return memorizedAyahs.some(ayah => 
      ayah.surahId === currentSurahId && ayah.ayahNumber === ayahNumber
    );
  };
  
  const checkSurahCompletion = async (surahId) => {
  try {
    const state = await StorageService.getState();
    if (!state?.ayahProgress?.[surahId]) return false;
    
    const surahProgress = state.ayahProgress[surahId];
    const totalAyahs = surahData?.total_ayahs || ayahs.length;
    
    // Count memorized ayahs
    const memorizedCount = Object.values(surahProgress).filter(
      ayah => ayah.memorized
    ).length;
    
    // Check if surah just became complete
    const isComplete = memorizedCount >= totalAyahs;
    
    if (isComplete) {
      setCompletedSurahInfo({
        id: surahId,
        name: surahData?.name || `Surah ${surahId}`,
        arabicName: surahData?.arabic_name || '',
        totalAyahs: totalAyahs
      });
      setShowCompletionModal(true);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking surah completion:', error);
    return false;
  }
};

  const toggleAyahMemorization = async (currentSurahId, ayahNumber, isCurrentlyMemorized) => {
    try {
      // Scale animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      if (isCurrentlyMemorized) {
        await QuranUtils.unmarkAyahMemorized(currentSurahId, ayahNumber);
        Alert.alert('✓ Removed', 'Ayah unmarked from memorization', [{ text: 'OK' }]);
      } else {
        await QuranUtils.markAyahMemorized(currentSurahId, ayahNumber, 2);
        await checkSurahCompletion(currentSurahId);
      }
      
      await loadMemorizedAyahs();
    } catch (error) {
      Logger.error('Error toggling memorization:', error);
      Alert.alert('Error', 'Failed to update memorization status');
    }
  };

  const handleAudioPlay = async (currentSurahId, ayahNumber) => {
    try {
      const audioUrl = ayahAudioUrls[ayahNumber];
      
      if (!audioUrl) {
        Alert.alert('Audio Error', 'Audio not available for this ayah');
        return;
      }

      console.log(`Attempting to play audio for ayah ${ayahNumber}:`, audioUrl);

      if (playingAyah && playingAyah.surahId === currentSurahId && playingAyah.ayahNumber === ayahNumber) {
        if (audioStatus.isPlaying) {
          console.log('🛑 User clicked pause - stopping audio');
          await AudioService.stopAudio();
          setPlayingAyah(null);
        } else {
          await AudioService.resumeAudio();
        }
      } else {
        setPlayingAyah({ surahId: currentSurahId, ayahNumber });
        
        // Scroll to current ayah
        scrollToAyah(ayahNumber);
        
        // Define what happens when this ayah finishes
        const onAyahComplete = () => {
          if (settings.autoPlayNext) {
            console.log('🎵 Auto-play enabled, looking for next ayah...');
            const nextAyahNumber = ayahNumber + 1;
            const nextAyahExists = ayahs.find(ayah => ayah.verse_number === nextAyahNumber);
            
            if (nextAyahExists && ayahAudioUrls[nextAyahNumber]) {
              console.log(`🎵 Playing next ayah: ${nextAyahNumber}`);
                handleAudioPlay(currentSurahId, nextAyahNumber);
            } else {
  console.log('🎵 Reached end of surah');
  setTimeout(() => setPlayingAyah(null), 100); // Quick cleanup
}
          } else {
            console.log('🎵 Auto-play disabled, stopping');
            setPlayingAyah(null);
          }
        };
        
        const success = await AudioService.playAyahFromUrl(audioUrl, onAyahComplete);
        
        if (!success) {
          Alert.alert(
            'Audio Error', 
            'Could not play audio for this ayah. Please check your internet connection and try again.',
            [
              { text: 'OK', onPress: () => setPlayingAyah(null) }
            ]
          );
        }
      }
      
      const status = AudioService.getPlaybackStatus();
      setAudioStatus(status);
    } catch (error) {
      console.error('Audio error:', error);
      setPlayingAyah(null);
      Alert.alert(
        'Audio Error', 
        'Failed to play audio. The audio file may not be available or there may be a network issue.',
        [{ text: 'OK' }]
      );
    }
  };

  const scrollToAyah = (ayahNumber) => {
  if (!flatListRef.current || ayahs.length === 0) return;

  const ayahIndex = ayahs.findIndex(ayah => ayah.verse_number === ayahNumber);
  
  if (ayahIndex !== -1) {
    console.log(`📱 Scrolling to ayah ${ayahNumber} at index ${ayahIndex}`);
    
    try {
      // Use scrollToIndex with proper error handling
      flatListRef.current.scrollToIndex({
        index: ayahIndex,
        animated: true,
        viewPosition: 0.1, // Show ayah near the top of the screen
      });
    } catch (error) {
      console.log('📱 ScrollToIndex failed, trying offset method');
      // Fallback: more accurate offset calculation
      const headerHeight = shouldShowBasmala(surahData?.id || surahId) ? 150 : 0;
      const averageAyahHeight = 200;
      const estimatedOffset = headerHeight + (ayahIndex * averageAyahHeight);
      
      flatListRef.current.scrollToOffset({
        offset: estimatedOffset,
        animated: true
      });
    }
  } else {
    console.log(`📱 Ayah ${ayahNumber} not found in list`);
  }
};

// Counter functions
  const handleCounterTap = (ayahNumber) => {
    const currentCount = ayahCounters[ayahNumber] || 0;
    setAyahCounters(prev => ({
      ...prev,
      [ayahNumber]: currentCount + 1
    }));
  };

  const handleCounterReset = (ayahNumber) => {
    setAyahCounters(prev => ({
      ...prev,
      [ayahNumber]: 0
    }));
    try {
      Vibration.vibrate(50); // Quick haptic feedback
    } catch (error) {
      console.log('Vibration not available');
    }
  };

  const openReplayModal = () => {
    const maxAyahs = ayahs.length;
    setReplaySegment({
      startAyah: '1',
      endAyah: Math.min(5, maxAyahs).toString(),
      repetitions: '3'
    });
    setShowReplayModal(true);
  };

  const startReplaySegment = async () => {
    const start = parseInt(replaySegment.startAyah);
    const end = parseInt(replaySegment.endAyah);
    const reps = parseInt(replaySegment.repetitions);

    Logger.log('🚀 Starting replay:', { start, end, reps, totalAyahs: ayahs.length });

    if (isNaN(start) || isNaN(end) || isNaN(reps) || start < 1 || end < 1 || reps < 1) {
      Alert.alert('Invalid Input', 'Please enter valid numbers greater than 0');
      return;
    }

    if (start > end) {
      Alert.alert('Invalid Range', 'Start ayah must be less than or equal to end ayah');
      return;
    }

    if (end > ayahs.length) {
      Alert.alert('Invalid Range', `End ayah cannot be greater than ${ayahs.length}`);
      return;
    }

    setShowReplayModal(false);
    setIsReplaying(true);
    isReplayingRef.current = true;
    
    setReplayProgress({
      current: 0,
      total: reps,
      currentAyah: 0,
      totalAyahs: end - start + 1
    });
    
    Logger.log('📱 State set, calling playSegmentSequence...');
    playSegmentSequence(start, end, reps);
  };

  const playSegmentSequence = async (startAyah, endAyah, repetitions) => {
  Logger.log('🎵 playSegmentSequence called with:', { startAyah, endAyah, repetitions });
  
  try {
    // First, check which ayahs have audio URLs
    const ayahsWithAudio = [];
    for (let ayahNum = startAyah; ayahNum <= endAyah; ayahNum++) {
      const audioUrl = ayahAudioUrls[ayahNum];
      if (audioUrl) {
        ayahsWithAudio.push(ayahNum);
        Logger.log(`✅ Ayah ${ayahNum} has audio`);
      } else {
        Logger.warn(`❌ Ayah ${ayahNum} missing audio URL`);
      }
    }
    
    if (ayahsWithAudio.length === 0) {
      Alert.alert('No Audio Available', 'No audio found for the selected range.');
      setIsReplaying(false);
      return;
    }
    
    Logger.log(`🎵 Will play ${ayahsWithAudio.length} ayahs: ${ayahsWithAudio.join(', ')}`);
    
    // Update progress to show actual ayahs that will play
    setReplayProgress(prev => ({ 
      ...prev, 
      totalAyahs: ayahsWithAudio.length 
    }));
    
    for (let rep = 1; rep <= repetitions; rep++) {
      if (!isReplayingRef.current) {
        Logger.log('🛑 Replay stopped by user - exiting repetition loop');
        break;
      }
      
      Logger.log(`🔄 Starting repetition ${rep}/${repetitions}`);
      
      setReplayProgress(prev => ({ 
        ...prev, 
        current: rep,
        currentAyah: 0
      }));

      // Only play ayahs that have audio
      for (let i = 0; i < ayahsWithAudio.length; i++) {
        const ayahNum = ayahsWithAudio[i];
        
        if (!isReplayingRef.current) {
          Logger.log('🛑 Replay stopped by user - exiting ayah loop');
          break;
        }
        
        Logger.log(`🎯 Processing ayah ${ayahNum} (${i + 1}/${ayahsWithAudio.length})`);
        
        setReplayProgress(prev => ({ 
          ...prev, 
          currentAyah: i + 1 
        }));

        const audioUrl = ayahAudioUrls[ayahNum];
        
        Logger.log('🛑 Stopping previous audio...');
        try {
          await AudioService.stopAudio();
        } catch (e) {
          Logger.warn('⚠️ Error stopping audio:', e);
        }

        await delayWithStopCheck(200);
        
        if (!isReplayingRef.current) {
          Logger.log('🛑 Replay stopped - not starting new audio');
          break;
        }

        setPlayingAyah({ surahId: surahData?.id || surahId, ayahNumber: ayahNum });
        
        // Auto-scroll disabled for now - will fix in future update
        // scrollToAyah(ayahNum);
        
        Logger.log(`▶️ Calling AudioService.playAyahFromUrl for ayah ${ayahNum}...`);
        const success = await AudioService.playAyahFromUrl(audioUrl);
        Logger.log(`🎵 AudioService.playAyahFromUrl returned:`, success);
        
        if (success) {
          Logger.log(`⏳ Waiting for ayah ${ayahNum} to finish...`);
          await waitForAudioCompletion();
          Logger.log(`✅ Done waiting for ayah ${ayahNum}`);
        } else {
          Logger.error(`❌ AudioService failed for ayah ${ayahNum}`);
          await delayWithStopCheck(2000);
        }
        
        if (i < ayahsWithAudio.length - 1 && isReplayingRef.current) {
          Logger.log(`💤 Brief pause between ayahs...`);
          await delayWithStopCheck(100);
        }
      }
      
      if (rep < repetitions && isReplayingRef.current) {
        Logger.log(`🔄 Brief pause between repetitions...`);
        await delayWithStopCheck(200);
      }
    }

    Logger.log('🎉 All repetitions completed successfully');
    
  } catch (error) {
    Logger.error('💥 Error in playSegmentSequence:', error);
    Alert.alert('Playback Error', 'There was an issue playing the segment. Please try again.');
  } finally {
    Logger.log('🧹 Cleaning up...');
    const wasStoppedByUser = !isReplayingRef.current;
    
    isReplayingRef.current = false;
    setIsReplaying(false);
    setPlayingAyah(null);
    setReplayProgress({ current: 0, total: 0, currentAyah: 0, totalAyahs: 0 });
    
    try {
      await AudioService.stopAudio();
    } catch (e) {
      Logger.warn('⚠️ Error stopping audio in cleanup:', e);
    }
    
    if (!wasStoppedByUser) {
      Alert.alert('✅ Replay Complete', 'Segment replay finished successfully!');
    } else {
      Logger.log('🛑 Replay was stopped by user');
    }
  }
};
  const stopReplaySegment = async () => {
    console.log('🛑 STOP BUTTON CLICKED');
    
    isReplayingRef.current = false;
    setIsReplaying(false);
    setPlayingAyah(null);
    setReplayProgress({ current: 0, total: 0, currentAyah: 0, totalAyahs: 0 });
    
    try {
      await AudioService.stopAudio();
      console.log('🛑 Audio force stopped');
    } catch (error) {
      console.warn('⚠️ Error force stopping audio:', error);
    }
    
    Alert.alert('🛑 Stopped', 'Replay has been stopped');
  };

  const delayWithStopCheck = (ms) => {
  // Reduced delays for faster replay
  const actualDelay = Math.min(ms, 200); // Max 200ms delay
  
  return new Promise((resolve) => {
    const checkInterval = 50; // Faster checking
    let elapsed = 0;
    
    const intervalId = setInterval(() => {
      elapsed += checkInterval;
      
      if (!isReplayingRef.current || elapsed >= actualDelay) {
        clearInterval(intervalId);
        resolve();
      }
    }, checkInterval);
  });
};

  const waitForAudioCompletion = () => {
  return new Promise((resolve) => {
    const checkInterval = 100;
    let noAudioCount = 0;
    let lastPlayingState = false;
    
    const intervalId = setInterval(() => {
      if (!isReplayingRef.current) {
        Logger.log('🛑 Audio wait interrupted by stop');
        clearInterval(intervalId);
        resolve();
        return;
      }
      
      const status = AudioService.getPlaybackStatus();
      
      // More intelligent completion detection
      if (!status.isPlaying) {
        noAudioCount++;
        // If audio was playing and now stopped for 1 second, it's likely finished
        if (lastPlayingState && noAudioCount >= 10) {
          Logger.log('🎵 Audio playback completed (was playing, now stopped)');
          clearInterval(intervalId);
          resolve();
        }
        // If audio never started playing and we've waited 3 seconds, skip
        else if (!lastPlayingState && noAudioCount >= 30) {
          Logger.log('🎵 Audio never started - skipping');
          clearInterval(intervalId);
          resolve();
        }
      } else {
        lastPlayingState = true;
        noAudioCount = 0;
      }
    }, checkInterval);
    
    // Much longer safety timeout - 10 minutes (for extremely long ayahs)
    setTimeout(() => {
      Logger.log('⏰ Audio safety timeout reached (10 minute limit)');
      clearInterval(intervalId);
      resolve();
    }, 600000); // 10 minutes
  });
};

  const cleanTranslation = (text) => {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/\[\d+\]/g, '')
      .replace(/\d+/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const shouldShowBasmala = (surahId) => {
    if (!surahId) return false;
    return surahId !== 1 && surahId !== 9;
  };

  const getSurahProgress = () => {
    const currentSurahId = surahData?.id || surahId;
    const memorizedCount = memorizedAyahs.filter(ayah => ayah.surahId === currentSurahId).length;
    const totalAyahs = surahData?.total_ayahs || ayahs.length;
    return { memorized: memorizedCount, total: totalAyahs };
  };

  const getFontSize = (sizeCategory) => {
  const sizes = {
    'Small': 18,
    'Medium': 22,
    'Large': 26,
    'Extra Large': 30
  };
  return sizes[sizeCategory] || 22;
};

  const getTranslationFontSize = (sizeCategory) => {
    const sizes = {
      'Small': 14,
      'Medium': 16,
      'Large': 18,
      'Extra Large': 20
    };
    return sizes[sizeCategory] || 16;
  };

  // Modern Basmala Component
  const BasmalaModern = () => {
  const currentSurahId = surahData?.id || surahId;
  
  // Safety check
  if (!currentSurahId || !shouldShowBasmala(currentSurahId)) {
    return null;
  }

  return (
    <View style={styles.modernBasmalaContainer}>
      <View style={styles.basmalaCard}>
        <Text style={styles.modernBasmalaText}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </Text>
      </View>
    </View>
  );
};

  // Modern Ayah Item Component
  const AyahItemModern = ({ item }) => {
  // Safety checks
  if (!item || !item.verse_number) {
    console.warn('Invalid ayah item:', item);
    return null;
  }
  
  const currentSurahId = surahData?.id || surahId;
  const isMemorized = isAyahMemorized(currentSurahId, item.verse_number);
  const isCurrentlyPlaying = playingAyah && 
    playingAyah.surahId === currentSurahId && 
    playingAyah.ayahNumber === item.verse_number;
  
  const currentCount = ayahCounters[item.verse_number] || 0;
  
  return (
    <View style={styles.modernAyahContainer}>
        {/* Ayah Number Badge */}
        <View style={styles.ayahNumberBadge}>
          <Text style={styles.ayahNumberText}>{item.verse_number}</Text>
        </View>

        {/* Arabic Text Card */}
<View style={[
  styles.arabicTextCard, 
  isMemorized && styles.memorizedCard,
  settings.darkMode && { backgroundColor: themedColors.cardBackground }
]}>
  <View style={styles.arabicTextWrapper}>
  <Text style={[
    styles.modernArabicText, 
    { 
      fontSize: getFontSize(settings.arabicFontSize),
      lineHeight: getFontSize(settings.arabicFontSize) * 1.8,
      color: settings.darkMode ? themedColors.textPrimary : Theme.colors.primary,
      fontFamily: settings.scriptType === 'uthmani' || settings.scriptType === 'tajweed' 
        ? 'UthmanicFont'
        : settings.scriptType === 'indopak'
        ? 'IndoPakFont'
        : 'System',
    }
  ]}>
    {settings.scriptType === 'tajweed' && hasTajweedMarkup(item.text) ? (
  parseTajweedText(item.text).map((segment, idx) => (
    <Text key={idx} style={segment.color ? { color: segment.color } : {}}>
      {segment.text}
    </Text>
  ))
) : settings.scriptType === 'uthmani' ? (
  cleanArabicText(item.text)
) : (
  item.text
)}
  </Text>
</View>
</View>
        
        {/* Translation Card */}
        {settings.showTranslations && (
  <View style={[
    styles.translationCard,
    settings.darkMode && { backgroundColor: themedColors.surface }
  ]}>
    <Text style={[
      styles.modernTranslationText,
      { 
        fontSize: getTranslationFontSize(settings.translationFontSize),
        color: settings.darkMode ? themedColors.textSecondary : Theme.colors.textSecondary,
      }
    ]}>
      {cleanTranslation(item.translation)}
    </Text>
  </View>
)}
        
        {/*Repetition Counter */}
        
        <View style={styles.counterContainer}>
  {currentCount > 0 && (
    <TouchableOpacity
      style={styles.resetButton}
      onPress={() => handleCounterReset(item.verse_number)}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel="Reset counter"
      accessibilityHint="Reset repetition count to zero"
    >
      <Icon 
        name="refresh" 
        type="Ionicons" 
        size={20} 
        color="white" 
      />
    </TouchableOpacity>
  )}
  
  <TouchableOpacity
    style={styles.counterButton}
    onPress={() => handleCounterTap(item.verse_number)}
    activeOpacity={0.7}
    accessible={true}
    accessibilityLabel={`Repetition counter: ${currentCount} times`}
    accessibilityHint="Tap to increment repetition count"
  >
    <Text style={styles.counterLabel}>Repetitions</Text>
    <Text style={styles.counterNumber}>{currentCount}</Text>
  </TouchableOpacity>
</View>
        
        {/* Modern Controls */}
        <View style={styles.modernControls}>
  <TouchableOpacity
    style={[
      styles.modernAudioButton, 
      isCurrentlyPlaying && styles.activeAudioButton,
      settings.darkMode && { backgroundColor: themedColors.primary }
    ]}
    onPress={() => handleAudioPlay(currentSurahId, item.verse_number)}
    accessible={true}
    accessibilityLabel={isCurrentlyPlaying && audioStatus.isPlaying ? "Pause ayah recitation" : "Play ayah recitation"}
    accessibilityRole="button"
  >
    <Icon 
      name={isCurrentlyPlaying && audioStatus.isPlaying ? 'pause' : 'play'} 
      type="Ionicons" 
      size={20} 
      color="white" 
    />
  </TouchableOpacity>
  
  <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
    <TouchableOpacity
      style={[
        styles.modernMemorizeButton,
        isMemorized && styles.modernMemorizedButton,
        settings.darkMode && !isMemorized && { backgroundColor: themedColors.surface }
      ]}
      onPress={() => toggleAyahMemorization(
        currentSurahId, 
        item.verse_number, 
        isMemorized
      )}
      accessible={true}
      accessibilityLabel={isMemorized ? "Mark ayah as not memorized" : "Mark ayah as memorized"}
      accessibilityRole="button"
    >
      <Icon 
        name={isMemorized ? 'checkmark-circle' : 'radio-button-off'} 
        type="Ionicons" 
        size={20} 
        color={isMemorized ? Theme.colors.success : (settings.darkMode ? themedColors.textMuted : Theme.colors.textMuted)} 
      />
      <Text style={[
        styles.modernMemorizeText,
        isMemorized && styles.modernMemorizedText,
        settings.darkMode && !isMemorized && { color: themedColors.textPrimary }
      ]}>
        {isMemorized ? 'Memorized' : 'Mark as Memorized'}
      </Text>
    </TouchableOpacity>
  </Animated.View>
</View>
      </View>
    );
  };

  if (loading || !settingsLoaded) {
  return (
    <ModernLoadingScreen 
      darkMode={settings.darkMode}
      message="Loading Surah..."
      subtitle="Preparing ayahs and audio"
      progress={loadingProgress}
    />
  );
}

  return (
    <SafeAreaProvider>
      <LinearGradient 
        colors={settings.darkMode ? themedColors.gradients.primary : Theme.gradients.primary} 
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
          
          {/* Modern Header */}
<View style={styles.modernHeader}>
  <TouchableOpacity 
    style={styles.backButtonModern}
    onPress={() => navigation.goBack()}
  >
    <Icon name="chevron-back" type="Ionicons" size={24} color="white" />
  </TouchableOpacity>
  
  <View style={styles.headerCenter}>
    <Text style={styles.surahTitleModern}>
      {surahData?.name || `Surah ${surahId}`}
    </Text>
    {surahData?.arabic_name && (
      <Text style={styles.surahArabicModern}>{surahData.arabic_name}</Text>
    )}
  </View>

  {/* ADD THIS HELP BUTTON */}
  {settings.scriptType === 'tajweed' && (
    <TouchableOpacity 
      style={styles.backButtonModern}
      onPress={() => setShowTajweedHelp(true)}
    >
      <Icon name="help-circle" type="Ionicons" size={24} color="white" />
    </TouchableOpacity>
  )}
  {!(settings.tajweedHighlighting && settings.scriptType === 'tajweed') && (
    <View style={styles.headerSpacer} />
  )}
</View>

          {/* Progress Indicator */}
          <View style={styles.progressIndicator}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${(getSurahProgress().memorized / getSurahProgress().total) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {getSurahProgress().memorized} of {getSurahProgress().total} memorized
            </Text>
          </View>
          {/* Main Content */}
          <FlatList
  ref={flatListRef}
  data={ayahs}
  keyExtractor={(item, index) => `${surahId}-${item.verse_number || index}`}
  renderItem={AyahItemModern}
  ListHeaderComponent={BasmalaModern}
  contentContainerStyle={styles.modernListContent}
  showsVerticalScrollIndicator={false}
  
  // Performance optimizations
  removeClippedSubviews={true}
  maxToRenderPerBatch={3}
  updateCellsBatchingPeriod={50}
  initialNumToRender={5}
  windowSize={8}
  
  // Smooth scrolling
  decelerationRate="normal"
  scrollEventThrottle={1}
  
  // Better memory management
  disableVirtualization={false}
  legacyImplementation={false}
  
  // Separator
  ItemSeparatorComponent={() => <View style={styles.ayahSeparator} />}
  
  // No getItemLayout or scroll methods for now
  onScrollToIndexFailed={() => {
    // Do nothing - just prevent crashes
  }}
/>
          {/* Floating Action Buttons */}
          <View style={styles.floatingActions}>
            <TouchableOpacity style={styles.fab} onPress={openReplayModal}>
              <Icon name="repeat" type="Ionicons" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Replay Modal */}
          <Modal visible={showReplayModal} transparent={true} animationType="slide">
            <View style={styles.modernModalOverlay}>
              <View style={styles.modernReplayModal}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modernModalTitle}>Replay Segment</Text>
                  <TouchableOpacity onPress={() => setShowReplayModal(false)}>
                    <Icon name="close" type="Ionicons" size={24} color={Theme.colors.textMuted} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modernInputRow}>
                  <View style={styles.modernInputGroup}>
                    <Text style={styles.modernInputLabel}>Start</Text>
                    <TextInput
                      style={styles.modernInput}
                      value={replaySegment.startAyah}
                      onChangeText={(text) => setReplaySegment(prev => ({ ...prev, startAyah: text }))}
                      keyboardType="numeric"
                      maxLength={3}
                    />
                  </View>
                  
                  <View style={styles.modernInputGroup}>
                    <Text style={styles.modernInputLabel}>End</Text>
                    <TextInput
                      style={styles.modernInput}
                      value={replaySegment.endAyah}
                      onChangeText={(text) => setReplaySegment(prev => ({ ...prev, endAyah: text }))}
                      keyboardType="numeric"
                      maxLength={3}
                    />
                  </View>
                  
                  <View style={styles.modernInputGroup}>
                    <Text style={styles.modernInputLabel}>Times</Text>
                    <TextInput
                      style={styles.modernInput}
                      value={replaySegment.repetitions}
                      onChangeText={(text) => setReplaySegment(prev => ({ ...prev, repetitions: text }))}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                </View>
                
                <TouchableOpacity style={styles.modernStartButton} onPress={startReplaySegment}>
                  <Text style={styles.modernStartButtonText}>Start Replay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
          {/* Tajweed Help Modal */}
<TajweedHelpModal />

          {/* Replay Progress Bottom Bar */}
          {isReplaying && (
            <View style={styles.modernReplayBar}>
              <View style={styles.replayInfo}>
                <Text style={styles.replayText}>
                  Playing {replayProgress.current}/{replayProgress.total} • 
                  Ayah {replayProgress.currentAyah}/{replayProgress.totalAyahs}
                </Text>
                <TouchableOpacity style={styles.modernStopButton} onPress={stopReplaySegment}>
                  <Icon name="stop" type="Ionicons" size={16} color="white" />
                </TouchableOpacity>
              </View>
              <View style={styles.modernProgressBar}>
                <View 
                  style={[
                    styles.modernProgressFill,
                    { 
                      width: `${((replayProgress.current - 1) * replayProgress.totalAyahs + replayProgress.currentAyah) / (replayProgress.total * replayProgress.totalAyahs) * 100}%`
                    }
                  ]}
                />
              </View>
            </View>
          )}
        </SafeAreaView>
        <SurahCompletionModal
          visible={showCompletionModal}
          surahInfo={completedSurahInfo}
          onClose={() => {
            setShowCompletionModal(false);
            setCompletedSurahInfo(null);
          }}
        />
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
  headerSpacer: {
  width: 44,
  height: 44,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary,
  },
  loadingText: {
    color: Theme.colors.textOnDark,
    fontSize: 18,
    marginTop: 16,
    fontWeight: '600',
  },
  loadingSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },

  // Modern Header
  modernHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 20,
  },
  backButtonModern: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  surahTitleModern: {
    fontSize: 24,
    fontWeight: '700',
    color: Theme.colors.textOnDark,
    letterSpacing: 0.5,
  },
  surahArabicModern: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    fontFamily: Theme.typography.fontFamily.arabic,
  },
  jumpToAyahFAB: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.lg,
  },

  // Progress Indicator
  progressIndicator: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Theme.colors.secondary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontWeight: '500',
  },

  // Jump to Ayah
  modernJumpContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  jumpInputRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 4,
    alignItems: 'center',
  },
  modernJumpInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginRight: 8,
  },
  jumpButton: {
    backgroundColor: Theme.colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  jumpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  // List Content
  modernListContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  // Basmala Modern
  modernBasmalaContainer: {
    marginBottom: 24,
  },
  basmalaCard: {
    backgroundColor: Theme.colors.cardBackground,
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    ...Theme.shadows.md,
    borderLeftWidth: 4,
    borderLeftColor: Theme.colors.secondary,
  },
  modernBasmalaText: {
  fontFamily: Theme.typography.fontFamily.arabic,
  fontSize: 28,
  color: Theme.colors.primary,
  textAlign: 'center',
  lineHeight: 50,     
  letterSpacing: 2,  
  },

  // Ayah Container Modern
  modernAyahContainer: {
    position: 'relative',
  },
  ayahSeparator: {
  height: 20,
  },

  // Ayah Number Badge
  ayahNumberBadge: {
    alignSelf: 'center',
    backgroundColor: Theme.colors.secondary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
    ...Theme.shadows.sm,
  },
  ayahNumberText: {
    color: Theme.colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '700',
  },

  // Arabic Text Card
  arabicTextCard: {
  backgroundColor: Theme.colors.cardBackground,
  borderRadius: 24,
  paddingVertical: 25,
  paddingHorizontal: 20,
  marginBottom: 16,
  ...Theme.shadows.lg,
  },
  memorizedCard: {
    backgroundColor: Theme.colors.successLight,
    borderLeftWidth: 6,
    borderLeftColor: Theme.colors.success,
  },
  modernArabicText: {
  fontFamily: Theme.typography.fontFamily.arabic,
  textAlign: 'right',
  color: Theme.colors.primary,
  writingDirection: 'rtl',
  includeFontPadding: false,
  textAlignVertical: 'top',
  },
  // Translation Card
  translationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 20,
    ...Theme.shadows.sm,
  },
  modernTranslationText: {
    lineHeight: 28,
    color: Theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'left',
    fontWeight: '400',
  },

  // Modern Controls
  modernControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  counterContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButton: {
    backgroundColor: '#2C3E3F', // Dark teal-gray from theme
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 140,
    alignItems: 'center',
    ...Theme.shadows.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  counterLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  counterNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  resetButton: {
    backgroundColor: '#556B6D', // Medium teal-gray from theme
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    ...Theme.shadows.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modernAudioButton: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  activeAudioButton: {
    backgroundColor: Theme.colors.success,
    transform: [{ scale: 1.05 }],
  },
  modernMemorizeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginLeft: 16,
    ...Theme.shadows.sm,
  },
  modernMemorizedButton: {
    backgroundColor: Theme.colors.successLight,
    borderWidth: 2,
    borderColor: Theme.colors.success,
  },
  modernMemorizeText: {
    fontSize: 16,
    color: Theme.colors.textMuted,
    fontWeight: '600',
    marginLeft: 12,
  },
  modernMemorizedText: {
    color: Theme.colors.success,
  },

  // Floating Actions
  floatingActions: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  fab: {
    backgroundColor: Theme.colors.secondary,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.xl,
  },

  // Modern Modal
  modernModalOverlay: {
    flex: 1,
    backgroundColor: Theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modernReplayModal: {
    backgroundColor: Theme.colors.white,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    ...Theme.shadows.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modernModalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  modernInputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  modernInputGroup: {
    flex: 1,
    alignItems: 'center',
  },
  modernInputLabel: {
    fontSize: 14,
    color: Theme.colors.textMuted,
    marginBottom: 8,
    fontWeight: '600',
  },
  modernInput: {
    borderWidth: 2,
    borderColor: Theme.colors.gray200,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    color: Theme.colors.primary,
    backgroundColor: Theme.colors.gray100,
    minWidth: 60,
  },
  modernStartButton: {
    backgroundColor: Theme.colors.secondary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  modernStartButtonText: {
    color: Theme.colors.textOnPrimary,
    fontSize: 18,
    fontWeight: '700',
  },

  // Modern Replay Bar
  modernReplayBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
  },
  replayInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  replayText: {
    color: Theme.colors.textOnDark,
    fontSize: 14,
    fontWeight: '600',
  },
  modernStopButton: {
    backgroundColor: Theme.colors.error,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  modernProgressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  modernProgressFill: {
    height: '100%',
    backgroundColor: Theme.colors.secondary,
    borderRadius: 3,
  },
  arabicTextWrapper: {
  width: '100%',
  alignItems: 'flex-end',
  },
  tajweedNote: {
  fontSize: 10,
  color: Theme.colors.secondary,
  fontStyle: 'italic',
  marginTop: 8,
  textAlign: 'center',
},
tajweedModalOverlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.75)',
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
},
tajweedHelpModal: {
  backgroundColor: 'white',
  borderRadius: 24,
  width: '100%',
  maxWidth: 400,
  maxHeight: '75%',
  ...Theme.shadows.xl,
},
tajweedModalHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 24,
  paddingVertical: 20,
  borderBottomWidth: 1,
  borderBottomColor: Theme.colors.gray200,
},
tajweedModalTitle: {
  fontSize: 22,
  fontWeight: '700',
  color: Theme.colors.primary,
},
tajweedContent: {
  maxHeight: 400,
  paddingHorizontal: 24,
},
tajweedContentContainer: {
  paddingVertical: 20,
  paddingBottom: 10,
},
tajweedDescription: {
  fontSize: 14,
  color: Theme.colors.textSecondary,
  marginBottom: 20,
  lineHeight: 22,
},
tajweedRule: {
  flexDirection: 'row',
  alignItems: 'flex-start',
  marginBottom: 18,
},
colorBox: {
  width: 40,
  height: 40,
  borderRadius: 8,
  marginRight: 16,
  flexShrink: 0,
},
ruleTextContainer: {
  flex: 1,
},
ruleText: {
  fontSize: 16,
  color: Theme.colors.primary,
  fontWeight: '600',
  marginBottom: 4,
},
ruleDescription: {
  fontSize: 13,
  color: Theme.colors.textMuted,
  lineHeight: 18,
},
tajweedNote: {
  backgroundColor: Theme.colors.gray100,
  borderRadius: 12,
  padding: 16,
  marginTop: 8,
  marginBottom: 10,
  borderLeftWidth: 4,
  borderLeftColor: Theme.colors.secondary,
},
tajweedNoteText: {
  fontSize: 13,
  color: Theme.colors.textSecondary,
  lineHeight: 20,
  fontStyle: 'italic',
},
tajweedCloseButton: {
  backgroundColor: Theme.colors.secondary,
  marginHorizontal: 24,
  marginVertical: 20,
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: 'center',
},
tajweedCloseText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},
});
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
  TextInput,
  Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QuranService } from '../services/QuranService';
import { QuranUtils } from '../utils/QuranUtils';
import { StorageService } from '../services/StorageService';
import { AudioService } from '../services/AudioService';
import { cleanArabicText } from '../utils/TextCleaner';
import { Logger } from '../utils/Logger';
import { Theme } from '../styles/theme';
import { Icon, AppIcons } from '../components/Icon';

export default function QuranReaderScreen({ route, navigation }) {
  const surahId = route?.params?.surahId || 1;
  
  const [surahData, setSurahData] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memorizedAyahs, setMemorizedAyahs] = useState([]);
  const [audioStatus, setAudioStatus] = useState({ isPlaying: false, hasSound: false });
  const [playingAyah, setPlayingAyah] = useState(null);
  const [ayahAudioUrls, setAyahAudioUrls] = useState({});

  // Settings state
  const [settings, setSettings] = useState({
    showTranslations: true,
    arabicFontSize: 'Medium',
    translationFontSize: 'Medium',
    autoPlayNext: true 
  });
  
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

  console.log('🎯 QuranReaderScreen mounted');
  console.log('🔢 surahId from params:', surahId);
  console.log('📦 route.params:', route?.params);

  // Cleanup on component unmount
  useEffect(() => {
    console.log('🔥 useEffect triggered with surahId:', surahId);
    
    if (surahId) {
      console.log('✅ surahId exists, calling functions...');
      loadSettings();
      console.log('📞 About to call loadSurahData...');
      loadSurahData();
      loadMemorizedAyahs();
      AudioService.setupAudio();
    } else {
      console.log('❌ No surahId found!');
    }
    
    return () => {
      AudioService.stopAudio();
    };
  }, [surahId]);

  const loadSettings = async () => {
    try {
      const state = await StorageService.getState();
      if (state?.settings) {
        const newSettings = {
          showTranslations: state.settings.showTranslations !== false,
          arabicFontSize: state.settings.arabicFontSize || 'Medium',
          translationFontSize: state.settings.translationFontSize || 'Medium',
          autoPlayNext: state.settings.autoPlayNext !== false
        };
        Logger.log('🎵 Loaded settings:', newSettings);
        setSettings(newSettings);
      }
    } catch (error) {
      Logger.error('Error loading settings:', error);
    }
  };

  const loadSurahData = async () => {
    try {
      console.log('🚀 Starting loadSurahData for surah:', surahId);
      setLoading(true);
      
      // Force timeout after 15 seconds
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 15000)
      );
      
      const apiPromise = QuranService.getSurahWithTranslation(surahId);
      
      console.log('🔄 Making API call...');
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
      console.error('❌ Error in loadSurahData:', error);
      Logger.error('Error loading surah:', error);
      Alert.alert('Error', 'Failed to load surah data. Please check your internet connection.', [
        { text: 'Go Back', onPress: () => navigation.goBack() },
        { text: 'Retry', onPress: () => loadSurahData() }
      ]);
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
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
              setTimeout(() => {
                handleAudioPlay(currentSurahId, nextAyahNumber);
              }, 500);
            } else {
              console.log('🎵 Reached end of surah');
              setPlayingAyah(null);
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
    
    // Scroll to exact index instead of offset
    flatListRef.current.scrollToIndex({
      index: ayahIndex,
      animated: true,
      viewPosition: 0.2
    });
  } else {
    console.log(`📱 Ayah ${ayahNumber} not found in list`);
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

        for (let ayahNum = startAyah; ayahNum <= endAyah; ayahNum++) {
          if (!isReplayingRef.current) {
            Logger.log('🛑 Replay stopped by user - exiting ayah loop');
            break;
          }
          
          Logger.log(`🎯 Processing ayah ${ayahNum}`);
          
          setReplayProgress(prev => ({ 
            ...prev, 
            currentAyah: ayahNum - startAyah + 1 
          }));

          const audioUrl = ayahAudioUrls[ayahNum];
          Logger.log(`🔊 Audio URL for ayah ${ayahNum}:`, audioUrl ? 'EXISTS' : 'MISSING');
          
          if (!audioUrl) {
            Logger.warn(`❌ No audio URL for ayah ${ayahNum} - skipping`);
            await delayWithStopCheck(2000);
            continue;
          }

          Logger.log('🛑 Stopping previous audio...');
          try {
            await AudioService.stopAudio();
          } catch (e) {
            Logger.warn('⚠️ Error stopping audio:', e);
          }

          await delayWithStopCheck(100);
          
          if (!isReplayingRef.current) {
            Logger.log('🛑 Replay stopped - not starting new audio');
            break;
          }

          setPlayingAyah({ surahId: surahData?.id || surahId, ayahNumber: ayahNum });
          const targetAyah = ayahs.find(ayah => ayah.verse_number === ayahNum);
          if (targetAyah) {
          scrollToAyah(ayahNum);
          }
          
          Logger.log(`▶️ Calling AudioService.playAyahFromUrl for ayah ${ayahNum}...`);
          const success = await AudioService.playAyahFromUrl(audioUrl);
          Logger.log(`🎵 AudioService.playAyahFromUrl returned:`, success);
          
          if (success) {
            Logger.log(`⏳ Waiting for ayah ${ayahNum} to finish...`);
            await waitForAudioCompletion();
            Logger.log(`✅ Done waiting for ayah ${ayahNum}`);
          } else {
            Logger.error(`❌ AudioService failed for ayah ${ayahNum}`);
            await delayWithStopCheck(3000);
          }
          
          if (ayahNum < endAyah && isReplayingRef.current) {
            Logger.log(`💤 Brief pause between ayahs...`);
            await delayWithStopCheck(300);
          }
        }
        
        if (rep < repetitions && isReplayingRef.current) {
          Logger.log(`🔄 Brief pause between repetitions...`);
          await delayWithStopCheck(800);
        }
      }

      Logger.log('🎉 All repetitions completed');
      
    } catch (error) {
      Logger.error('💥 Error in playSegmentSequence:', error);
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
        Alert.alert('✅ Replay Complete', 'Segment replay finished!');
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
    return new Promise((resolve) => {
      const checkInterval = 100;
      let elapsed = 0;
      
      const intervalId = setInterval(() => {
        elapsed += checkInterval;
        
        if (!isReplayingRef.current || elapsed >= ms) {
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
      
      const intervalId = setInterval(() => {
        if (!isReplayingRef.current) {
          Logger.log('🛑 Audio wait interrupted by stop');
          clearInterval(intervalId);
          resolve();
          return;
        }
        
        const status = AudioService.getPlaybackStatus();
        
        if (!status.isPlaying) {
          noAudioCount++;
          if (noAudioCount >= 5) {
            Logger.log('🎵 Audio playback completed');
            clearInterval(intervalId);
            resolve();
          }
        } else {
          noAudioCount = 0;
        }
      }, checkInterval);
      
      setTimeout(() => {
        Logger.log('⏰ Audio timeout reached (30s safety limit)');
        clearInterval(intervalId);
        resolve();
      }, 30000);
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
      'Small': 20,
      'Medium': 24,
      'Large': 28,
      'Extra Large': 32
    };
    return sizes[sizeCategory] || 24;
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
    
    if (!shouldShowBasmala(currentSurahId)) {
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
    const currentSurahId = surahData?.id || surahId;
    const isMemorized = isAyahMemorized(currentSurahId, item.verse_number);
    const isCurrentlyPlaying = playingAyah && 
      playingAyah.surahId === currentSurahId && 
      playingAyah.ayahNumber === item.verse_number;
    
    return (
      <View style={styles.modernAyahContainer}>
        {/* Ayah Number Badge */}
        <View style={styles.ayahNumberBadge}>
          <Text style={styles.ayahNumberText}>{item.verse_number}</Text>
        </View>

        {/* Arabic Text Card */}
        <View style={[styles.arabicTextCard, isMemorized && styles.memorizedCard]}>
          <Text style={[
            styles.modernArabicText, 
            { fontSize: getFontSize(settings.arabicFontSize) }
          ]}>
            {cleanArabicText(item.text)}
          </Text>
        </View>
        
        {/* Translation Card */}
        {settings.showTranslations && (
          <View style={styles.translationCard}>
            <Text style={[
              styles.modernTranslationText,
              { fontSize: getTranslationFontSize(settings.translationFontSize) }
            ]}>
              {cleanTranslation(item.translation)}
            </Text>
          </View>
        )}
        
        {/* Modern Controls */}
        <View style={styles.modernControls}>
          <TouchableOpacity
            style={[styles.modernAudioButton, isCurrentlyPlaying && styles.activeAudioButton]}
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
                isMemorized && styles.modernMemorizedButton
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
                color={isMemorized ? Theme.colors.success : Theme.colors.textMuted} 
              />
              <Text style={[
                styles.modernMemorizeText,
                isMemorized && styles.modernMemorizedText
              ]}>
                {isMemorized ? 'Memorized' : 'Mark as Memorized'}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Theme.colors.secondary} />
          <Text style={styles.loadingText}>Loading Surah...</Text>
          <Text style={styles.loadingSubtext}>Preparing ayahs and audio</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <LinearGradient colors={Theme.gradients.primary} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          
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

  <View style={styles.headerSpacer} />
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
            removeClippedSubviews={false}
            maxToRenderPerBatch={5}
            updateCellsBatchingPeriod={100}
            initialNumToRender={8}
            windowSize={10}
            scrollEventThrottle={16}
            ItemSeparatorComponent={() => <View style={styles.ayahSeparator} />}
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
  paddingVertical: 40,   
  paddingHorizontal: 28,      
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
  lineHeight: 60,              // Increased from 50
  textAlign: 'right',
  color: Theme.colors.primary,
  letterSpacing: 1,            // Increased from 0.5
  writingDirection: 'rtl',     // Add this
  textAlignVertical: 'center', // Add this
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
});
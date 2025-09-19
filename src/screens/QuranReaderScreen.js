import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QuranService } from '../services/QuranService';
import { QuranUtils } from '../utils/QuranUtils';
import { StorageService } from '../services/StorageService';
import { AudioService } from '../services/AudioService';

export default function QuranReaderScreen({ route, navigation }) {
  const surahId = route?.params?.surahId || 1;
  
  const [surahData, setSurahData] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [memorizedAyahs, setMemorizedAyahs] = useState([]);
  const [audioStatus, setAudioStatus] = useState({ isPlaying: false, hasSound: false });
  const [playingAyah, setPlayingAyah] = useState(null);
  const [ayahAudioUrls, setAyahAudioUrls] = useState({});
  
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

  useEffect(() => {
    if (surahId) {
      loadSurahData();
      loadMemorizedAyahs();
      AudioService.setupAudio();
    }
    
    return () => {
      AudioService.stopAudio();
    };
  }, [surahId]);

  const loadSurahData = async () => {
    try {
      setLoading(true);
      const data = await QuranService.getSurahWithTranslation(surahId);
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
      
    } catch (error) {
      console.error('Error loading surah:', error);
      Alert.alert('Error', 'Failed to load surah data. Please check your internet connection.', [
        { text: 'Go Back', onPress: () => navigation.goBack() },
        { text: 'Retry', onPress: () => loadSurahData() }
      ]);
    } finally {
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
      console.error('Error loading memorized ayahs:', error);
    }
  };

  const isAyahMemorized = (currentSurahId, ayahNumber) => {
    return memorizedAyahs.some(ayah => 
      ayah.surahId === currentSurahId && ayah.ayahNumber === ayahNumber
    );
  };

  const toggleAyahMemorization = async (currentSurahId, ayahNumber, isCurrentlyMemorized) => {
    try {
      if (isCurrentlyMemorized) {
        await QuranUtils.unmarkAyahMemorized(currentSurahId, ayahNumber);
      } else {
        await QuranUtils.markAyahMemorized(currentSurahId, ayahNumber, 2);
      }
      
      await loadMemorizedAyahs();
    } catch (error) {
      console.error('Error toggling memorization:', error);
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

      if (playingAyah && playingAyah.surahId === currentSurahId && playingAyah.ayahNumber === ayahNumber) {
        if (audioStatus.isPlaying) {
          await AudioService.pauseAudio();
          setPlayingAyah(null);
        } else {
          await AudioService.resumeAudio();
        }
      } else {
        setPlayingAyah({ surahId: currentSurahId, ayahNumber });
        const success = await AudioService.playAyahFromUrl(audioUrl);
        
        if (!success) {
          Alert.alert('Audio Error', 'Could not play audio for this ayah');
          setPlayingAyah(null);
        }
      }
      
      const status = AudioService.getPlaybackStatus();
      setAudioStatus(status);
    } catch (error) {
      console.error('Audio error:', error);
      Alert.alert('Audio Error', 'Failed to play audio');
    }
  };

  const openReplayModal = () => {
    setReplaySegment({
      startAyah: '1',
      endAyah: Math.min(5, ayahs.length).toString(),
      repetitions: '3'
    });
    setShowReplayModal(true);
  };

  const startReplaySegment = async () => {
    const start = parseInt(replaySegment.startAyah);
    const end = parseInt(replaySegment.endAyah);
    const reps = parseInt(replaySegment.repetitions);

    if (!start || !end || !reps || start > end || start < 1 || end > ayahs.length) {
      Alert.alert('Invalid Range', 'Please enter a valid ayah range');
      return;
    }

    setShowReplayModal(false);
    setIsReplaying(true);
    setReplayProgress({
      current: 0,
      total: reps,
      currentAyah: 0,
      totalAyahs: end - start + 1
    });

    await playSegmentSequence(start, end, reps);
  };

  const playSegmentSequence = async (startAyah, endAyah, repetitions) => {
    try {
      for (let rep = 1; rep <= repetitions; rep++) {
        if (!isReplaying) break; // Check if user stopped

        setReplayProgress(prev => ({ ...prev, current: rep }));

        for (let ayahNum = startAyah; ayahNum <= endAyah; ayahNum++) {
          if (!isReplaying) break; // Check if user stopped

          setReplayProgress(prev => ({ ...prev, currentAyah: ayahNum - startAyah + 1 }));

          const audioUrl = ayahAudioUrls[ayahNum];
          if (audioUrl) {
            setPlayingAyah({ surahId: surahData?.id || surahId, ayahNumber: ayahNum });
            
            await AudioService.stopAudio();
            const success = await AudioService.playAyahFromUrl(audioUrl);
            
            if (success) {
              // Wait for audio to finish playing
              await new Promise((resolve) => {
                const checkStatus = setInterval(() => {
                  const status = AudioService.getPlaybackStatus();
                  if (!status.isPlaying && !status.hasSound) {
                    clearInterval(checkStatus);
                    resolve();
                  }
                }, 100);
              });
              
              // Small pause between ayahs
              await new Promise(resolve => setTimeout(resolve, 500));
            }
          }
        }
      }

      // Replay completed
      setIsReplaying(false);
      setPlayingAyah(null);
      setReplayProgress({ current: 0, total: 0, currentAyah: 0, totalAyahs: 0 });
    } catch (error) {
      console.error('Replay error:', error);
      stopReplaySegment();
    }
  };

  const stopReplaySegment = async () => {
    setIsReplaying(false);
    setPlayingAyah(null);
    setReplayProgress({ current: 0, total: 0, currentAyah: 0, totalAyahs: 0 });
    await AudioService.stopAudio();
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

  const BasmalaComponent = () => {
    const currentSurahId = surahData?.id || surahId;
    
    if (!shouldShowBasmala(currentSurahId)) {
      return null;
    }

    return (
      <View style={styles.basmalaContainer}>
        <Text style={styles.basmalaText}>
          بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
        </Text>
      </View>
    );
  };

  const AyahItem = ({ item }) => {
    const currentSurahId = surahData?.id || surahId;
    const isMemorized = isAyahMemorized(currentSurahId, item.verse_number);
    const isCurrentlyPlaying = playingAyah && 
      playingAyah.surahId === currentSurahId && 
      playingAyah.ayahNumber === item.verse_number;
    
    return (
      <View style={[styles.ayahContainer, isMemorized && styles.memorizedAyahContainer]}>
        <View style={styles.ayahContent}>
          <Text style={styles.ayahNumber}>{item.verse_number}</Text>
          
          <Text style={styles.arabicText}>{item.text}</Text>
          
          <Text style={styles.translationText}>
            {cleanTranslation(item.translation)}
          </Text>
          
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={[styles.audioButton, isCurrentlyPlaying && styles.activeAudioButton]}
              onPress={() => handleAudioPlay(currentSurahId, item.verse_number)}
            >
              <Text style={styles.audioIcon}>
                {isCurrentlyPlaying && audioStatus.isPlaying ? '⏸' : '▶'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.memorizeButton,
                isMemorized && styles.memorizedButton
              ]}
              onPress={() => toggleAyahMemorization(
                currentSurahId, 
                item.verse_number, 
                isMemorized
              )}
            >
              <Text style={[
                styles.memorizeButtonText,
                isMemorized && styles.memorizedButtonText
              ]}>
                {isMemorized ? 'Memorized ✓' : 'Mark as Memorized'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#d4af37" />
          <Text style={styles.loadingText}>Loading Surah...</Text>
        </SafeAreaView>
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
              <Text style={styles.backText}>← Back to Surahs</Text>
            </TouchableOpacity>
            
            <Text style={styles.surahTitle}>
              {surahData?.name || `Surah ${surahId}`}
            </Text>
            {surahData?.arabic_name && (
              <Text style={styles.surahArabicName}>{surahData.arabic_name}</Text>
            )}
            
            <View style={styles.headerControls}>
              <View style={styles.progressStats}>
                <Text style={styles.progressStatsText}>
                  {getSurahProgress().memorized}/{getSurahProgress().total} memorized
                </Text>
              </View>
              
              <TouchableOpacity style={styles.replayButton} onPress={openReplayModal}>
                <Text style={styles.replayButtonText}>🔄 Replay Segment</Text>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={ayahs}
            keyExtractor={(item, index) => `${surahId}-${item.verse_number || index}`}
            renderItem={AyahItem}
            ListHeaderComponent={BasmalaComponent}
            contentContainerStyle={[
              styles.listContent,
              { paddingBottom: isReplaying ? 100 : 30 } // Extra padding when replay is active
            ]}
            showsVerticalScrollIndicator={false}
          />

          {/* Replay Segment Modal */}
          <Modal
            visible={showReplayModal}
            transparent={true}
            animationType="slide"
          >
            <View style={styles.modalOverlay}>
              <View style={styles.replayModal}>
                <Text style={styles.modalTitle}>Replay Segment</Text>
                
                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Start Ayah</Text>
                    <TextInput
                      style={styles.input}
                      value={replaySegment.startAyah}
                      onChangeText={(text) => setReplaySegment(prev => ({ ...prev, startAyah: text }))}
                      keyboardType="numeric"
                      maxLength={3}
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>End Ayah</Text>
                    <TextInput
                      style={styles.input}
                      value={replaySegment.endAyah}
                      onChangeText={(text) => setReplaySegment(prev => ({ ...prev, endAyah: text }))}
                      keyboardType="numeric"
                      maxLength={3}
                    />
                  </View>
                  
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Repeat</Text>
                    <TextInput
                      style={styles.input}
                      value={replaySegment.repetitions}
                      onChangeText={(text) => setReplaySegment(prev => ({ ...prev, repetitions: text }))}
                      keyboardType="numeric"
                      maxLength={2}
                    />
                  </View>
                </View>
                
                <View style={styles.modalButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => setShowReplayModal(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.startButton}
                    onPress={startReplaySegment}
                  >
                    <Text style={styles.startButtonText}>Start Replay</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Replay Progress Bottom Bar */}
          {isReplaying && (
            <View style={styles.replayProgressBar}>
              <View style={styles.replayInfo}>
                <Text style={styles.replayProgressText}>
                  Playing {replayProgress.current}/{replayProgress.total} • 
                  Ayah {replayProgress.currentAyah}/{replayProgress.totalAyahs}
                </Text>
                <TouchableOpacity 
                  style={styles.stopButton}
                  onPress={stopReplaySegment}
                >
                  <Text style={styles.stopButtonText}>■ Stop</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#004d24',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
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
  surahTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  surahArabicName: {
    fontSize: 22,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontFamily: 'Amiri_400Regular',
    marginBottom: 15,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  progressStats: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  progressStatsText: {
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
  },
  replayButton: {
    backgroundColor: '#d4af37',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  replayButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 20,
  },
  basmalaContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 25,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d4af37',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  basmalaText: {
    fontSize: 30,
    color: '#004d24',
    fontFamily: 'Amiri_400Regular',
    textAlign: 'center',
    lineHeight: 50,
  },
  ayahContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    marginBottom: 20,
    marginTop: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
  },
  memorizedAyahContainer: {
    backgroundColor: '#f0f8f0',
    borderWidth: 2,
    borderColor: '#009c4a',
  },
  ayahContent: {
    padding: 20,
    paddingTop: 25,
  },
  ayahNumber: {
    position: 'absolute',
    top: -15,
    right: 20,
    backgroundColor: '#d4af37',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    minWidth: 36,
    minHeight: 36,
    textAlign: 'center',
    textAlignVertical: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  arabicText: {
    fontSize: 32,
    lineHeight: 60,
    textAlign: 'right',
    color: '#2c3e50',
    fontFamily: 'Amiri_400Regular',
    marginBottom: 25,
    marginTop: 15,
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
  translationText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#5a6c7d',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
  },
  audioButton: {
    backgroundColor: '#058743',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 60,
    alignItems: 'center',
  },
  activeAudioButton: {
    backgroundColor: '#009c4a',
  },
  audioIcon: {
    fontSize: 18,
    color: 'white',
  },
  memorizeButton: {
    backgroundColor: '#d4af37',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 1,
    maxWidth: 200,
  },
  memorizedButton: {
    backgroundColor: '#009c4a',
  },
  memorizeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  memorizedButtonText: {
    color: 'white',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  replayModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004d24',
    textAlign: 'center',
    marginBottom: 25,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 25,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  startButton: {
    flex: 1,
    backgroundColor: '#d4af37',
    borderRadius: 10,
    paddingVertical: 12,
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Replay Progress Bar
  replayProgressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  replayInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  replayProgressText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  stopButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  stopButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#d4af37',
    borderRadius: 2,
  },
});
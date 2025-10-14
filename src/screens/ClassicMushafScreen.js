import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QuranService } from '../services/QuranService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../styles/theme';
import { Icon } from '../components/Icon';
import { SURAH_NAMES } from '../constants/SurahNames';
import { cleanArabicText } from '../utils/TextCleaner';
import LoadingState from '../components/LoadingState';

const { width, height } = Dimensions.get('window');

export default function ClassicMushafScreen({ navigation }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showJumpModal, setShowJumpModal] = useState(false);
  const [jumpToPage, setJumpToPage] = useState('');
  const scrollViewRef = useRef(null);

  useEffect(() => {
    loadLastReadPage();
  }, []);

  useEffect(() => {
    if (currentPage) {
      fetchPageData(currentPage);
      saveLastReadPage(currentPage);
    }
  }, [currentPage]);

  const loadLastReadPage = async () => {
    try {
      const savedPage = await AsyncStorage.getItem('lastReadPage');
      const pageNum = savedPage ? parseInt(savedPage) : 1;
      setCurrentPage(pageNum);
    } catch (error) {
      console.error('Error loading last read page:', error);
      setCurrentPage(1);
    }
  };

  const saveLastReadPage = async (pageNumber) => {
    try {
      await AsyncStorage.setItem('lastReadPage', pageNumber.toString());
    } catch (error) {
      console.error('Error saving last read page:', error);
    }
  };

  const fetchPageData = async (pageNumber) => {
    setLoading(true);
    console.log('🔄 Fetching page:', pageNumber);
    
    try {
      const data = await QuranService.getPageData(pageNumber);
      console.log('✅ Page loaded:', pageNumber, 'verses:', data.verses.length);
      setPageData(data);
    } catch (error) {
      console.error('❌ Error loading page:', error);
      Alert.alert('Error', 'Failed to load page. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const goToNextPage = () => {
    if (currentPage < 604) {
      setCurrentPage(prev => prev + 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    }
  };

  const handleJumpToPage = () => {
    const pageNum = parseInt(jumpToPage);
    if (pageNum >= 1 && pageNum <= 604) {
      setCurrentPage(pageNum);
      setShowJumpModal(false);
      setJumpToPage('');
      scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    } else {
      Alert.alert('Invalid Page', 'Please enter a page number between 1 and 604');
    }
  };

  // Group verses by Surah and detect if it's the START of a Surah
  const groupVersesBySurah = () => {
    if (!pageData || !pageData.verses) return [];

    const groups = [];
    let currentGroup = null;

    pageData.verses.forEach((verse) => {
      const [surahNumber, verseNumber] = verse.key.split(':').map(Number);

      if (!currentGroup || currentGroup.surahNumber !== surahNumber) {
        // Start new Surah group
        currentGroup = {
          surahNumber,
          verses: [],
          juzNumber: verse.juz_number,
          hizbNumber: verse.hizb_number,
          isStartOfSurah: verseNumber === 1,
        };
        groups.push(currentGroup);
      }

      currentGroup.verses.push({
        number: verseNumber,
        text: verse.text,
      });
    });

    return groups;
  };

  const surahGroups = groupVersesBySurah();

  // Get top-level metadata (from first verse)
  const getPageMetadata = () => {
    if (!pageData || !pageData.verses || pageData.verses.length === 0) {
      return null;
    }

    const firstVerse = pageData.verses[0];
    const [surahNumber] = firstVerse.key.split(':').map(Number);
    
    return {
      surahNumber,
      juzNumber: firstVerse.juz_number || pageData.page?.juz_number,
    };
  };

  const pageMetadata = getPageMetadata();

  if (loading) {
  return <LoadingState fullScreen message={`Loading Page ${currentPage}...`} />;
}

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          
          {/* Page Content */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Top Page Metadata */}
            {pageMetadata && (
              <View style={styles.topMetadata}>
                <Text style={styles.topEnglishName}>
                  {SURAH_NAMES[pageMetadata.surahNumber]?.transliteration}
                </Text>
                <Text style={styles.topJuzInfo}>
                  Juz' {pageMetadata.juzNumber}
                </Text>
              </View>
            )}

            {/* Render each Surah group */}
            {surahGroups.map((group, groupIndex) => (
              <View key={`surah-${group.surahNumber}`} style={styles.surahSection}>
                
                {/* Decorative Surah Header - ONLY at START */}
                {group.isStartOfSurah && (
                  <>
                    <View style={styles.decorativeBorder}>
                      <View style={styles.cornerPattern}>
                        <Text style={styles.patternText}>۞</Text>
                      </View>
                      <View style={styles.surahNameContainer}>
                        <Text style={styles.surahNameArabic}>
                          {SURAH_NAMES[group.surahNumber]?.arabic}
                        </Text>
                      </View>
                      <View style={styles.cornerPattern}>
                        <Text style={styles.patternText}>۞</Text>
                      </View>
                    </View>

                    {/* Bismillah - Skip for Surah 1 and 9 */}
                    {group.surahNumber !== 1 && group.surahNumber !== 9 && (
                      <Text style={styles.bismillah}>
                        بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
                      </Text>
                    )}
                  </>
                )}

                {/* Continuous flowing verses */}
                <Text style={styles.continuousText}>
                  {group.verses.map((verse, index) => (
                    <Text key={`${group.surahNumber}:${verse.number}`}>
                      {cleanArabicText(verse.text)}
                      <Text style={styles.verseNumberInline}> ﴿{verse.number}﴾ </Text>
                    </Text>
                  ))}
                </Text>
              </View>
            ))}

            {/* Page Number at bottom */}
            <Text style={styles.pageNumber}>{currentPage}</Text>
          </ScrollView>

          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.topBarButton}
            >
              <Icon name="close" type="Ionicons" size={24} color="#8B7355" />
            </TouchableOpacity>

            <View style={styles.topBarCenter}>
              <Text style={styles.topBarPageNumber}>Page {currentPage} / 604</Text>
            </View>

            <TouchableOpacity
              onPress={() => setShowJumpModal(true)}
              style={styles.topBarButton}
            >
              <Icon name="search" type="Ionicons" size={24} color="#8B7355" />
            </TouchableOpacity>
          </View>

          {/* Navigation Overlay - Bottom */}
          <View style={styles.navigationOverlay}>
            <TouchableOpacity
              onPress={goToPreviousPage}
              disabled={currentPage === 1}
              style={[styles.navButton, currentPage === 1 && styles.navButtonDisabled]}
            >
              <Icon name="arrow-forward" type="Ionicons" size={28} color="#FFFFFF" />
            </TouchableOpacity>

            <View style={styles.pageIndicatorBubble}>
              <Text style={styles.pageIndicatorText}>{currentPage}</Text>
            </View>

            <TouchableOpacity
              onPress={goToNextPage}
              disabled={currentPage === 604}
              style={[styles.navButton, currentPage === 604 && styles.navButtonDisabled]}
            >
              <Icon name="arrow-back" type="Ionicons" size={28} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Jump Modal */}
          <Modal
            visible={showJumpModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowJumpModal(false)}
          >
            <TouchableOpacity 
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowJumpModal(false)}
            >
              <TouchableOpacity 
                activeOpacity={1}
                onPress={(e) => e.stopPropagation()}
              >
                <View style={styles.jumpModal}>
                  <Text style={styles.jumpModalTitle}>Jump to Page</Text>
                  <Text style={styles.jumpModalSubtitle}>Enter page number (1-604)</Text>
                  
                  <TextInput
                    style={styles.jumpInput}
                    value={jumpToPage}
                    onChangeText={setJumpToPage}
                    keyboardType="numeric"
                    placeholder="Page number"
                    placeholderTextColor="#999"
                    autoFocus={true}
                    maxLength={3}
                  />

                  <View style={styles.jumpModalButtons}>
                    <TouchableOpacity 
                      style={styles.jumpModalCancelButton}
                      onPress={() => {
                        setShowJumpModal(false);
                        setJumpToPage('');
                      }}
                    >
                      <Text style={styles.jumpModalCancelText}>Cancel</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={styles.jumpModalConfirmButton}
                      onPress={handleJumpToPage}
                    >
                      <Text style={styles.jumpModalConfirmText}>Go</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </TouchableOpacity>
          </Modal>

        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F0E8',
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8B7355',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 120,
  },
  topMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  topEnglishName: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '500',
  },
  topJuzInfo: {
    fontSize: 14,
    color: '#8B7355',
    fontWeight: '500',
  },
  surahSection: {
    marginBottom: 24,
  },
  decorativeBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2.5,
    borderColor: '#2D8B8E',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    marginBottom: 16,
  },
  cornerPattern: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patternText: {
    fontSize: 24,
    color: '#2D8B8E',
  },
  surahNameContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  surahNameArabic: {
    fontSize: 20,
    fontFamily: 'UthmanicFont',
    color: '#2D8B8E',
    textAlign: 'center',
  },
  bismillah: {
    fontSize: 24,
    fontFamily: 'UthmanicFont',
    color: '#2D8B8E',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 40,
  },
  continuousText: {
    fontSize: 22,
    lineHeight: 44,
    fontFamily: 'UthmanicFont',
    color: '#1A1A1A',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  verseNumberInline: {
    fontSize: 18,
    color: '#2D8B8E',
    fontFamily: 'UthmanicFont',
  },
  pageNumber: {
    fontSize: 14,
    color: '#8B7355',
    textAlign: 'left',
    marginTop: 30,
    marginBottom: 20,
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 115, 85, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  topBarButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarCenter: {
    flex: 1,
    alignItems: 'center',
  },
  topBarPageNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#8B7355',
  },
  navigationOverlay: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  navButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2D8B8E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  navButtonDisabled: {
    opacity: 0.3,
    backgroundColor: '#B0B0B0',
  },
  pageIndicatorBubble: {
    backgroundColor: 'rgba(45, 139, 142, 0.95)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  pageIndicatorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jumpModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 28,
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  jumpModalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D8B8E',
    textAlign: 'center',
    marginBottom: 8,
  },
  jumpModalSubtitle: {
    fontSize: 14,
    color: '#8B7355',
    textAlign: 'center',
    marginBottom: 24,
  },
  jumpInput: {
    borderWidth: 2,
    borderColor: '#2D8B8E',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 24,
    backgroundColor: '#F5F0E8',
  },
  jumpModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  jumpModalCancelButton: {
    flex: 1,
    backgroundColor: '#F5F0E8',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  jumpModalConfirmButton: {
    flex: 1,
    backgroundColor: '#2D8B8E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  jumpModalCancelText: {
    color: '#8B7355',
    fontSize: 17,
    fontWeight: '700',
  },
  jumpModalConfirmText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },
});
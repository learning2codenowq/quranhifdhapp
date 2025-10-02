// src/screens/ClassicMushafScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  FlatList,
  Dimensions,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QuranService } from '../services/QuranService';
import { cleanArabicText } from '../utils/TextCleaner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../styles/theme';
import { Icon } from '../components/Icon';

const { width } = Dimensions.get('window');

export default function ClassicMushafScreen({ navigation }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastReadPage, setLastReadPage] = useState(1);
  const [showJumpModal, setShowJumpModal] = useState(false);
  const [jumpToPage, setJumpToPage] = useState('');
  const flatListRef = useRef(null);

  useEffect(() => {
    loadLastReadPage();
  }, []);

  useEffect(() => {
    if (lastReadPage > 0) {
      loadPagesAround(lastReadPage);
    }
  }, [lastReadPage]);

  const loadLastReadPage = async () => {
    try {
      const savedPage = await AsyncStorage.getItem('lastReadPage');
      if (savedPage) {
        const pageNum = parseInt(savedPage);
        setLastReadPage(pageNum);
        setCurrentPage(pageNum);
        
        // Scroll to saved page after a short delay
        setTimeout(() => {
          if (flatListRef.current) {
            flatListRef.current.scrollToIndex({
              index: pageNum - 1,
              animated: false
            });
          }
        }, 500);
      }
    } catch (error) {
      console.error('Error loading last read page:', error);
    }
  };

  const saveLastReadPage = async (pageNumber) => {
    try {
      await AsyncStorage.setItem('lastReadPage', pageNumber.toString());
    } catch (error) {
      console.error('Error saving last read page:', error);
    }
  };

  const loadPagesAround = async (centerPage) => {
    const pagesToLoad = [];
    const range = 5;
    
    for (let i = Math.max(1, centerPage - range); i <= Math.min(604, centerPage + range); i++) {
      if (!pages[i]) {
        pagesToLoad.push(i);
      }
    }

    if (pagesToLoad.length === 0) return;

    setLoading(true);
    
    try {
      const loadPromises = pagesToLoad.map(async (pageNum) => {
        try {
          const data = await QuranService.getPageData(pageNum);
          return { pageNum, data };
        } catch (error) {
          console.error(`Error loading page ${pageNum}:`, error);
          return { pageNum, data: null };
        }
      });

      const results = await Promise.all(loadPromises);
      
      const newPages = { ...pages };
      results.forEach(({ pageNum, data }) => {
        if (data) {
          newPages[pageNum] = data;
        }
      });
      
      setPages(newPages);
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    saveLastReadPage(pageNumber);
    
    const loadedPages = Object.keys(pages).map(Number);
    const minLoaded = Math.min(...loadedPages);
    const maxLoaded = Math.max(...loadedPages);
    
    if (pageNumber <= minLoaded + 2 || pageNumber >= maxLoaded - 2) {
      loadPagesAround(pageNumber);
    }
  };

  const handleJumpToPage = () => {
    const pageNum = parseInt(jumpToPage);
    if (pageNum >= 1 && pageNum <= 604) {
      setCurrentPage(pageNum);
      loadPagesAround(pageNum);
      setShowJumpModal(false);
      setJumpToPage('');
      
      setTimeout(() => {
        if (flatListRef.current) {
          flatListRef.current.scrollToIndex({
            index: pageNum - 1,
            animated: true
          });
        }
      }, 100);
    } else {
      Alert.alert('Invalid Page', 'Please enter a page number between 1 and 604');
    }
  };

  const navigateToPage = (direction) => {
    const newPage = direction === 'next' ? 
      Math.min(604, currentPage + 1) : 
      Math.max(1, currentPage - 1);
    
    if (newPage !== currentPage && flatListRef.current) {
      flatListRef.current.scrollToIndex({
        index: newPage - 1,
        animated: true
      });
    }
  };

  const renderPage = ({ item: pageNumber }) => {
    const pageData = pages[pageNumber];
    
    if (!pageData) {
      return (
        <View style={[styles.pageContainer, { width }]}>
          <View style={styles.loadingPageContainer}>
            <ActivityIndicator size="large" color="#d4af37" />
            <Text style={styles.loadingPageText}>Loading Page {pageNumber}...</Text>
          </View>
        </View>
      );
    }

    // Check if this page starts with a new surah
    const firstVerse = pageData.verses?.[0];
    const isNewSurah = firstVerse && firstVerse.number === 1;
    const isTawbah = firstVerse && firstVerse.key && firstVerse.key.startsWith('9:');
    const showBasmallah = isNewSurah && !isTawbah && firstVerse.key !== '1:1';

    return (
      <View style={[styles.pageContainer, { width }]}>
        <View style={styles.pageContent}>
          {/* Page Header with Juz info */}
          {pageData.page && (
            <View style={styles.pageHeader}>
              <View style={styles.pageHeaderContent}>
                <View style={styles.juzBadge}>
                  <Text style={styles.juzText}>Juz {pageData.page.juz_number}</Text>
                </View>
              </View>
            </View>
          )}
          
          {/* Verses Container */}
          <View style={styles.versesContainer}>
            {/* Basmallah for new surahs */}
            {showBasmallah && (
              <Text style={styles.basmalaText}>
                بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
              </Text>
            )}

            {pageData.verses?.map((verse, index) => {
              return (
                <Text key={verse.key || index} style={styles.arabicText}>
                  {cleanArabicText(verse.text)}
                  {verse.number && (
                    <Text style={styles.verseNumber}> ﴿{verse.number}﴾ </Text>
                  )}
                </Text>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const visiblePage = viewableItems[0].item;
      handlePageChange(visiblePage);
    }
  }).current;

  // Reverse array for RTL swipe behavior (right = next)
  const pageNumbers = Array.from({ length: 604 }, (_, i) => 604 - i);

  return (
    <SafeAreaProvider>
      <LinearGradient colors={Theme.gradients.primary} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          
          {/* Modern Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="chevron-back" type="Ionicons" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.pageNumberButton}
              onPress={() => setShowJumpModal(true)}
            >
              <Text style={styles.pageNumberText}>{currentPage}</Text>
              <View style={styles.jumpBadge}>
                <Text style={styles.jumpText}>JUMP</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigateToPage('next')}
            >
              <Icon name="chevron-forward" type="Ionicons" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Page Content */}
          <FlatList
            ref={flatListRef}
            data={pageNumbers}
            renderItem={renderPage}
            keyExtractor={(item) => item.toString()}
            horizontal
            inverted
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50
            }}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
            initialScrollIndex={604 - currentPage}
            onScrollToIndexFailed={(info) => {
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
              });
            }}
          />

          {/* Bottom Navigation */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity 
              style={[styles.navButton, currentPage <= 1 && styles.navButtonDisabled]}
              onPress={() => navigateToPage('previous')}
              disabled={currentPage <= 1}
            >
              <Icon 
                name="chevron-back" 
                type="Ionicons" 
                size={20} 
                color={currentPage <= 1 ? 'rgba(255, 255, 255, 0.3)' : 'white'} 
              />
              <Text style={[styles.navButtonText, currentPage <= 1 && styles.navButtonTextDisabled]}>
                Previous
              </Text>
            </TouchableOpacity>

            <View style={styles.pageIndicator}>
              <Text style={styles.pageIndicatorText}>{currentPage} / 604</Text>
            </View>

            <TouchableOpacity 
              style={[styles.navButton, currentPage >= 604 && styles.navButtonDisabled]}
              onPress={() => navigateToPage('next')}
              disabled={currentPage >= 604}
            >
              <Text style={[styles.navButtonText, currentPage >= 604 && styles.navButtonTextDisabled]}>
                Next
              </Text>
              <Icon 
                name="chevron-forward" 
                type="Ionicons" 
                size={20} 
                color={currentPage >= 604 ? 'rgba(255, 255, 255, 0.3)' : 'white'} 
              />
            </TouchableOpacity>
          </View>

          {/* Jump to Page Modal */}
          <Modal
            visible={showJumpModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowJumpModal(false)}
          >
            <View style={styles.modalOverlay}>
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
            </View>
          </Modal>

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageNumberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 8,
  },
  pageNumberText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  jumpBadge: {
    backgroundColor: Theme.colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  jumpText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  pageContainer: {
    flex: 1,
    backgroundColor: '#FFF9E6',
    marginHorizontal: 0,
    marginVertical: 10,
  },
  loadingPageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
  },
  loadingPageText: {
    color: Theme.colors.primary,
    fontSize: 16,
    marginTop: 15,
    fontWeight: '500',
  },
  pageContent: {
    flex: 1,
    padding: 20,
  },
  pageHeader: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#d4af37',
  },
  pageHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  juzBadge: {
    backgroundColor: Theme.colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  juzText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  versesContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  basmalaText: {
    fontFamily: 'UthmanicFont',
    fontSize: 24,
    color: Theme.colors.primary,
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 40,
  },
  arabicText: {
    fontFamily: 'UthmanicFont',
    fontSize: 20,
    lineHeight: 36,
    color: '#2c3e50',
    textAlign: 'right',
    marginBottom: 8,
    paddingHorizontal: 5,
  },
  verseNumber: {
    fontSize: 18,
    color: Theme.colors.secondary,
    fontWeight: 'bold',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 110,
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  navButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  navButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  pageIndicator: {
    backgroundColor: Theme.colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  pageIndicatorText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  jumpModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: '100%',
    maxWidth: 350,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  jumpModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  jumpModalSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  jumpInput: {
    borderWidth: 2,
    borderColor: Theme.colors.gray200,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '600',
    color: Theme.colors.primary,
    backgroundColor: Theme.colors.gray100,
    marginBottom: 24,
  },
  jumpModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  jumpModalCancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  jumpModalConfirmButton: {
    flex: 1,
    backgroundColor: Theme.colors.secondary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  jumpModalCancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  jumpModalConfirmText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
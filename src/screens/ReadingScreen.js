import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert,
  FlatList,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { QuranService } from '../services/QuranService';
import { cleanArabicText } from '../utils/TextCleaner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme } from '../styles/theme';

const { width } = Dimensions.get('window');

export default function ReadingScreen() {
  const [isReading, setIsReading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pages, setPages] = useState({});
  const [loading, setLoading] = useState(false);
  const [lastReadPage, setLastReadPage] = useState(1);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadLastReadPage();
  }, []);

  const loadLastReadPage = async () => {
    try {
      const savedPage = await AsyncStorage.getItem('lastReadPage');
      if (savedPage) {
        setLastReadPage(parseInt(savedPage));
        setCurrentPage(parseInt(savedPage));
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

  const startReading = async () => {
    setIsReading(true);
    await loadPagesAround(lastReadPage);
    
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: lastReadPage - 1,
          animated: false
        });
      }
    }, 100);
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

  const goToPage = () => {
    Alert.prompt(
      'Go to Page',
      'Enter page number (1-604):',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Go',
          onPress: async (pageNum) => {
            const num = parseInt(pageNum);
            if (num >= 1 && num <= 604) {
              setCurrentPage(num);
              await loadPagesAround(num);
              
              if (flatListRef.current) {
                flatListRef.current.scrollToIndex({
                  index: num - 1,
                  animated: true
                });
              }
            } else {
              Alert.alert('Invalid Page', 'Please enter a page number between 1 and 604');
            }
          }
        }
      ],
      'plain-text',
      currentPage.toString()
    );
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

    return (
      <View style={[styles.pageContainer, { width }]}>
        <View style={styles.pageContent}>
          {pageData.page && (
            <View style={styles.pageHeader}>
              <Text style={styles.pageInfo}>
                Page {pageData.page.number} • Juz {pageData.page.juz_number}
              </Text>
            </View>
          )}
          
          <View style={styles.versesContainer}>
            {pageData.verses?.map((verse, index) => (
              <Text key={verse.key || index} style={styles.arabicText}>
                {cleanArabicText(verse.text)}
                {verse.number && (
                  <Text style={styles.verseNumber}> ﴿{verse.number}﴾ </Text>
                )}
              </Text>
            ))}
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

  if (!isReading) {
  return (
    <SafeAreaProvider>
      <LinearGradient colors={Theme.gradients.primary} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Quran</Text>
            <Text style={styles.welcomeSubtitle}>Classic Mushaf-style reading</Text>
            
            <TouchableOpacity 
              style={[styles.startButton, styles.disabledButton]} 
              onPress={() => {}} 
              disabled={true}
            >
              <Text style={styles.startButtonText}>Start Reading</Text>
            </TouchableOpacity>
            
            <View style={styles.comingSoonContainer}>
              <Text style={styles.comingSoonText}>Coming Soon</Text>
              <Text style={styles.comingSoonSubtext}>
                We're working on bringing you the perfect reading experience
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </SafeAreaProvider>
  );
}

  const pageNumbers = Array.from({ length: 604 }, (_, i) => i + 1);

  return (
    <SafeAreaProvider>
      <LinearGradient colors={Theme.gradients.primary} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setIsReading(false)}>
              <Text style={styles.backText}>← Stop Reading</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pageButton} onPress={goToPage}>
              <Text style={styles.pageButtonText}>Page {currentPage} of 604</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            ref={flatListRef}
            data={pageNumbers}
            renderItem={renderPage}
            keyExtractor={(item) => item.toString()}
            horizontal
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
            initialScrollIndex={currentPage - 1}
            onScrollToIndexFailed={(info) => {
              const wait = new Promise(resolve => setTimeout(resolve, 500));
              wait.then(() => {
                flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
              });
            }}
          />

          <View style={styles.navigationContainer}>
            <TouchableOpacity 
              style={[styles.navButton, currentPage >= 604 && styles.navButtonDisabled]}
              onPress={() => navigateToPage('next')}
              disabled={currentPage >= 604}
            >
              <Text style={[styles.navButtonText, currentPage >= 604 && styles.navButtonTextDisabled]}>
                Next
              </Text>
            </TouchableOpacity>

            <View style={styles.pageIndicator}>
              <Text style={styles.pageIndicatorText}>{currentPage} / 604</Text>
            </View>

            <TouchableOpacity 
              style={[styles.navButton, currentPage <= 1 && styles.navButtonDisabled]}
              onPress={() => navigateToPage('previous')}
              disabled={currentPage <= 1}
            >
              <Text style={[styles.navButtonText, currentPage <= 1 && styles.navButtonTextDisabled]}>
                Previous
              </Text>
            </TouchableOpacity>
          </View>

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
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeSubtitle: {
  fontSize: 18,
  color: 'rgba(255, 255, 255, 0.8)',
  marginBottom: 60,
  textAlign: 'center',
  },
  startButton: {
    backgroundColor: Theme.colors.secondary,
    borderRadius: 25,
    paddingVertical: 18,
    paddingHorizontal: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    marginBottom: 20,
  },
  startButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
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
  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  pageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  pageButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  pageContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    marginHorizontal: 5,
    marginVertical: 10,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loadingPageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingPageText: {
    color: '#666',
    fontSize: 16,
    marginTop: 10,
  },
  pageContent: {
    flex: 1,
    padding: 15,
  },
  pageHeader: {
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  pageInfo: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  versesContainer: {
    flex: 1,
    paddingHorizontal: 5,
  },
  arabicText: {
    fontFamily: 'UthmanicFont',
    fontSize: 18,
    lineHeight: 30,
    color: '#2c3e50',
    textAlign: 'right',
    marginBottom: 6,
    paddingHorizontal: 5,
  },
  verseNumber: {
    fontSize: 16,
    color: Theme.colors.secondary,
    fontWeight: 'bold',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  navButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 100,
  },
  navButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  navButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  navButtonTextDisabled: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  pageIndicator: {
    backgroundColor: Theme.colors.secondary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  pageIndicatorText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
  backgroundColor: '#999',
  opacity: 0.6,
},
comingSoonContainer: {
  alignItems: 'center',
  marginTop: 20,
  marginBottom: 0,
},
comingSoonText: {
  fontSize: 18,
  color: '#d4af37',
  textAlign: 'center',
  fontWeight: 'bold',
  marginBottom: 8,
},
comingSoonSubtext: {
  fontSize: 14,
  color: 'rgba(255, 255, 255, 0.8)',
  textAlign: 'center',
  paddingHorizontal: 20,
  lineHeight: 20,
},
});
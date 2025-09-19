import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
  Dimensions,
  Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ReadingScreen() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPage(currentPage);
  }, [currentPage]);

  const loadPage = async (pageNumber) => {
    try {
      setLoading(true);
      
      // TODO: Replace with your actual API endpoint for page data
      // const response = await fetch(`YOUR_API_ENDPOINT/page/${pageNumber}`);
      // const data = await response.json();
      
      // Mock data for now - replace with actual API call
      const mockPageData = {
        pageNumber: pageNumber,
        lines: [
          'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ',
          'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
          'الرَّحْمَنِ الرَّحِيمِ',
          'مَالِكِ يَوْمِ الدِّينِ',
          'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
          'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
          'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ'
        ].concat(Array(8).fill('Mock Arabic text for page content...')),
        surahInfo: pageNumber === 1 ? 'سُورَةُ الْفَاتِحَةِ' : null
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setPageData(mockPageData);
    } catch (error) {
      console.error('Error loading page:', error);
      Alert.alert('Error', 'Failed to load page. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < 604) {
      setCurrentPage(prev => prev + 1);
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
          onPress: (pageNum) => {
            const num = parseInt(pageNum);
            if (num >= 1 && num <= 604) {
              setCurrentPage(num);
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

  if (loading) {
    return (
      <SafeAreaProvider>
        <LinearGradient colors={['#004d24', '#058743']} style={styles.container}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#d4af37" />
              <Text style={styles.loadingText}>Loading Page {currentPage}...</Text>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <LinearGradient colors={['#004d24', '#058743']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Quran Reading</Text>
            <TouchableOpacity style={styles.pageButton} onPress={goToPage}>
              <Text style={styles.pageButtonText}>Page {currentPage} of 604</Text>
            </TouchableOpacity>
          </View>

          {/* Page Content */}
          <View style={styles.pageContainer}>
            <ScrollView 
              style={styles.pageScroll}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.pageContent}
            >
              {pageData?.surahInfo && (
                <Text style={styles.surahHeader}>{pageData.surahInfo}</Text>
              )}
              
              {pageData?.lines.map((line, index) => (
                <Text key={index} style={styles.arabicLine}>
                  {line}
                </Text>
              ))}
            </ScrollView>
          </View>

          {/* Navigation Controls */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity 
              style={[styles.navButton, currentPage <= 1 && styles.navButtonDisabled]}
              onPress={goToPreviousPage}
              disabled={currentPage <= 1}
            >
              <Text style={[styles.navButtonText, currentPage <= 1 && styles.navButtonTextDisabled]}>
                ← Previous
              </Text>
            </TouchableOpacity>

            <View style={styles.pageIndicator}>
              <Text style={styles.pageIndicatorText}>{currentPage} / 604</Text>
            </View>

            <TouchableOpacity 
              style={[styles.navButton, currentPage >= 604 && styles.navButtonDisabled]}
              onPress={goToNextPage}
              disabled={currentPage >= 604}
            >
              <Text style={[styles.navButtonText, currentPage >= 604 && styles.navButtonTextDisabled]}>
                Next →
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
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
    marginHorizontal: 10,
    marginVertical: 10,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pageScroll: {
    flex: 1,
  },
  pageContent: {
    padding: 25,
    alignItems: 'center',
  },
  surahHeader: {
    fontSize: 22,
    color: '#004d24',
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  arabicLine: {
    fontSize: 28,
    lineHeight: 55,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
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
    backgroundColor: '#d4af37',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  pageIndicatorText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
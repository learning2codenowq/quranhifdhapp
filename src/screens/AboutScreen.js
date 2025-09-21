import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function AboutScreen({ navigation }) {
  
  const handleEmailPress = () => {
    const email = 'support@hifdhjourney.com';
    const subject = 'Hifdh Journey Support';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Email Not Available', `Please contact us at: ${email}`);
        }
      })
      .catch(() => {
        Alert.alert('Email Not Available', `Please contact us at: ${email}`);
      });
  };

  const handleWebsitePress = () => {
    const url = 'https://hifdhjourney.com'; // Replace with your actual website
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Website Not Available', 'Please visit us later.');
        }
      })
      .catch(() => {
        Alert.alert('Website Not Available', 'Please visit us later.');
      });
  };

  return (
    <SafeAreaProvider>
      <LinearGradient colors={['#004d24', '#058743']} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>About</Text>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            
            {/* App Info */}
            <View style={styles.section}>
              <View style={styles.logoContainer}>
                <Text style={styles.arabicLogo}>القرآن</Text>
                <Text style={styles.appName}>Hifdh Journey</Text>
                <Text style={styles.tagline}>Your path to memorizing the Holy Quran</Text>
              </View>
              
              <View style={styles.versionInfo}>
                <Text style={styles.versionText}>Version 1.0.0</Text>
                <Text style={styles.buildText}>Build 1</Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>About This App</Text>
              <Text style={styles.bodyText}>
                Hifdh Journey is a modern, comprehensive app designed to help Muslims memorize the Holy Quran with ease and consistency. Our app combines traditional memorization methods with modern technology to create an effective learning experience.
              </Text>
            </View>

            {/* Features */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Key Features</Text>
              <Text style={styles.featureText}>📖 Complete Quran with audio recitations</Text>
              <Text style={styles.featureText}>📊 Progress tracking and analytics</Text>
              <Text style={styles.featureText}>🎯 Daily memorization goals</Text>
              <Text style={styles.featureText}>🔄 Smart revision system</Text>
              <Text style={styles.featureText}>🏆 Achievement system</Text>
              <Text style={styles.featureText}>📈 Detailed statistics</Text>
              <Text style={styles.featureText}>🎵 High-quality audio recitations</Text>
            </View>

            {/* Credits */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Credits & Acknowledgments</Text>
              <Text style={styles.bodyText}>
                • Quran text: Uthmanic script{'\n'}
                • Audio recitations: Various qualified reciters{'\n'}
                • Islamic calendar calculations{'\n'}
                • Open source libraries and frameworks{'\n'}
                • Beta testers and community feedback
              </Text>
            </View>

            {/* Contact */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Contact & Support</Text>
              
              <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
                <Text style={styles.contactLabel}>Email Support</Text>
                <Text style={styles.contactValue}>support@hifdhjourney.com</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.contactItem} onPress={handleWebsitePress}>
                <Text style={styles.contactLabel}>Website</Text>
                <Text style={styles.contactValue}>www.hifdhjourney.com</Text>
              </TouchableOpacity>
            </View>

            {/* Legal */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Legal</Text>
              
              <TouchableOpacity 
                style={styles.legalItem}
                onPress={() => navigation.navigate('PrivacyPolicy')}
              >
                <Text style={styles.legalText}>Privacy Policy</Text>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.legalItem}
                onPress={() => navigation.navigate('TermsOfService')}
              >
                <Text style={styles.legalText}>Terms of Service</Text>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
            </View>

            {/* Copyright */}
            <View style={styles.copyrightSection}>
              <Text style={styles.copyrightText}>
                © 2024 Hifdh Journey{'\n'}
                Made with ❤️ for the Muslim community
              </Text>
              <Text style={styles.islamicText}>
                بارك الله فيكم{'\n'}
                May Allah bless you
              </Text>
            </View>

          </ScrollView>
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
    paddingTop: 20,
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
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  arabicLogo: {
    fontSize: 48,
    color: '#d4af37',
    marginBottom: 10,
    fontFamily: 'KFGQPC_Uthmanic_Script_HAFS_Regular',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004d24',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  versionInfo: {
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  versionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004d24',
  },
  buildText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004d24',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
  featureText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 24,
    marginBottom: 4,
  },
  contactItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 16,
    color: '#004d24',
    fontWeight: '500',
  },
  legalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  legalText: {
    fontSize: 16,
    color: '#004d24',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 16,
    color: '#d4af37',
    fontWeight: 'bold',
  },
  copyrightSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  copyrightText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  islamicText: {
    fontSize: 16,
    color: '#004d24',
    textAlign: 'center',
    fontFamily: 'UthmanicFont',
    lineHeight: 26,
  },
});
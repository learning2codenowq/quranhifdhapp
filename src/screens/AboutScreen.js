import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../styles/theme';

export default function AboutScreen({ navigation }) {
  
  const handleEmailPress = () => {
    const email = 'shayanshehzadqureshi@gmail.com';
    const subject = 'Quran Hifdh App Feedback';
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Email Not Available', `Please contact me at: ${email}`);
        }
      })
      .catch(() => {
        Alert.alert('Email Not Available', `Please contact me at: ${email}`);
      });
  };

  return (
    <SafeAreaProvider>
      <LinearGradient colors={Theme.gradients.primary} style={styles.container}>
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
                <Text style={styles.appName}>Quran Hifdh</Text>
                <Text style={styles.tagline}>Your companion for memorizing the Holy Quran</Text>
              </View>
              
              <View style={styles.versionInfo}>
                <Text style={styles.versionText}>Version 1.0.0</Text>
                <Text style={styles.buildText}>Build 1</Text>
              </View>
            </View>

            {/* Features */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Key Features</Text>
              <Text style={styles.featureText}>📖 Complete Quran with high-quality audio recitations</Text>
              <Text style={styles.featureText}>📊 Intelligent progress tracking and analytics</Text>
              <Text style={styles.featureText}>🎯 Personalized daily memorization goals</Text>
              <Text style={styles.featureText}>🔄 Smart revision system based on proven methods</Text>
              <Text style={styles.featureText}>🏆 Motivational achievement system</Text>
              <Text style={styles.featureText}>📈 Detailed statistics and insights</Text>
              <Text style={styles.featureText}>🔊 Beautiful audio recitations with repeat functionality</Text>
              <Text style={styles.featureText}>💚 Clean, distraction-free interface designed for focus</Text>
            </View>

            {/* Contact */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Connect & Support</Text>
              
              <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
                <Text style={styles.contactLabel}>Email Me Directly</Text>
                <Text style={styles.contactValue}>shayanshehzadqureshi@gmail.com</Text>
                <Text style={styles.contactNote}>I personally read and respond to every email</Text>
              </TouchableOpacity>
              
              <View style={styles.feedbackNote}>
                <Text style={styles.feedbackText}>
                  Your feedback, suggestions, and duas mean everything to me. Whether it's a feature request, bug report, or just to say jazakAllahu khayran - I'd love to hear from you!
                </Text>
              </View>
            </View>

            {/* Legal */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Legal & Privacy</Text>
              
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
                © 2025 Quran Hifdh{'\n'}
                Developed with ❤️ for the Ummah
              </Text>
              <Text style={styles.islamicText}>
                بارك الله فيكم{'\n'}
                May Allah bless you and accept your efforts
              </Text>
              <Text style={styles.finalMessage}>
                Uthman bin Affan reported: The Prophet ﷺ said, “The best of you are those who learn the Quran and teach it.” - Ṣaḥīḥ al-Bukhārī 5027
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
    color: Theme.colors.secondary,
    marginBottom: 10,
    fontFamily: 'UthmanicFont',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.primary,
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
    color: Theme.colors.primary,
  },
  buildText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: 12,
  },
  personalMessage: {
    fontSize: 14,
    color: '#333',
    lineHeight: 24,
    textAlign: 'left',
  },
  greeting: {
    fontWeight: '600',
    color: Theme.colors.primary,
    fontSize: 15,
  },
  developerName: {
    fontWeight: 'bold',
    color: Theme.colors.secondary,
  },
  emphasis: {
    fontWeight: '600',
    color: Theme.colors.primary,
    fontStyle: 'italic',
  },
  dua: {
    fontStyle: 'italic',
    color: '#058743',
    fontWeight: '500',
    textAlign: 'center',
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
    paddingVertical: 15,
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
    color: Theme.colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  contactNote: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  feedbackNote: {
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    borderLeftWidth: 4,
    borderColor: Theme.colors.secondary,
  },
  feedbackText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    fontStyle: 'italic',
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
    color: Theme.colors.primary,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 16,
    color: Theme.colors.secondary,
    fontWeight: 'bold',
  },
  copyrightSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.secondary,
  },
  copyrightText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  islamicText: {
    fontSize: 16,
    color: Theme.colors.primary,
    textAlign: 'center',
    fontFamily: 'UthmanicFont',
    lineHeight: 26,
    marginBottom: 15,
  },
  finalMessage: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});
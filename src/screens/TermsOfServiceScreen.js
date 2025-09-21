import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function TermsOfServiceScreen({ navigation }) {
  return (
    <SafeAreaProvider>
      <LinearGradient colors={['#004d24', '#058743']} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Terms of Service</Text>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Terms of Service for Hifdh Journey</Text>
              <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>1. Acceptance of Terms</Text>
              <Text style={styles.bodyText}>
                By downloading, installing, or using the Hifdh Journey mobile application ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the App.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>2. Description of Service</Text>
              <Text style={styles.bodyText}>
                Hifdh Journey is a mobile application designed to help users memorize the Holy Quran. The App provides:{'\n\n'}
                • Quran text and audio recitations{'\n'}
                • Progress tracking for memorization{'\n'}
                • Daily goals and reminders{'\n'}
                • Achievement system{'\n'}
                • Analytics and statistics{'\n'}
                • Revision scheduling system
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>3. User Responsibilities</Text>
              <Text style={styles.bodyText}>
                You agree to:{'\n\n'}
                • Use the App for its intended purpose of Quran memorization{'\n'}
                • Respect the sacred nature of the Quran content{'\n'}
                • Not attempt to modify, reverse engineer, or hack the App{'\n'}
                • Not use the App for any illegal or unauthorized purpose{'\n'}
                • Maintain the confidentiality of your device and data
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>4. Content and Intellectual Property</Text>
              <Text style={styles.bodyText}>
                • The Quran text is the word of Allah and is not subject to copyright{'\n'}
                • Audio recitations are provided by qualified reciters{'\n'}
                • The App's source code, design, and features are protected by intellectual property laws{'\n'}
                • You may not copy, distribute, or create derivative works from the App{'\n'}
                • Your personal progress data belongs to you
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>5. Religious Considerations</Text>
              <Text style={styles.bodyText}>
                • This App is designed to facilitate the memorization of the Holy Quran{'\n'}
                • We strive for accuracy in Quranic text and pronunciation{'\n'}
                • Users should consult qualified scholars for religious guidance{'\n'}
                • The App is a tool to aid memorization, not a replacement for traditional Islamic education{'\n'}
                • We respect all schools of Islamic thought and aim to be inclusive
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>6. Disclaimer of Warranties</Text>
              <Text style={styles.bodyText}>
                The App is provided "as is" without warranties of any kind. We do not guarantee:{'\n\n'}
                • Uninterrupted or error-free operation{'\n'}
                • Complete accuracy of all content{'\n'}
                • Compatibility with all devices{'\n'}
                • That the App will meet all your requirements
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>7. Limitation of Liability</Text>
              <Text style={styles.bodyText}>
                To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, loss of profits, or inability to use the App.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>8. Privacy</Text>
              <Text style={styles.bodyText}>
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the App, to understand our practices.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>9. Updates and Modifications</Text>
              <Text style={styles.bodyText}>
                We may:{'\n\n'}
                • Update the App to add new features or fix bugs{'\n'}
                • Modify these Terms at any time{'\n'}
                • Discontinue certain features{'\n\n'}
                Continued use of the App after updates constitutes acceptance of any changes.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>10. Termination</Text>
              <Text style={styles.bodyText}>
                You may stop using the App at any time by deleting it from your device. We may terminate or suspend access to our service immediately, without prior notice, for any reason whatsoever.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>11. Governing Law</Text>
              <Text style={styles.bodyText}>
                These Terms shall be interpreted and governed by the laws of the jurisdiction where the App developer is based, without regard to conflict of law provisions.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>12. Contact Information</Text>
              <Text style={styles.bodyText}>
                If you have any questions about these Terms of Service, please contact us at:{'\n\n'}
                Email: support@hifdhjourney.com{'\n'}
                Subject: Terms of Service Inquiry
              </Text>
            </View>

            <View style={styles.disclaimerSection}>
              <Text style={styles.disclaimerText}>
                By using Hifdh Journey, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004d24',
    textAlign: 'center',
    marginBottom: 10,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
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
    marginBottom: 12,
  },
  disclaimerSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
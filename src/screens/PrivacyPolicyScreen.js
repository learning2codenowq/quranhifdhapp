import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <SafeAreaProvider>
      <LinearGradient colors={['#004d24', '#058743']} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Privacy Policy</Text>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Privacy Policy for Hifdh Journey</Text>
              <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>1. Introduction</Text>
              <Text style={styles.bodyText}>
                Welcome to Hifdh Journey ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application Hifdh Journey (the "App"). Please read this privacy policy carefully.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>2. Information We Collect</Text>
              
              <Text style={styles.subHeader}>2.1 Personal Information</Text>
              <Text style={styles.bodyText}>
                • Your name (if provided during onboarding){'\n'}
                • Daily memorization goals and preferences
              </Text>
              
              <Text style={styles.subHeader}>2.2 Usage Data</Text>
              <Text style={styles.bodyText}>
                • Memorization progress and statistics{'\n'}
                • App usage patterns and preferences{'\n'}
                • Achievement data{'\n'}
                • Settings and configurations
              </Text>
              
              <Text style={styles.subHeader}>2.3 Device Information</Text>
              <Text style={styles.bodyText}>
                • Device type and operating system{'\n'}
                • App version information{'\n'}
                • Crash reports and error logs (if they occur)
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>3. How We Use Your Information</Text>
              <Text style={styles.bodyText}>
                We use the information we collect to:{'\n\n'}
                • Provide and maintain the App's functionality{'\n'}
                • Track your memorization progress{'\n'}
                • Personalize your experience{'\n'}
                • Calculate statistics and achievements{'\n'}
                • Improve app performance and fix bugs{'\n'}
                • Provide customer support
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>4. Data Storage and Security</Text>
              <Text style={styles.bodyText}>
                • All your memorization data is stored locally on your device{'\n'}
                • We do not transmit your personal progress to external servers{'\n'}
                • Your data remains private and under your control{'\n'}
                • We implement appropriate security measures to protect your information
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>5. Third-Party Services</Text>
              <Text style={styles.bodyText}>
                Our app may use third-party services for:{'\n\n'}
                • Quran text and audio (from public APIs){'\n'}
                • Crash reporting and analytics{'\n'}
                • App performance monitoring{'\n\n'}
                These services have their own privacy policies, and we encourage you to review them.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>6. Data Sharing</Text>
              <Text style={styles.bodyText}>
                We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:{'\n\n'}
                • With your explicit consent{'\n'}
                • To comply with legal obligations{'\n'}
                • To protect our rights and the safety of users
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>7. Children's Privacy</Text>
              <Text style={styles.bodyText}>
                Our App is suitable for users of all ages, including children. We do not knowingly collect personal information from children under 13 without parental consent. If you are a parent and believe your child has provided personal information, please contact us.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>8. Your Rights</Text>
              <Text style={styles.bodyText}>
                You have the right to:{'\n\n'}
                • Access your data (stored locally on your device){'\n'}
                • Delete your data (through app settings){'\n'}
                • Export your data (backup feature){'\n'}
                • Contact us with privacy concerns
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>9. Changes to This Policy</Text>
              <Text style={styles.bodyText}>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy in the app. Changes are effective immediately upon posting.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>10. Contact Us</Text>
              <Text style={styles.bodyText}>
                If you have any questions about this Privacy Policy, please contact us at:{'\n\n'}
                Email: privacy@hifdhjourney.com{'\n'}
                Subject: Privacy Policy Inquiry
              </Text>
            </View>

            <View style={styles.disclaimerSection}>
              <Text style={styles.disclaimerText}>
                This privacy policy was generated for Hifdh Journey and is effective as of the date last updated above.
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
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004d24',
    marginBottom: 8,
    marginTop: 10,
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
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../styles/theme';

export default function PrivacyPolicyScreen({ navigation }) {
  return (
    <SafeAreaProvider>
      <LinearGradient colors={Theme.gradients.primary} style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Privacy Policy</Text>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            <TouchableOpacity 
    style={styles.viewOnlineButton}
    onPress={() => {
      const url = 'https://learning2codenowq.github.io/quran-hifdh-privacy/';
      Linking.openURL(url).catch(err => {
        Alert.alert('Error', 'Could not open privacy policy link');
      });
    }}
  >
    <Text style={styles.viewOnlineButtonText}>📄 View Online Version</Text>
  </TouchableOpacity>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Privacy Policy for Quran Hifdh</Text>
              <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>1. Introduction</Text>
              <Text style={styles.bodyText}>
                Welcome to Quran Hifdh ("we," "our," or "us"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application Quran Hifdh (the "App"). Please read this privacy policy carefully.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>2. Information We Collect</Text>
              
              <Text style={styles.subHeader}>2.1 Personal Information</Text>
              <Text style={styles.bodyText}>
                • Your name (if provided during onboarding){'\n'}
                • Daily memorization goals and preferences{'\n'}
                • App settings and configurations
              </Text>
              
              <Text style={styles.subHeader}>2.2 Usage Data</Text>
              <Text style={styles.bodyText}>
                • Memorization progress and statistics{'\n'}
                • App usage patterns and preferences{'\n'}
                • Achievement data and milestones{'\n'}
                • Reading and revision history{'\n'}
                • Audio playback preferences
              </Text>
              
              <Text style={styles.subHeader}>2.3 Device Information</Text>
              <Text style={styles.bodyText}>
                • Device type and operating system{'\n'}
                • App version information{'\n'}
                • Crash reports and error logs (only when errors occur){'\n'}
                • Performance data for app optimization
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>3. How We Use Your Information</Text>
              <Text style={styles.bodyText}>
                We use the information we collect to:{'\n\n'}
                • Provide and maintain the App's functionality{'\n'}
                • Track your memorization progress and statistics{'\n'}
                • Personalize your Quran learning experience{'\n'}
                • Calculate achievements and milestones{'\n'}
                • Optimize revision scheduling based on your progress{'\n'}
                • Improve app performance and fix bugs{'\n'}
                • Provide technical support when requested{'\n'}
                • Understand how users interact with the app to improve features
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>4. Data Storage and Security</Text>
              <Text style={styles.bodyText}>
                • All your memorization data is stored locally on your device{'\n'}
                • We do not transmit your personal progress to external servers{'\n'}
                • Your data remains completely private and under your control{'\n'}
                • We implement appropriate security measures to protect your information{'\n'}
                • Your Quran memorization journey is between you, the app, and Allah{'\n'}
                • No third parties have access to your personal memorization data
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>5. Third-Party Services</Text>
              <Text style={styles.bodyText}>
                Our app may use third-party services for:{'\n\n'}
                • Quran text and audio content (from trusted Islamic sources){'\n'}
                • Crash reporting for app stability (anonymous data only){'\n'}
                • App performance monitoring{'\n'}
                • Audio streaming for recitations{'\n\n'}
                These services have their own privacy policies. We carefully select services that respect user privacy and Islamic values.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>6. Data Sharing</Text>
              <Text style={styles.bodyText}>
                We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:{'\n\n'}
                • With your explicit consent{'\n'}
                • To comply with legal obligations{'\n'}
                • To protect our rights and the safety of users{'\n'}
                • For technical support (only when you request help){'\n\n'}
                Your memorization progress, achievements, and personal settings are never shared with anyone without your permission.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>7. Children's Privacy</Text>
              <Text style={styles.bodyText}>
                Our App is designed to help Muslims of all ages memorize the Quran, including children. We take children's privacy seriously:{'\n\n'}
                • We do not knowingly collect personal information from children under 13 without parental consent{'\n'}
                • Parents should supervise their children's use of the app{'\n'}
                • If you are a parent and believe your child has provided personal information, please contact us{'\n'}
                • All data is stored locally and not transmitted to external servers
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>8. Your Rights</Text>
              <Text style={styles.bodyText}>
                You have complete control over your data:{'\n\n'}
                • Access your data (stored locally on your device){'\n'}
                • Delete your data (through app settings or by uninstalling){'\n'}
                • Export your data (backup feature for device transfers){'\n'}
                • Modify your settings and preferences at any time{'\n'}
                • Contact us with privacy concerns{'\n'}
                • Request data deletion from our support records
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>9. Islamic Considerations</Text>
              <Text style={styles.bodyText}>
                As a Muslim developer creating an app for the Muslim community:{'\n\n'}
                • We handle the sacred text of the Quran with utmost respect{'\n'}
                • Your memorization data is treated as an amanah (trust){'\n'}
                • We do not use your data for any purposes contrary to Islamic values{'\n'}
                • The app is designed to support your spiritual journey{'\n'}
                • We regularly make du'a for all users of this app
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>10. Changes to This Policy</Text>
              <Text style={styles.bodyText}>
                We may update this privacy policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any changes by:{'\n\n'}
                • Posting the new privacy policy in the app{'\n'}
                • Updating the "last updated" date{'\n'}
                • For significant changes, we may provide additional notification{'\n\n'}
                Changes are effective immediately upon posting.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>11. Contact Us</Text>
              <Text style={styles.bodyText}>
                If you have any questions about this Privacy Policy, please contact me directly:{'\n\n'}
                Email: shayanshehzadqureshi@gmail.com{'\n'}
                Subject: Quran Hifdh Privacy Policy{'\n\n'}
                I personally read and respond to every privacy-related inquiry. Your privacy is important to me, and I'm committed to addressing any concerns you may have.
              </Text>
            </View>

            <View style={styles.disclaimerSection}>
              <Text style={styles.disclaimerText}>
                This privacy policy reflects my commitment to protecting your privacy while helping you on your Quran memorization journey. May Allah accept our efforts and guide us all.
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
    color: Theme.colors.primary,
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
    color: Theme.colors.primary,
    marginBottom: 12,
  },
  subHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: Theme.colors.primary,
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
    borderColor: Theme.colors.secondary,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  viewOnlineButton: {
  backgroundColor: Theme.colors.secondary,
  borderRadius: 15,
  paddingVertical: 12,
  paddingHorizontal: 20,
  marginBottom: 20,
  alignItems: 'center',
  },
  viewOnlineButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  },
});
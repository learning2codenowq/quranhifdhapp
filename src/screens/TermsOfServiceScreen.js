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
              <Text style={styles.sectionTitle}>Terms of Service for Quran Hifdh</Text>
              <Text style={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>1. Acceptance of Terms</Text>
              <Text style={styles.bodyText}>
                By downloading, installing, or using the Quran Hifdh mobile application ("App"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the App.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>2. Description of Service</Text>
              <Text style={styles.bodyText}>
                Quran Hifdh is a mobile application designed to help Muslims memorize the Holy Quran through structured learning and revision methods. The App provides:{'\n\n'}
                • Complete Quran text with authentic Uthmanic script{'\n'}
                • High-quality audio recitations from qualified reciters{'\n'}
                • Progress tracking for memorization milestones{'\n'}
                • Personalized daily goals and reminders{'\n'}
                • Achievement system to motivate consistent practice{'\n'}
                • Analytics and statistics for your learning journey{'\n'}
                • Smart revision scheduling system based on proven methods{'\n'}
                • Audio replay features for enhanced learning
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>3. User Responsibilities</Text>
              <Text style={styles.bodyText}>
                You agree to:{'\n\n'}
                • Use the App for its intended purpose of Quran memorization and learning{'\n'}
                • Treat the sacred content of the Quran with utmost respect{'\n'}
                • Not attempt to modify, reverse engineer, or compromise the App's security{'\n'}
                • Not use the App for any illegal, unauthorized, or un-Islamic purpose{'\n'}
                • Maintain the confidentiality of your device and personal data{'\n'}
                • Report any bugs or issues to help improve the App for all users{'\n'}
                • Use the App in a manner consistent with Islamic principles
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>4. Content and Intellectual Property</Text>
              <Text style={styles.bodyText}>
                • The Holy Quran is the word of Allah (SWT) and is not subject to copyright{'\n'}
                • Audio recitations are provided by qualified reciters and used with respect{'\n'}
                • The App's source code, design, interface, and unique features are protected by intellectual property laws{'\n'}
                • You may not copy, distribute, modify, or create derivative works from the App{'\n'}
                • Your personal progress data and achievements belong to you{'\n'}
                • Screenshots and sharing of Quranic content for educational purposes is encouraged
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>5. Religious Considerations</Text>
              <Text style={styles.bodyText}>
                • This App is designed with deep respect for Islamic principles and the sacred nature of the Quran{'\n'}
                • We strive for accuracy in Quranic text, pronunciation, and Islamic content{'\n'}
                • Users should consult qualified Islamic scholars for religious guidance and verification{'\n'}
                • The App is a tool to aid memorization, not a replacement for traditional Islamic education under qualified teachers{'\n'}
                • We respect all authentic schools of Islamic thought and aim to be inclusive{'\n'}
                • Any Islamic content is provided for educational purposes based on mainstream Islamic scholarship
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>6. Data and Privacy</Text>
              <Text style={styles.bodyText}>
                • All your memorization progress is stored locally on your device{'\n'}
                • We do not collect or transmit your personal learning data to external servers{'\n'}
                • Your Quran memorization journey remains private between you and Allah{'\n'}
                • Anonymous usage statistics may be collected to improve app performance{'\n'}
                • Please refer to our Privacy Policy for detailed information about data handling
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>7. Disclaimer of Warranties</Text>
              <Text style={styles.bodyText}>
                The App is provided "as is" with the best intentions and effort. However, we do not guarantee:{'\n\n'}
                • Uninterrupted or completely error-free operation{'\n'}
                • 100% accuracy of all content (though we strive for perfection){'\n'}
                • Compatibility with all devices and operating system versions{'\n'}
                • That the App will meet all your individual learning needs{'\n'}
                • Availability of audio content in all network conditions{'\n\n'}
                We continuously work to improve the App and fix any issues that arise.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>8. Limitation of Liability</Text>
              <Text style={styles.bodyText}>
                To the maximum extent permitted by law, the developer (Shayan) shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:{'\n\n'}
                • Loss of data or memorization progress{'\n'}
                • Loss of time in your learning schedule{'\n'}
                • Inability to use the App during technical issues{'\n'}
                • Any decisions made based solely on app features{'\n\n'}
                This limitation applies even if we have been advised of the possibility of such damages.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>9. Updates and Modifications</Text>
              <Text style={styles.bodyText}>
                We are committed to constantly improving Quran Hifdh. We may:{'\n\n'}
                • Release regular updates with new features and improvements{'\n'}
                • Fix bugs and enhance performance{'\n'}
                • Modify these Terms to reflect new features or legal requirements{'\n'}
                • Discontinue certain features if they become problematic{'\n'}
                • Add new memorization tools and learning aids{'\n\n'}
                Continued use of the App after updates constitutes acceptance of any changes. We will notify users of significant changes through the app.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>10. Termination</Text>
              <Text style={styles.bodyText}>
                • You may stop using the App at any time by deleting it from your device{'\n'}
                • Your local data will be removed when you uninstall the App{'\n'}
                • We may discontinue the App or certain features with appropriate notice{'\n'}
                • These Terms remain in effect until terminated by either party{'\n'}
                • Sections relating to intellectual property and limitations of liability survive termination
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>11. Islamic Values and Community</Text>
              <Text style={styles.bodyText}>
                This App was created as a service to the Muslim ummah. By using it, you become part of a community of learners dedicated to memorizing Allah's words. We encourage:{'\n\n'}
                • Making du'a for fellow users and the developer{'\n'}
                • Sharing the App with other Muslims who might benefit{'\n'}
                • Providing respectful feedback to help improve the App{'\n'}
                • Using the App as part of a broader Islamic education{'\n'}
                • Remembering that the true success comes from Allah alone
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>12. Governing Law</Text>
              <Text style={styles.bodyText}>
                These Terms shall be interpreted and governed by applicable laws, while giving consideration to Islamic principles where relevant. Any disputes should first be resolved through respectful dialogue and Islamic mediation when possible.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeader}>13. Contact Information</Text>
              <Text style={styles.bodyText}>
                If you have any questions about these Terms of Service, please contact me directly:{'\n\n'}
                Email: shayanshehzadqureshi@gmail.com{'\n'}
                Subject: Quran Hifdh Terms of Service{'\n\n'}
                I personally read every email and will respond as soon as possible, insha'Allah. Your feedback and questions help make this App better for the entire Muslim community.
              </Text>
            </View>

            <View style={styles.disclaimerSection}>
              <Text style={styles.disclaimerText}>
                By using Quran Hifdh, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.{'\n\n'}
                May Allah accept your efforts in memorizing His book and grant you success in this world and the next. Ameen.
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
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
});
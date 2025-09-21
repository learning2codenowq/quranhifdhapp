import React, { useEffect } from 'react';
import { loadFonts } from './src/utils/FontLoader';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import QuranReaderScreen from './src/screens/QuranReaderScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import TikrarActivityScreen from './src/screens/TikrarActivityScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import ErrorBoundary from './src/components/ErrorBoundary';
import SurahListScreen from './src/screens/SurahListScreen';
import ReadingScreen from './src/screens/ReadingScreen';
import BottomNavigation from './src/components/BottomNavigation';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from './src/screens/TermsOfServiceScreen';
import AboutScreen from './src/screens/AboutScreen';

const Stack = createStackNavigator();

export default function App() {
  const [currentRoute, setCurrentRoute] = React.useState('Onboarding');
  const [showBottomNav, setShowBottomNav] = React.useState(false);
  const [showSplash, setShowSplash] = React.useState(true);
  const navigationRef = React.useRef();
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  const onStateChange = (state) => {
    if (state) {
      const routeName = state.routes[state.index].name;
      console.log('Navigation changed to:', routeName);
      setCurrentRoute(routeName);
      
      // Hide bottom nav on certain screens
      const hideNavScreens = [
        'Onboarding',
        'SurahList', 
        'QuranReader', 
        'Analytics', 
        'Achievements',
        'TikrarActivity'
      ];
      
      const shouldHideNav = hideNavScreens.includes(routeName);
      console.log('Should hide nav:', shouldHideNav, 'for route:', routeName);
      setShowBottomNav(!shouldHideNav);
    }
  };

  const handleNavigate = (routeName) => {
    if (navigationRef.current) {
      navigationRef.current.navigate(routeName);
    }
  };

  const handleSplashComplete = async () => {
    const loaded = await loadFonts();
    setFontsLoaded(loaded);
    setShowSplash(false);
  };

  // Show splash screen first
  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <NavigationContainer ref={navigationRef} onStateChange={onStateChange}>
          <Stack.Navigator 
  initialRouteName="Onboarding" 
  screenOptions={{ headerShown: false }}
>
  <Stack.Screen name="Onboarding" component={OnboardingScreen} />
  <Stack.Screen name="Dashboard" component={DashboardScreen} />
  <Stack.Screen name="Reading" component={ReadingScreen} />
  <Stack.Screen name="QuranReader" component={QuranReaderScreen} />
  <Stack.Screen name="Settings" component={SettingsScreen} />
  <Stack.Screen name="TikrarActivity" component={TikrarActivityScreen} />
  <Stack.Screen name="Achievements" component={AchievementsScreen} />
  <Stack.Screen name="Analytics" component={AnalyticsScreen} />
  <Stack.Screen name="SurahList" component={SurahListScreen} />
  <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
  <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
  <Stack.Screen name="About" component={AboutScreen} />
</Stack.Navigator>
        </NavigationContainer>

        {showBottomNav && (
          <BottomNavigation 
            currentRoute={currentRoute}
            onNavigate={handleNavigate}
          />
        )}
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
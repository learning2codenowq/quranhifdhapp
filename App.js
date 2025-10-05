import React, { useEffect } from 'react';
import { loadFonts } from './src/utils/FontLoader';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
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
import ClassicMushafScreen from './src/screens/ClassicMushafScreen';
import BottomNavigation from './src/components/BottomNavigation';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from './src/screens/TermsOfServiceScreen';
import AboutScreen from './src/screens/AboutScreen';
import { StorageService } from './src/services/StorageService';
import { Logger } from './src/utils/Logger';
import { StatusBar } from 'expo-status-bar';



const Stack = createStackNavigator();

export default function App() {
  const [currentRoute, setCurrentRoute] = React.useState('Dashboard');
  const [showBottomNav, setShowBottomNav] = React.useState(false);
  const [showSplash, setShowSplash] = React.useState(true);
  const [isFirstTime, setIsFirstTime] = React.useState(null);
  const navigationRef = React.useRef();
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  useEffect(() => {
    checkFirstTimeUser();
  }, []);

  const checkFirstTimeUser = async () => {
    try {
      const state = await StorageService.getState();
      const isNewUser = !state || !state.settings || !state.settings.userName;
      setIsFirstTime(isNewUser);
      
      if (isNewUser) {
        setCurrentRoute('Onboarding');
        setShowBottomNav(false);
      } else {
        setCurrentRoute('Dashboard');
        setShowBottomNav(true); // Show bottom nav for returning users
      }
      
      Logger.log('First time user check:', { isNewUser, hasState: !!state });
    } catch (error) {
      Logger.error('Error checking first time user:', error);
      setIsFirstTime(true);
      setCurrentRoute('Onboarding');
      setShowBottomNav(false);
    }
  };

  const shouldShowBottomNav = (routeName) => {
    const hideNavScreens = [
      'Onboarding',
      'SurahList', 
      'QuranReader', 
      'Analytics', 
      'Achievements',
      'TikrarActivity',
      'PrivacyPolicy',
      'TermsOfService',
      'About'
    ];
    
    return !hideNavScreens.includes(routeName);
  };

  const onStateChange = (state) => {
    if (state) {
      const routeName = state.routes[state.index].name;
      console.log('Navigation changed to:', routeName);
      setCurrentRoute(routeName);
      
      const shouldShow = shouldShowBottomNav(routeName);
      console.log('Should show nav:', shouldShow, 'for route:', routeName);
      setShowBottomNav(shouldShow);
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

  // Show loading if we haven't determined first time status yet
  if (isFirstTime === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#22575D' }}>
        <ActivityIndicator size="large" color="#d4af37" />
        <Text style={{ color: 'white', marginTop: 16 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <StatusBar style="light" />
      <View style={styles.container}>
        <NavigationContainer ref={navigationRef} onStateChange={onStateChange}>
          <Stack.Navigator 
            initialRouteName={isFirstTime ? "Onboarding" : "Dashboard"} 
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Reading" component={ReadingScreen} />
            <Stack.Screen name="ClassicMushaf" component={ClassicMushafScreen} />
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
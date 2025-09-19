import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
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
import { useFonts, Amiri_400Regular, Amiri_700Bold } from '@expo-google-fonts/amiri';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    Amiri_400Regular,
    Amiri_700Bold,
  });
  
  const [currentRoute, setCurrentRoute] = React.useState('Dashboard');
  const [showBottomNav, setShowBottomNav] = React.useState(true);
  const navigationRef = React.useRef();

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  const onStateChange = (state) => {
    if (state) {
      const routeName = state.routes[state.index].name;
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
      setShowBottomNav(!hideNavScreens.includes(routeName));
    }
  };

  const handleNavigate = (routeName) => {
    if (navigationRef.current) {
      navigationRef.current.navigate(routeName);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <NavigationContainer ref={navigationRef} onStateChange={onStateChange}>
          <Stack.Navigator initialRouteName="Onboarding" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Reading" component={ReadingScreen} />
            <Stack.Screen name="QuranReader" component={QuranReaderScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="TikrarActivity" component={TikrarActivityScreen} />
            <Stack.Screen name="Achievements" component={AchievementsScreen} />
            <Stack.Screen name="Analytics" component={AnalyticsScreen} />
            <Stack.Screen name="SurahList" component={SurahListScreen} />
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
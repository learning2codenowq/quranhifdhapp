import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const LoadingState = ({ 
  message = 'Loading...', 
  fullScreen = false,
  darkMode = false,
  size = 'large',
  showMessage = true 
}) => {
  const colors = darkMode 
    ? ['#1a1a2e', '#16213e', '#0f3460']
    : ['#004d24', '#058743'];

  const Container = fullScreen ? LinearGradient : View;
  const containerProps = fullScreen 
    ? { colors, style: styles.fullScreenContainer }
    : { style: styles.inlineContainer };

  return (
    <Container {...containerProps}>
      <View style={styles.content}>
        <ActivityIndicator 
          size={size} 
          color="#d4af37" 
          style={styles.spinner}
        />
        {showMessage && (
          <Text style={[
            styles.message, 
            darkMode && styles.darkMessage
          ]}>
            {message}
          </Text>
        )}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 12,
    fontWeight: '500',
  },
  darkMessage: {
    color: '#cbd5e1',
  },
});

export default LoadingState;
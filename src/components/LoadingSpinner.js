import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoadingSpinner({ message = 'Loading...', visible = true }) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <LinearGradient colors={['#004d24', '#058743']} style={styles.container}>
        <ActivityIndicator size="large" color="#d4af37" />
        <Text style={styles.message}>{message}</Text>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  container: {
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    minWidth: 150,
  },
  message: {
    color: 'white',
    fontSize: 16,
    marginTop: 15,
    textAlign: 'center',
  },
});
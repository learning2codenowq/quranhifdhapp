import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AnimatedProgressRing({ percentage, size = 200 }) {
  const safePercentage = Number(percentage) || 0;
  
  return (
    <View style={styles.container}>
      <View style={styles.progressBackground}>
        <View 
          style={[
            styles.progressFill,
            { width: `${Math.min(100, Math.max(0, safePercentage))}%` }
          ]} 
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.percentageText}>
          {safePercentage.toFixed(1)}%
        </Text>
        <Text style={styles.labelText}>Complete</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    width: 200,
    height: 100,
  },
  progressBackground: {
    width: '100%',
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 40,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#d4af37',
    borderRadius: 38,
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  labelText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
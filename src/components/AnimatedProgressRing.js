import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function AnimatedProgressRing({ percentage, size = 200 }) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    // Animate the progress
    Animated.timing(animatedValue, {
      toValue: percentage,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    // Animate the scale for a nice entrance
    Animated.spring(scaleValue, {
      toValue: 1,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [percentage]);

  const progressWidth = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View 
      style={[
        styles.container, 
        { 
          width: size, 
          height: size / 2,
          transform: [{ scale: scaleValue }]
        }
      ]}
    >
      <View style={styles.progressBackground}>
        <Animated.View 
          style={[
            styles.progressFill,
            { width: progressWidth }
          ]} 
        />
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.percentageText}>
          {percentage.toFixed(1)}%
        </Text>
        <Text style={styles.labelText}>Complete</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
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
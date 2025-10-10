import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Theme } from '../styles/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default function AnimatedProgressRing({ percentage, size = 160, darkMode = false }) {
  const safePercentage = Number(percentage) || 0;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: safePercentage,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

    // Glow pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [safePercentage]);

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View style={[
      styles.container,
      { transform: [{ scale: scaleAnim }] }
    ]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={darkMode ? "#55BAC6" : "#d4af37"} stopOpacity="1" />
            <Stop offset="100%" stopColor={darkMode ? "#22575D" : "#f4d03f"} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(34, 87, 93, 0.15)"}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Glow Circle (behind progress) */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth + 4}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          opacity={glowOpacity}
        />
        
        {/* Progress Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      <View style={styles.textContainer}>
        <Text style={[
          styles.percentageText,
          darkMode && { color: '#E8ECEC' }
        ]}>
          {safePercentage.toFixed(1)}%
        </Text>
        <Text style={[
          styles.labelText,
          darkMode && { color: 'rgba(255, 255, 255, 0.8)' }
        ]}>
          Complete
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  svg: {
    transform: [{ scaleX: 1 }],
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: 4,
  },
  labelText: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
    fontWeight: '500',
  },
});
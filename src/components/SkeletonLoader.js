import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const SkeletonLine = ({ width = '100%', height = 20, style, borderRadius = 8, darkMode = false }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    
    animate();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-350, 350],
  });

  return (
    <View
  style={[
    styles.skeletonLine,
    {
      width,
      height,
      borderRadius,
      backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
    },
    style,
  ]}
>
      <Animated.View
  style={[
    styles.shimmer,
    {
      transform: [{ translateX }],
      backgroundColor: darkMode 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(255, 255, 255, 0.9)',
    },
  ]}
/>
    </View>
  );
};

export const SkeletonCircle = ({ size = 60, darkMode = false }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    
    animate();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-size * 2, size * 2],
  });

  return (
    <View
  style={[
    styles.skeletonCircle,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.08)',
      overflow: 'hidden',
    },
  ]}
>
      <Animated.View
  style={[
    styles.shimmer,
    {
      transform: [{ translateX }],
      backgroundColor: darkMode 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(255, 255, 255, 0.9)',
    },
  ]}
/>
    </View>
  );
};

export const DashboardSkeleton = ({ darkMode = false }) => (
  <View style={styles.dashboardSkeleton}>
    {/* Header Skeleton */}
    <View style={styles.headerSkeleton}>
      <SkeletonLine width="60%" height={20} style={styles.centerSkeleton} darkMode={darkMode} />
      <SkeletonLine width="40%" height={14} style={[styles.centerSkeleton, { marginTop: 8 }]} darkMode={darkMode} />
      <SkeletonLine width="70%" height={32} style={[styles.centerSkeleton, { marginTop: 16 }]} darkMode={darkMode} />
    </View>

    {/* Streak Card Skeleton */}
    <View style={[
      styles.streakCardSkeleton,
      darkMode && { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
    ]}>
      <SkeletonCircle size={48} darkMode={darkMode} />
      <View style={styles.streakTextSkeleton}>
        <SkeletonLine width={60} height={24} darkMode={darkMode} />
        <SkeletonLine width={80} height={12} style={{ marginTop: 4 }} darkMode={darkMode} />
      </View>
    </View>

    {/* Progress Ring Skeleton */}
    <View style={styles.progressSkeleton}>
      <SkeletonCircle size={160} darkMode={darkMode} />
      <SkeletonLine width="50%" height={16} style={{ marginTop: 16, alignSelf: 'center' }} darkMode={darkMode} />
    </View>

    {/* Button Skeleton */}
    <SkeletonLine width="100%" height={56} borderRadius={30} style={{ marginBottom: 32, marginTop: 32 }} darkMode={darkMode} />

    {/* Stats Grid Skeleton */}
    <View style={styles.statsGridSkeleton}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={[
          styles.statCardSkeleton,
          darkMode && { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
        ]}>
          <SkeletonCircle size={48} darkMode={darkMode} />
          <SkeletonLine width="60%" height={28} style={{ marginTop: 12, alignSelf: 'center' }} darkMode={darkMode} />
          <SkeletonLine width="80%" height={14} style={{ marginTop: 8, alignSelf: 'center' }} darkMode={darkMode} />
          <SkeletonLine width="60%" height={12} style={{ marginTop: 4, alignSelf: 'center' }} darkMode={darkMode} />
        </View>
      ))}
    </View>
  </View>
);

export const SurahListSkeleton = ({ darkMode = false }) => (
  <View style={styles.surahListSkeleton}>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <View key={i} style={[
        styles.surahCardSkeleton,
        darkMode && { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
      ]}>
        <SkeletonCircle size={48} darkMode={darkMode} />
        <View style={styles.surahInfoSkeleton}>
          <SkeletonLine width="70%" height={18} darkMode={darkMode} />
          <SkeletonLine width="50%" height={14} style={{ marginTop: 8 }} darkMode={darkMode} />
          <SkeletonLine width="40%" height={12} style={{ marginTop: 6 }} darkMode={darkMode} />
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  skeletonLine: {
    position: 'relative',
  },
  skeletonCircle: {
    position: 'relative',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  dashboardSkeleton: {
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  headerSkeleton: {
    alignItems: 'center',
    marginBottom: 32,
  },
  centerSkeleton: {
    alignSelf: 'center',
  },
  streakCardSkeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: 32,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 200,
  },
  streakTextSkeleton: {
    marginLeft: 16,
  },
  progressSkeleton: {
    alignItems: 'center',
    marginBottom: 32,
  },
  statsGridSkeleton: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCardSkeleton: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  surahListSkeleton: {
    paddingHorizontal: 20,
  },
  surahCardSkeleton: {
  backgroundColor: 'rgba(240, 240, 240, 0.95)',
  borderRadius: 20,
  padding: 20,
  marginBottom: 12,
  flexDirection: 'row',
  alignItems: 'center',
},
  surahInfoSkeleton: {
    flex: 1,
    marginLeft: 16,
  },
});
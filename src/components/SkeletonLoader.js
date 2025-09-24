import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const SkeletonLine = ({ width = '100%', height = 20, style, borderRadius = 8 }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeletonLine,
        {
          width,
          height,
          opacity,
          borderRadius,
        },
        style,
      ]}
    />
  );
};

export const SkeletonCircle = ({ size = 60 }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };
    
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.skeletonCircle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          opacity,
        },
      ]}
    />
  );
};

export const DashboardSkeleton = () => (
  <View style={styles.dashboardSkeleton}>
    {/* Header Skeleton */}
    <View style={styles.headerSkeleton}>
      <SkeletonLine width="60%" height={20} style={styles.centerSkeleton} />
      <SkeletonLine width="40%" height={14} style={[styles.centerSkeleton, { marginTop: 8 }]} />
      <SkeletonLine width="70%" height={32} style={[styles.centerSkeleton, { marginTop: 16 }]} />
    </View>

    {/* Streak Card Skeleton */}
    <View style={styles.streakCardSkeleton}>
      <SkeletonCircle size={48} />
      <View style={styles.streakTextSkeleton}>
        <SkeletonLine width={60} height={24} />
        <SkeletonLine width={80} height={12} style={{ marginTop: 4 }} />
      </View>
    </View>

    {/* Progress Ring Skeleton */}
    <View style={styles.progressSkeleton}>
      <SkeletonCircle size={160} />
      <SkeletonLine width="50%" height={16} style={{ marginTop: 16, alignSelf: 'center' }} />
    </View>

    {/* Button Skeleton */}
    <SkeletonLine width="100%" height={56} borderRadius={30} style={{ marginBottom: 32, marginTop: 32 }} />

    {/* Stats Grid Skeleton */}
    <View style={styles.statsGridSkeleton}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.statCardSkeleton}>
          <SkeletonCircle size={48} />
          <SkeletonLine width="60%" height={28} style={{ marginTop: 12, alignSelf: 'center' }} />
          <SkeletonLine width="80%" height={14} style={{ marginTop: 8, alignSelf: 'center' }} />
          <SkeletonLine width="60%" height={12} style={{ marginTop: 4, alignSelf: 'center' }} />
        </View>
      ))}
    </View>
  </View>
);

export const SurahListSkeleton = () => (
  <View style={styles.surahListSkeleton}>
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <View key={i} style={styles.surahCardSkeleton}>
        <SkeletonCircle size={48} />
        <View style={styles.surahInfoSkeleton}>
          <SkeletonLine width="70%" height={18} />
          <SkeletonLine width="50%" height={14} style={{ marginTop: 8 }} />
          <SkeletonLine width="40%" height={12} style={{ marginTop: 6 }} />
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  skeletonLine: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  skeletonCircle: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
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
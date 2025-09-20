import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const SkeletonLine = ({ width = '100%', height = 20, style }) => {
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
        },
        style,
      ]}
    />
  );
};

export const SurahCardSkeleton = () => (
  <View style={styles.surahCardSkeleton}>
    <View style={styles.surahHeaderSkeleton}>
      <SkeletonLine width={50} height={24} style={styles.surahNumber} />
      <View style={styles.surahNamesSkeleton}>
        <SkeletonLine width="60%" height={18} />
        <SkeletonLine width="40%" height={16} style={{ marginTop: 5 }} />
      </View>
      <View style={styles.surahMetaSkeleton}>
        <SkeletonLine width={60} height={12} />
        <SkeletonLine width={80} height={14} style={{ marginTop: 4 }} />
      </View>
    </View>
  </View>
);

export const AyahSkeleton = () => (
  <View style={styles.ayahSkeleton}>
    <SkeletonLine width={40} height={16} style={styles.ayahNumberSkeleton} />
    <SkeletonLine width="100%" height={20} style={{ marginTop: 10 }} />
    <SkeletonLine width="80%" height={20} style={{ marginTop: 5 }} />
    <SkeletonLine width="60%" height={16} style={{ marginTop: 15 }} />
    <SkeletonLine width="40%" height={16} style={{ marginTop: 5 }} />
    <View style={styles.controlsSkeleton}>
      <SkeletonLine width={60} height={40} style={styles.controlButton} />
      <SkeletonLine width={120} height={40} style={styles.controlButton} />
    </View>
  </View>
);

export const DashboardSkeleton = () => (
  <View style={styles.dashboardSkeleton}>
    <SkeletonLine width="70%" height={24} style={{ alignSelf: 'center', marginBottom: 20 }} />
    <SkeletonLine width={200} height={80} style={{ alignSelf: 'center', marginBottom: 30, borderRadius: 40 }} />
    <View style={styles.statsSkeleton}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.statCardSkeleton}>
          <SkeletonLine width="60%" height={20} />
          <SkeletonLine width="40%" height={14} style={{ marginTop: 5 }} />
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  skeletonLine: {
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  surahCardSkeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
  },
  surahHeaderSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surahNumber: {
    borderRadius: 20,
    marginRight: 15,
  },
  surahNamesSkeleton: {
    flex: 1,
  },
  surahMetaSkeleton: {
    alignItems: 'flex-end',
  },
  ayahSkeleton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    position: 'relative',
  },
  ayahNumberSkeleton: {
    position: 'absolute',
    top: -8,
    right: 20,
    borderRadius: 18,
  },
  controlsSkeleton: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15,
    marginTop: 20,
  },
  controlButton: {
    borderRadius: 25,
  },
  dashboardSkeleton: {
    padding: 20,
  },
  statsSkeleton: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCardSkeleton: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
});
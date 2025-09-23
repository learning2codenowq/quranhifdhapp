import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Theme } from '../styles/theme';
import { Icon, AppIcons } from './Icon';

export default function BottomNavigation({ currentRoute, onNavigate }) {
  const tabs = [
    { 
      key: 'Dashboard', 
      label: 'Home', 
      icon: AppIcons.home,
      route: 'Dashboard'
    },
    { 
      key: 'Reading', 
      label: 'Reading', 
      icon: AppIcons.book,
      route: 'Reading'
    },
    { 
      key: 'Settings', 
      label: 'Settings', 
      icon: AppIcons.settings,
      route: 'Settings'
    }
  ];

  const handleTabPress = (tab) => {
    if (currentRoute !== tab.route) {
      onNavigate(tab.route);
    }
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <View style={styles.tabContainer}>
        {tabs.map((tab) => {
          const isActive = currentRoute === tab.route;
          
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.activeTab]}
              onPress={() => handleTabPress(tab)}
            >
              <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
                <Icon 
                  name={tab.icon.name}
                  type={tab.icon.type}
                  size={22} 
                  color={isActive ? Theme.colors.textOnPrimary : Theme.colors.textMuted} 
                />
              </View>
              <Text style={[styles.label, isActive && styles.activeLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.white,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.gray200,
    ...Theme.shadows.xl,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.sm,
    paddingTop: Theme.spacing.sm,
    paddingBottom: Theme.spacing.xs,
    height: Theme.layout.bottomTabHeight,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
  },
  activeTab: {
    // Active tab styling handled by individual elements
  },
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Theme.borderRadius.full,
    marginBottom: Theme.spacing.xs,
  },
  activeIconContainer: {
    backgroundColor: Theme.colors.primary,
    ...Theme.shadows.md,
  },
  label: {
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.textMuted,
    fontWeight: Theme.typography.fontWeight.medium,
  },
  activeLabel: {
    color: Theme.colors.primary,
    fontWeight: Theme.typography.fontWeight.semibold,
  },
});
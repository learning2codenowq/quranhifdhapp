import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BottomNavigation({ currentRoute, onNavigate }) {
  const tabs = [
    { 
      key: 'Dashboard', 
      label: 'Home', 
      icon: '🏠',
      route: 'Dashboard'
    },
    { 
      key: 'Reading', 
      label: 'Reading', 
      icon: '📖',
      route: 'Reading'
    },
    { 
      key: 'Settings', 
      label: 'Settings', 
      icon: '⚙️',
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
                <Text style={[styles.icon, isActive && styles.activeIcon]}>
                  {tab.icon}
                </Text>
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
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeTab: {
    // Active tab styling handled by individual elements
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 4,
  },
  activeIconContainer: {
    backgroundColor: '#004d24',
  },
  icon: {
    fontSize: 20,
  },
  activeIcon: {
    fontSize: 20,
  },
  label: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#004d24',
    fontWeight: '600',
  },
});
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '../Icon';
import { Theme } from '../../styles/theme';

export default function ReplayProgressBar({ 
  replayState, 
  onStop, 
  darkMode, 
  themedColors 
}) {
  if (!replayState.isActive) {
    return null;
  }

  const { currentAyah, currentRepetition, totalRepetitions, startAyah, endAyah } = replayState;

  return (
    <View style={[
      styles.container,
      darkMode && { backgroundColor: themedColors.cardBackground }
    ]}>
      <View style={styles.infoSection}>
        <Text style={[
          styles.text,
          darkMode && { color: themedColors.textPrimary }
        ]}>
          Ayah {currentAyah} of {startAyah}-{endAyah}
        </Text>
        <Text style={[
          styles.text,
          darkMode && { color: themedColors.textPrimary }
        ]}>
          Repetition {currentRepetition}/{totalRepetitions}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.stopButton,
          darkMode && { backgroundColor: themedColors.surface }
        ]}
        onPress={onStop}
      >
        <Icon 
          name="stop-circle" 
          type="Ionicons"
          size={24} 
          color={darkMode ? themedColors.accent : Theme.colors.error} 
        />
        <Text style={[
          styles.stopText,
          darkMode && { color: themedColors.accent }
        ]}>
          Stop
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoSection: {
    flex: 1,
  },
  text: {
    color: Theme.colors.textOnDark,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  stopButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.colors.error,
  },
  stopText: {
    color: Theme.colors.error,
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
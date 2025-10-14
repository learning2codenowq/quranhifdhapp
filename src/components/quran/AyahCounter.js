import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '../Icon';
import { Theme } from '../../styles/theme';

const AyahCounter = ({ 
  count,
  onIncrement,
  onReset,
  darkMode,
  themedColors 
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.counterButton,
          darkMode && { backgroundColor: themedColors.cardBackground }
        ]}
        onPress={onIncrement}
      >
        <Text style={[
          styles.counterLabel,
          darkMode && { color: themedColors.textSecondary }
        ]}>
          COUNTER
        </Text>
        <Text style={[
          styles.counterNumber,
          darkMode && { color: themedColors.textPrimary }
        ]}>
          {count}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.resetButton,
          darkMode && { backgroundColor: themedColors.surface }
        ]}
        onPress={onReset}
      >
        <Icon 
          name="refresh" 
          type="Ionicons"
          size={20} 
          color={darkMode ? themedColors.textSecondary : '#FFFFFF'} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counterButton: {
    backgroundColor: '#2C3E3F',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    minWidth: 140,
    alignItems: 'center',
    ...Theme.shadows.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  counterLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  counterNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  resetButton: {
    backgroundColor: '#556B6D',
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    ...Theme.shadows.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});
export default React.memo(AyahCounter);
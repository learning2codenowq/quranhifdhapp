import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '../Icon';
import { Theme } from '../../styles/theme';

const AudioControls = ({ isPlaying, onPress, darkMode }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPlaying && styles.activeButton
      ]}
      onPress={onPress}
    >
      <Icon 
        name={isPlaying ? 'pause' : 'play'} 
        type="Ionicons"
        size={24} 
        color="white" 
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Theme.colors.primary,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  activeButton: {
    backgroundColor: Theme.colors.success,
    transform: [{ scale: 1.05 }],
  },
});
export default React.memo(AudioControls);
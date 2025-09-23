import React from 'react';
import { Ionicons, MaterialIcons, FontAwesome5, AntDesign, Feather } from '@expo/vector-icons';

export const Icon = ({ 
  name, 
  size = 24, 
  color = '#000', 
  type = 'Ionicons',
  style,
  ...props 
}) => {
  const IconComponent = {
    Ionicons,
    MaterialIcons,
    FontAwesome5,
    AntDesign,
    Feather,
  }[type] || Ionicons;

  return <IconComponent name={name} size={size} color={color} style={style} {...props} />;
};

// Pre-defined icon sets for consistent usage
export const AppIcons = {
  // Navigation
  home: { name: 'home', type: 'Ionicons' },
  book: { name: 'book', type: 'Ionicons' },
  settings: { name: 'settings', type: 'Ionicons' },
  back: { name: 'chevron-back', type: 'Ionicons' },
  close: { name: 'close', type: 'Ionicons' },
  
  // Audio Controls
  play: { name: 'play', type: 'Ionicons' },
  pause: { name: 'pause', type: 'Ionicons' },
  stop: { name: 'stop', type: 'Ionicons' },
  repeat: { name: 'repeat', type: 'Ionicons' },
  
  // Actions
  checkmark: { name: 'checkmark-circle', type: 'Ionicons' },
  add: { name: 'add-circle', type: 'Ionicons' },
  bookmark: { name: 'bookmark', type: 'Ionicons' },
  share: { name: 'share-social', type: 'Ionicons' },
  
  // Stats & Progress
  trophy: { name: 'trophy', type: 'Ionicons' },
  medal: { name: 'medal', type: 'Ionicons' },
  star: { name: 'star', type: 'Ionicons' },
  flame: { name: 'flame', type: 'Ionicons' },
  trending: { name: 'trending-up', type: 'Ionicons' },
  calendar: { name: 'calendar', type: 'Ionicons' },
  stats: { name: 'stats-chart', type: 'Ionicons' },
  
  // Islamic
  mosque: { name: 'moon', type: 'Ionicons' }, // Using moon as mosque substitute
  quran: { name: 'library', type: 'Ionicons' },
  
  // UI Elements
  eye: { name: 'eye', type: 'Ionicons' },
  eyeOff: { name: 'eye-off', type: 'Ionicons' },
  heart: { name: 'heart', type: 'Ionicons' },
  help: { name: 'help-circle', type: 'Ionicons' },
  info: { name: 'information-circle', type: 'Ionicons' },
  warning: { name: 'warning', type: 'Ionicons' },
  success: { name: 'checkmark-circle', type: 'Ionicons' },
};
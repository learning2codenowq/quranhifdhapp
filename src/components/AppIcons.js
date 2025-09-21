import React from 'react';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export const AppIcons = {
  // Navigation Icons
  Home: (props) => <Ionicons name="home" {...props} />,
  Book: (props) => <Ionicons name="book" {...props} />,
  Settings: (props) => <Ionicons name="settings" {...props} />,
  
  // Audio Icons
  Play: (props) => <Ionicons name="play" {...props} />,
  Pause: (props) => <Ionicons name="pause" {...props} />,
  Stop: (props) => <Ionicons name="stop" {...props} />,
  
  // Action Icons
  CheckMark: (props) => <Ionicons name="checkmark-circle" {...props} />,
  Add: (props) => <Ionicons name="add-circle" {...props} />,
  Remove: (props) => <Ionicons name="remove-circle" {...props} />,
  
  // Achievement Icons
  Trophy: (props) => <FontAwesome5 name="trophy" {...props} />,
  Medal: (props) => <FontAwesome5 name="medal" {...props} />,
  Star: (props) => <Ionicons name="star" {...props} />,
  
  // Stats Icons
  Analytics: (props) => <Ionicons name="analytics" {...props} />,
  Calendar: (props) => <Ionicons name="calendar" {...props} />,
  TrendingUp: (props) => <Ionicons name="trending-up" {...props} />,
  
  // Navigation Arrows
  ArrowBack: (props) => <Ionicons name="arrow-back" {...props} />,
  ArrowForward: (props) => <Ionicons name="arrow-forward" {...props} />,
  
  // Islamic Icons
  Mosque: (props) => <FontAwesome5 name="mosque" {...props} />,
  Quran: (props) => <MaterialIcons name="menu-book" {...props} />,
  
  // Others
  Help: (props) => <Ionicons name="help-circle" {...props} />,
  Close: (props) => <Ionicons name="close" {...props} />,
  Refresh: (props) => <Ionicons name="refresh" {...props} />,
};
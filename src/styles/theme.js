import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Theme = {
  // Colors
  colors: {
    // Primary Brand Colors
    primary: '#052815ff',
    primaryLight: '#058743',
    secondary: '#d4af37',
    secondaryLight: '#f4d03f',
    
    // Success & Achievement Colors
    success: '#009c4a',
    successLight: '#e8f5e8',
    
    // Background Colors
    background: '#f8f9fa',
    cardBackground: 'rgba(255, 255, 255, 0.95)',
    overlay: 'rgba(0, 0, 0, 0.6)',
    
    // Text Colors
    textPrimary: '#2c3e50',
    textSecondary: '#5a6c7d',
    textMuted: '#95a5a6',
    textOnDark: '#ffffff',
    textOnPrimary: '#ffffff',
    
    // Status Colors
    warning: '#ffc107',
    error: '#e74c3c',
    info: '#3498db',
    
    // Neutral Colors
    white: '#ffffff',
    light: '#f8f9fa',
    gray100: '#f8f9fa',
    gray200: '#e9ecef',
    gray300: '#dee2e6',
    gray400: '#ced4da',
    gray500: '#adb5bd',
    gray600: '#6c757d',
    gray700: '#495057',
    gray800: '#343a40',
    gray900: '#212529',
  },
  
  // Typography
  typography: {
    // Font Families
    fontFamily: {
      regular: 'System',
      bold: 'System',
      arabic: 'UthmanicFont',
      arabicTitle: 'KFGQPC_Uthmanic_Script_HAFS_Regular',
    },
    
    // Font Sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 28,
      '4xl': 32,
      '5xl': 48,
      '6xl': 60,
    },
    
    // Font Weights
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    
    // Line Heights
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
      loose: 1.8,
    },
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
  },
  
  // Border Radius
  borderRadius: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 999,
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  // Layout
  layout: {
    screenWidth: width,
    screenHeight: height,
    cardPadding: 20,
    screenPadding: 20,
    headerHeight: 60,
    bottomTabHeight: 80,
  },
  
  // Gradients
  gradients: {
    primary: ['#052815ff', '#058743'],
    secondary: ['#d4af37', '#f4d03f'],
    success: ['#009c4a', '#4ade80'],
    overlay: ['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.4)'],
  },
};

// Helper functions
export const createCardStyle = (theme = Theme) => ({
  backgroundColor: theme.colors.cardBackground,
  borderRadius: theme.borderRadius.xl,
  padding: theme.spacing.xl,
  ...theme.shadows.md,
});

export const createButtonStyle = (variant = 'primary', theme = Theme) => {
  const baseStyle = {
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    ...theme.shadows.sm,
  };
  
  switch (variant) {
    case 'secondary':
      return {
        ...baseStyle,
        backgroundColor: theme.colors.secondary,
      };
    case 'success':
      return {
        ...baseStyle,
        backgroundColor: theme.colors.success,
      };
    default:
      return {
        ...baseStyle,
        backgroundColor: theme.colors.primary,
      };
  }
};
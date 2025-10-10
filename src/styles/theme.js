import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Theme = {
  // Colors
  // In src/styles/theme.js - Replace the entire "colors" section with this:

colors: {
  // Primary Brand Colors (Your Peaceful Teal)
  primary: '#22575D',
  primaryLight: '#55BAC6',
  secondary: '#d4af37',
  secondaryLight: '#f1cd57ff',
  
  // Success & Achievement Colors
  success: '#6B9B7C',
  successLight: '#E8F4EA',
  
  // Background Colors (Light Mode)
  background: '#FFFFFF',
  cardBackground: 'rgba(255, 255, 255, 0.95)',
  overlay: 'rgba(34, 87, 93, 0.6)',
  
  // Text Colors (Light Mode)
  textPrimary: '#2C3E3F',
  textSecondary: '#556B6D',
  textMuted: '#7A8E90',
  textOnDark: '#FFFFFF',
  textOnPrimary: '#FFFFFF',
  
  // Status Colors
  warning: '#D4A574',
  error: '#C87B7B',
  info: '#55BAC6',
  
  // Neutral Colors
  white: '#FFFFFF',
  light: '#F8FAFA',
  gray100: '#F5F7F7',
  gray200: '#E8ECEC',
  gray300: '#D1D9DA',
  gray400: '#A8B5B6',
  gray500: '#7A8E90',
  gray600: '#556B6D',
  gray700: '#3E5052',
  gray800: '#2C3E3F',
  gray900: '#1A2829',

  // DARK MODE COLORS (NEW)
  dark: {
    background: '#0F1419',
    cardBackground: '#1A1F26',
    surface: '#252C35',
    primary: '#55BAC6',
    secondary: '#E8C468',
    textPrimary: '#E8ECEC',
    textSecondary: '#A8B5B6',
    textMuted: '#7A8E90',
    border: '#2C3E3F',
    overlay: 'rgba(15, 20, 25, 0.9)',
    
    // Gradients for dark mode
    gradient1: '#1A1F26',
    gradient2: '#252C35',
  }
},
  
  // Typography
  typography: {
    // Font Families
    fontFamily: {
      regular: 'System',
      bold: 'System',
      arabic: 'UthmanicFont',
      arabicTitle: 'UthmanicFont',
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
  dark: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 8,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
      elevation: 8,
    },
  }
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

gradients: {
  primary: ['#22575D', '#55BAC6'],        // Dark teal to light teal
  secondary: ['#B8947D', '#D4C4B0'],      // Warm beige gradient
  success: ['#6B9B7C', '#8FBC9F'],        // Soft sage gradient
  overlay: ['rgba(34, 87, 93, 0.8)', 'rgba(85, 186, 198, 0.4)'], // Peaceful teal overlay
},
};

// Helper functions
export const createCardStyle = (theme = Theme) => ({
  backgroundColor: theme.colors.cardBackground,
  borderRadius: theme.borderRadius.xl,
  padding: theme.spacing.xl,
  ...theme.shadows.md,
});

export const getThemedColors = (isDarkMode) => {
  if (isDarkMode) {
    return {
      background: Theme.colors.dark.background,
      cardBackground: Theme.colors.dark.cardBackground,
      surface: Theme.colors.dark.surface,
      primary: Theme.colors.dark.primary,
      secondary: Theme.colors.dark.secondary,
      textPrimary: Theme.colors.dark.textPrimary,
      textSecondary: Theme.colors.dark.textSecondary,
      textMuted: Theme.colors.dark.textMuted,
      border: Theme.colors.dark.border,
      overlay: Theme.colors.dark.overlay,
      gradients: {
        primary: [Theme.colors.dark.gradient1, Theme.colors.dark.gradient2],
        secondary: [Theme.colors.dark.surface, Theme.colors.dark.cardBackground],
      },
      // ADD SHADOWS FOR DARK MODE
      shadows: Theme.shadows.dark,
    };
  }
  return {
    background: Theme.colors.background,
    cardBackground: Theme.colors.cardBackground,
    surface: Theme.colors.light,
    primary: Theme.colors.primary,
    secondary: Theme.colors.secondary,
    textPrimary: Theme.colors.textPrimary,
    textSecondary: Theme.colors.textSecondary,
    textMuted: Theme.colors.textMuted,
    border: Theme.colors.gray200,
    overlay: Theme.colors.overlay,
    gradients: Theme.gradients,
    shadows: Theme.shadows,
  };
};

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
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const Theme = {
  // Colors
  // In src/styles/theme.js - Replace the entire "colors" section with this:

colors: {
  // Primary Brand Colors (Your Peaceful Teal)
  primary: '#22575D',           // Dark teal - your main color
  primaryLight: '#55BAC6',      // Light teal - your accent color
  secondary: '#d4af37',         // Warm beige - complements teal beautifully
  secondaryLight: '#f1cd57ff',    // Lighter beige
  
  // Success & Achievement Colors (Soft & Peaceful)
  success: '#6B9B7C',          // Soft sage green
  successLight: '#E8F4EA',     // Very light sage
  
  // Background Colors (Clean & Peaceful)
  background: '#FFFFFF',        // Your white
  cardBackground: 'rgba(255, 255, 255, 0.95)',
  overlay: 'rgba(34, 87, 93, 0.6)',  // Teal overlay instead of black
  
  // Text Colors (Softer & More Peaceful)
  textPrimary: '#2C3E3F',      // Soft dark teal-gray
  textSecondary: '#556B6D',    // Medium teal-gray
  textMuted: '#7A8E90',        // Light teal-gray
  textOnDark: '#FFFFFF',       // White on dark
  textOnPrimary: '#FFFFFF',    // White on primary
  
  // Status Colors (Peaceful Versions)
  warning: '#D4A574',          // Soft gold warning
  error: '#C87B7B',            // Soft coral error
  info: '#55BAC6',             // Your light teal for info
  
  // Neutral Colors
  white: '#FFFFFF',
  light: '#F8FAFA',            // Very light teal tint
  gray100: '#F5F7F7',         // Subtle teal tint
  gray200: '#E8ECEC',         // Light teal-gray
  gray300: '#D1D9DA',         // Medium teal-gray
  gray400: '#A8B5B6',         // 
  gray500: '#7A8E90',         // 
  gray600: '#556B6D',         // 
  gray700: '#3E5052',         // 
  gray800: '#2C3E3F',         // 
  gray900: '#1A2829',         // Darkest teal-gray
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
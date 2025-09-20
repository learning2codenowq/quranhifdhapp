import { Platform } from 'react-native';

export const UthmaniFont = {
  family: Platform.OS === 'ios' ? 'KFGQPC_Uthmanic_Script_HAFS' : 'KFGQPC_Uthmanic_Script_HAFS',
};

export const ArabicTextStyles = {
  ayah: {
    fontFamily: UthmaniFont.family,
    fontSize: 28,
    lineHeight: 50,
    textAlign: 'right',
    color: '#2c3e50',
  },
  surahName: {
    fontFamily: UthmaniFont.family,
    fontSize: 22,
    textAlign: 'center',
    color: '#004d24',
  },
  basmala: {
    fontFamily: UthmaniFont.family,
    fontSize: 26,
    textAlign: 'center',
    color: '#004d24',
    lineHeight: 45,
  },
  verseNumber: {
    fontFamily: UthmaniFont.family,
    fontSize: 20,
    color: '#d4af37',
  },
  page: {
    fontFamily: UthmaniFont.family,
    fontSize: 24,
    lineHeight: 40,
    textAlign: 'right',
    color: '#2c3e50',
  },
  logo: {
    fontFamily: UthmaniFont.family,
    fontSize: 72,
    color: '#d4af37',
  },
  subtitle: {
    fontFamily: UthmaniFont.family,
    fontSize: 24,
    color: '#d4af37',
  }
};
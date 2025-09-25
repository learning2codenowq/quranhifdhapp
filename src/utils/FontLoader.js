import * as Font from 'expo-font';

export const loadFonts = async () => {
  try {
    await Font.loadAsync({
      'UthmanicFont': require('../../assets/fonts/KFGQPC_Uthmanic_Script_HAFS_Regular.otf'),
    });
    console.log('✅ Uthmani font loaded successfully');
    return true;
  } catch (error) {
    console.error('❌ Error loading Uthmani font:', error);
    return true;
  }
};
import * as Font from 'expo-font';

export const loadFonts = async () => {
  try {
    await Font.loadAsync({
      'UthmanicFont': require('../../assets/fonts/KFGQPC_Uthmanic_Script_HAFS_Regular.otf'),
      'IndoPakFont': require('../../assets/fonts/IndoPak.ttf'),
    });
    console.log('✅ Fonts loaded successfully: Uthmani & IndoPak');
    return true;
  } catch (error) {
    console.error('❌ Error loading fonts:', error);
    console.error('Error details:', error.message);
    return true; // Return true to allow app to continue
  }
};
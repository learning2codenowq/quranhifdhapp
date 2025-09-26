import { Audio } from 'expo-av';

export class AudioService {
  static sound = null;
  static isPlaying = false;
  static isStoppingIntentionally = false;

  static async setupAudio() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
      console.log('Audio setup completed');
      return true;
    } catch (error) {
      console.error('Audio setup failed:', error);
      return false;
    }
  }

  static async playAyahFromUrl(audioUrl, onComplete = null) {
  try {
    if (!audioUrl) {
      throw new Error('No audio URL provided');
    }

    console.log('Playing audio from URL:', audioUrl);
    
    await this.stopAudio();
    
    const audioPromise = Audio.Sound.createAsync(
  { uri: audioUrl },
  { 
    shouldPlay: true, 
    volume: 1.0,
    isLooping: false,
    isMuted: false,
    rate: 1.0,
    shouldCorrectPitch: true
  }
);

const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Audio loading timeout')), 15000)
);

const { sound } = await Promise.race([audioPromise, timeoutPromise]);
    
    this.sound = sound;
    this.isPlaying = true;
    this.isStoppingIntentionally = false;

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        this.isPlaying = status.isPlaying;
        
        if (status.didJustFinish) {
          console.log('🎵 Audio finished playing naturally');
          this.isPlaying = false;
          
          // Call the completion callback if provided
          if (onComplete) {
            console.log('🎵 Calling completion callback');
            setTimeout(() => onComplete(), 100); // Small delay to ensure state is updated
          }
          
          // Clear sound after callback
          setTimeout(() => {
            if (this.sound === sound) {
              this.sound = null;
            }
          }, 200);
        }
        
        if (status.error) {
          console.error('Audio playback error:', status.error);
          this.isPlaying = false;
          this.sound = null;
        }
      } else if (status.error) {
        console.error('Audio loading error:', status.error);
        this.isPlaying = false;
        this.sound = null;
      }
    });

    console.log('Audio should now be playing...');
    return true;
  } catch (error) {
    console.error('Audio playback failed:', error);
    this.isPlaying = false;
    return false;
  }
}

  // Keep this for backward compatibility but use the new method
  static async playAyah(surahId, ayahNumber, reciter = 'alafasy') {
    // This is now just for logging - actual URL should come from API
    console.log(`Attempting to play Surah ${surahId}, Ayah ${ayahNumber}`);
    return false; // Will be handled by the component with actual URL
  }

  static async stopAudio() {
  try {
    if (this.sound) {
      console.log('🛑 Stopping audio...');
      this.isStoppingIntentionally = true;
      this.isPlaying = false;
      
      await this.sound.stopAsync();
      await this.sound.unloadAsync();
      this.sound = null;
      console.log('🛑 Audio stopped successfully');
    }
  } catch (error) {
    if (error.message && error.message.includes('Seeking interrupted')) {
      console.log('🛑 Audio stop interrupted (expected when stopping quickly)');
    } else {
      console.warn('Audio stop had minor issue:', error.message);
    }
    this.isPlaying = false;
    this.sound = null;
  } finally {
    this.isStoppingIntentionally = false;
    
    if (global.gc && __DEV__) {
      global.gc(); 
    }
  }
}

   static async pauseAudio() {
    try {
      if (this.sound && this.isPlaying) {
        await this.sound.pauseAsync();
        this.isPlaying = false;
      }
    } catch (error) {
      console.error('Audio pause failed:', error);
    }
  }

  static async resumeAudio() {
    try {
      if (this.sound && !this.isPlaying) {
        await this.sound.playAsync();
        this.isPlaying = true;
      }
    } catch (error) {
      console.error('Audio resume failed:', error);
    }
  }

  static getPlaybackStatus() {
    return {
      isPlaying: this.isPlaying,
      hasSound: this.sound !== null
    };
  }
}
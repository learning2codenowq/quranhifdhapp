import { Audio } from 'expo-av';

export class AudioService {
  static sound = null;
  static isPlaying = false;

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

  static async playAyahFromUrl(audioUrl) {
  try {
    if (!audioUrl) {
      throw new Error('No audio URL provided');
    }

    // Validate URL format
    if (!audioUrl.startsWith('http://') && !audioUrl.startsWith('https://')) {
      throw new Error('Invalid audio URL format');
    }

    console.log('Playing audio from URL:', audioUrl);
    
    await this.stopAudio();
    
    // Test if URL is accessible first
    try {
      const response = await fetch(audioUrl, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`Audio file not accessible: ${response.status}`);
      }
    } catch (fetchError) {
      console.warn('Could not verify audio URL:', fetchError);
      // Continue anyway as some servers might block HEAD requests
    }
    
    const { sound } = await Audio.Sound.createAsync(
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
    
    this.sound = sound;
    this.isPlaying = true;

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        this.isPlaying = status.isPlaying;
        
        if (status.didJustFinish) {
          console.log('🎵 Audio finished playing naturally');
          this.isPlaying = false;
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
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
        this.isPlaying = false;
      }
    } catch (error) {
      console.error('Audio stop failed:', error);
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
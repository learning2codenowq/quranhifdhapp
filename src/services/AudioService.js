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

      console.log('Playing audio from URL:', audioUrl);
      
      await this.stopAudio();
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true, volume: 1.0 }
      );
      
      this.sound = sound;
      this.isPlaying = true;

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          console.log('Audio finished playing');
          this.isPlaying = false;
          this.sound = null;
        }
        if (status.error) {
          console.error('Audio playback error:', status.error);
          this.isPlaying = false;
          this.sound = null;
        }
      });

      console.log('Audio should now be playing...');
      return true;
    } catch (error) {
      console.error('Audio playback failed:', error);
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
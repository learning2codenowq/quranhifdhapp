import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { StorageService } from '../services/StorageService';
import { ErrorHandler } from './ErrorHandler';

export class BackupUtils {
  static async createBackup() {
    try {
      const state = await StorageService.getState();
      if (!state) {
        throw new Error('No data to backup');
      }

      const backupData = {
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        data: state
      };

      const backupString = JSON.stringify(backupData, null, 2);
      const fileName = `quran_backup_${new Date().toISOString().split('T')[0]}.json`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, backupString);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      }

      return true;
    } catch (error) {
      ErrorHandler.handleGenericError(error, 'Failed to create backup');
      return false;
    }
  }

  static async restoreFromBackup(backupString) {
    try {
      const backupData = JSON.parse(backupString);
      
      if (!backupData.data || !backupData.version) {
        throw new Error('Invalid backup format');
      }

      const success = await StorageService.saveState(backupData.data);
      return success;
    } catch (error) {
      ErrorHandler.handleGenericError(error, 'Failed to restore backup');
      return false;
    }
  }
}
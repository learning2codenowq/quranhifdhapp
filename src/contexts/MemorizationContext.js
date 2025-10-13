import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { StorageService } from '../services/StorageService';
import { QuranUtils } from '../utils/QuranUtils';
import { Logger } from '../utils/Logger';

const MemorizationContext = createContext();

export const useMemorization = () => {
  const context = useContext(MemorizationContext);
  if (!context) {
    throw new Error('useMemorization must be used within MemorizationProvider');
  }
  return context;
};

export const MemorizationProvider = ({ children }) => {
  const [memorizedAyahs, setMemorizedAyahs] = useState([]);
  const [ayahProgress, setAyahProgress] = useState({});
  const [loading, setLoading] = useState(true);

  // Load memorization data on mount
  useEffect(() => {
    loadMemorizationData();
  }, []);

  const loadMemorizationData = async () => {
    try {
      setLoading(true);
      const state = await StorageService.getState();
      
      if (state?.ayahProgress) {
        // Convert ayahProgress object to array of memorized ayahs
        const memorized = [];
        Object.keys(state.ayahProgress).forEach(surahIdKey => {
          Object.keys(state.ayahProgress[surahIdKey]).forEach(ayahNumber => {
            const ayahData = state.ayahProgress[surahIdKey][ayahNumber];
            if (ayahData.memorized) {
              memorized.push({
                surahId: parseInt(surahIdKey),
                ayahNumber: parseInt(ayahNumber),
                dateMemorized: ayahData.dateMemorized,
                difficulty: ayahData.difficulty
              });
            }
          });
        });
        
        setMemorizedAyahs(memorized);
        setAyahProgress(state.ayahProgress);
        Logger.log('✅ Loaded memorization data:', memorized.length, 'ayahs');
      }
    } catch (error) {
      Logger.error('Error loading memorization data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if a specific ayah is memorized
  const isAyahMemorized = useCallback((surahId, ayahNumber) => {
    return memorizedAyahs.some(
      ayah => ayah.surahId === surahId && ayah.ayahNumber === ayahNumber
    );
  }, [memorizedAyahs]);

  // Mark an ayah as memorized
  const markAsMemorized = async (surahId, ayahNumber, difficulty = 2) => {
    try {
      // Update storage
      const updatedState = await QuranUtils.markAyahMemorized(surahId, ayahNumber, difficulty);
      
      // Update local state
      const newAyah = {
        surahId,
        ayahNumber,
        dateMemorized: QuranUtils.localISO(),
        difficulty
      };
      
      setMemorizedAyahs(prev => [...prev, newAyah]);
      
      // Update ayahProgress
      if (updatedState?.ayahProgress) {
        setAyahProgress(updatedState.ayahProgress);
      }
      
      Logger.log(`✅ Marked ayah ${surahId}:${ayahNumber} as memorized`);
      return true;
    } catch (error) {
      Logger.error('Error marking ayah as memorized:', error);
      return false;
    }
  };

  // Unmark an ayah as memorized
  const unmarkAsMemorized = async (surahId, ayahNumber) => {
    try {
      // Update storage
      const updatedState = await QuranUtils.unmarkAyahMemorized(surahId, ayahNumber);
      
      // Update local state
      setMemorizedAyahs(prev => 
        prev.filter(ayah => !(ayah.surahId === surahId && ayah.ayahNumber === ayahNumber))
      );
      
      // Update ayahProgress
      if (updatedState?.ayahProgress) {
        setAyahProgress(updatedState.ayahProgress);
      }
      
      Logger.log(`✅ Unmarked ayah ${surahId}:${ayahNumber}`);
      return true;
    } catch (error) {
      Logger.error('Error unmarking ayah:', error);
      return false;
    }
  };

  // Get progress for a specific surah
  const getSurahProgress = useCallback((surahId, totalAyahs) => {
    const surahMemorized = memorizedAyahs.filter(ayah => ayah.surahId === surahId);
    return {
      memorized: surahMemorized.length,
      total: totalAyahs,
      percentage: totalAyahs > 0 ? (surahMemorized.length / totalAyahs) * 100 : 0
    };
  }, [memorizedAyahs]);

  // Get all surahs with their progress
  const getAllSurahsProgress = useCallback(() => {
    const surahsMap = {};
    
    memorizedAyahs.forEach(ayah => {
      if (!surahsMap[ayah.surahId]) {
        surahsMap[ayah.surahId] = 0;
      }
      surahsMap[ayah.surahId]++;
    });
    
    return surahsMap;
  }, [memorizedAyahs]);

  const value = {
    memorizedAyahs,
    ayahProgress,
    loading,
    isAyahMemorized,
    markAsMemorized,
    unmarkAsMemorized,
    getSurahProgress,
    getAllSurahsProgress,
    refreshData: loadMemorizationData
  };

  return (
    <MemorizationContext.Provider value={value}>
      {children}
    </MemorizationContext.Provider>
  );
};
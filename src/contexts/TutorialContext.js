import React, { createContext, useContext, useState, useEffect } from 'react';
import { StorageService } from '../services/StorageService';
import { Logger } from '../utils/Logger';

const TutorialContext = createContext();

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (!context) {
    throw new Error('useTutorial must be used within TutorialProvider');
  }
  return context;
};

export const TutorialProvider = ({ children }) => {
  const [isTutorialActive, setIsTutorialActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  // Tutorial steps configuration
  const tutorialSteps = [
    {
      id: 'welcome',
      screen: 'Dashboard',
      title: 'Welcome to Your Quran Journey! 🌙',
      message: "Let's take a quick tour to help you get started. We'll use Surah Al-Fatihah, which you already know, to show you how the app works.",
      action: 'next',
      highlight: null
    },
    {
      id: 'start_memorizing',
      screen: 'Dashboard',
      title: 'Start Your First Session',
      message: 'Tap the "Start Memorizing" card to begin your journey with Al-Fatihah.',
      action: 'tap',
      highlight: 'continueCard'
    },
    {
      id: 'select_fatiha',
      screen: 'SurahList',
      title: 'Select Surah Al-Fatihah',
      message: 'Tap on Surah Al-Fatihah (the first surah) to open it.',
      action: 'tap',
      highlight: 'surah-1'
    },
    {
      id: 'quran_reader_intro',
      screen: 'QuranReader',
      title: 'Your Memorization Space',
      message: "This is where you'll read, listen, and memorize ayahs. Let me show you the key features.",
      action: 'next',
      highlight: null
    },
    {
      id: 'audio_feature',
      screen: 'QuranReader',
      title: 'Listen to the Recitation 🎧',
      message: 'Tap the play button on any ayah to hear its recitation. This helps with pronunciation.',
      action: 'guide',
      highlight: 'audioButton'
    },
    {
      id: 'mark_memorized',
      screen: 'QuranReader',
      title: 'Mark as Memorized ✓',
      message: "When you've memorized an ayah, tap the checkmark button to track your progress.",
      action: 'tap',
      highlight: 'memorizeButton'
    },
    {
      id: 'completion',
      screen: 'QuranReader',
      title: "You're All Set! 🎉",
      message: "Great job! You now know how to memorize, listen, and track your progress. Continue with Al-Fatihah or explore other surahs.",
      action: 'finish',
      highlight: null
    }
  ];

  // Load tutorial status on mount
  useEffect(() => {
    checkTutorialStatus();
  }, []);

  const checkTutorialStatus = async () => {
    try {
      const state = await StorageService.getState();
      const completed = state?.tutorialCompleted || false;
      setTutorialCompleted(completed);
      Logger.log('Tutorial status:', { completed });
    } catch (error) {
      Logger.error('Error checking tutorial status:', error);
    }
  };

  const startTutorial = () => {
    setIsTutorialActive(true);
    setCurrentStep(0);
    Logger.log('Tutorial started');
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      Logger.log('Tutorial step:', currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = async () => {
    setIsTutorialActive(false);
    await markTutorialComplete();
    Logger.log('Tutorial skipped');
  };

  const completeTutorial = async () => {
    setIsTutorialActive(false);
    await markTutorialComplete();
    Logger.log('Tutorial completed');
  };

  const markTutorialComplete = async () => {
    try {
      const state = await StorageService.getState();
      state.tutorialCompleted = true;
      await StorageService.saveState(state);
      setTutorialCompleted(true);
    } catch (error) {
      Logger.error('Error marking tutorial complete:', error);
    }
  };

  const resetTutorial = async () => {
    try {
      const state = await StorageService.getState();
      state.tutorialCompleted = false;
      await StorageService.saveState(state);
      setTutorialCompleted(false);
      setCurrentStep(0);
      Logger.log('Tutorial reset');
    } catch (error) {
      Logger.error('Error resetting tutorial:', error);
    }
  };

  const getCurrentStepData = () => {
    return tutorialSteps[currentStep];
  };

  const value = {
    isTutorialActive,
    currentStep,
    tutorialCompleted,
    tutorialSteps,
    startTutorial,
    nextStep,
    previousStep,
    skipTutorial,
    completeTutorial,
    resetTutorial,
    getCurrentStepData
  };

  return (
    <TutorialContext.Provider value={value}>
      {children}
    </TutorialContext.Provider>
  );
};
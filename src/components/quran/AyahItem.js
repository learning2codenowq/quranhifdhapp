import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Icon } from '../Icon';
import { Theme } from '../../styles/theme';
import AudioControls from './AudioControls';
import AyahCounter from './AyahCounter';

export default function AyahItem({
  item,
  surahId,
  settings,
  darkMode,
  themedColors,
  isMemorized,
  isCurrentlyPlaying,
  currentCount,
  onToggleMemorization,
  onPlayAudio,
  onIncrementCounter,
  onResetCounter,
  parseTajweedText,
  hasTajweedMarkup,
  cleanArabicText,
  cleanTranslation,
  getFontSize,
  getTranslationFontSize,
}) {
  // Safety checks
  if (!item || !item.verse_number) {
    console.warn('Invalid ayah item:', item);
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Ayah Number Badge */}
      <View style={styles.ayahNumberBadge}>
        <Text style={styles.ayahNumberText}>{item.verse_number}</Text>
      </View>

      {/* Arabic Text Card */}
      <View style={[
        styles.arabicTextCard,
        isMemorized && styles.memorizedCard,
        darkMode && { backgroundColor: themedColors.cardBackground }
      ]}>
        <View style={styles.arabicTextWrapper}>
          <Text style={[
            styles.arabicText,
            {
              fontSize: getFontSize(settings.arabicFontSize),
              lineHeight: getFontSize(settings.arabicFontSize) * 1.8,
              color: darkMode ? themedColors.textPrimary : Theme.colors.primary,
              fontFamily: settings.scriptType === 'uthmani' || settings.scriptType === 'tajweed'
                ? 'UthmanicFont'
                : settings.scriptType === 'indopak'
                ? 'IndoPakFont'
                : 'System',
            }
          ]}>
            {settings.scriptType === 'tajweed' && hasTajweedMarkup(item.text) ? (
              parseTajweedText(item.text).map((segment, idx) => (
                <Text key={idx} style={segment.color ? { color: segment.color } : {}}>
                  {segment.text}
                </Text>
              ))
            ) : settings.scriptType === 'uthmani' ? (
              cleanArabicText(item.text)
            ) : (
              item.text
            )}
          </Text>
        </View>
      </View>

      {/* Translation Card */}
      {settings.showTranslations && (
        <View style={[
          styles.translationCard,
          darkMode && { backgroundColor: themedColors.surface }
        ]}>
          <Text style={[
            styles.translationText,
            {
              fontSize: getTranslationFontSize(settings.translationFontSize),
              color: darkMode ? themedColors.textSecondary : Theme.colors.textSecondary,
            }
          ]}>
            {cleanTranslation(item.translation)}
          </Text>
        </View>
      )}

      {/* Counter */}
      <AyahCounter
        count={currentCount}
        onIncrement={onIncrementCounter}
        onReset={onResetCounter}
        darkMode={darkMode}
        themedColors={themedColors}
      />

      {/* Controls */}
      <View style={styles.controls}>
        <AudioControls
          isPlaying={isCurrentlyPlaying}
          onPress={onPlayAudio}
          darkMode={darkMode}
        />

        <TouchableOpacity
          style={[
            styles.memorizeButton,
            isMemorized && styles.memorizedButton,
            darkMode && !isMemorized && { backgroundColor: themedColors.surface }
          ]}
          onPress={onToggleMemorization}
        >
          <Icon
            name={isMemorized ? 'checkmark-circle' : 'checkmark-circle-outline'}
            type="Ionicons"
            size={24}
            color={isMemorized ? Theme.colors.success : (darkMode ? themedColors.textSecondary : Theme.colors.textMuted)}
          />
          <Text style={[
            styles.memorizeText,
            isMemorized && styles.memorizedText,
            darkMode && !isMemorized && { color: themedColors.textSecondary }
          ]}>
            {isMemorized ? 'Memorized ✓' : 'Mark as Memorized'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  ayahNumberBadge: {
    backgroundColor: Theme.colors.secondary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    ...Theme.shadows.sm,
  },
  ayahNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Theme.colors.textOnPrimary,
  },
  arabicTextCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 12,
    ...Theme.shadows.md,
  },
  memorizedCard: {
    backgroundColor: Theme.colors.successLight,
    borderWidth: 2,
    borderColor: Theme.colors.success,
  },
  arabicTextWrapper: {
    alignItems: 'flex-end',
  },
  arabicText: {
    fontFamily: Theme.typography.fontFamily.arabic,
    textAlign: 'right',
    color: Theme.colors.primary,
    writingDirection: 'rtl',
    includeFontPadding: false,
    textAlignVertical: 'top',
  },
  translationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 20,
    ...Theme.shadows.sm,
  },
  translationText: {
    lineHeight: 28,
    color: Theme.colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'left',
    fontWeight: '400',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  memorizeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 28,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginLeft: 16,
    ...Theme.shadows.sm,
  },
  memorizedButton: {
    backgroundColor: Theme.colors.successLight,
    borderWidth: 2,
    borderColor: Theme.colors.success,
  },
  memorizeText: {
    fontSize: 16,
    color: Theme.colors.textMuted,
    fontWeight: '600',
    marginLeft: 12,
  },
  memorizedText: {
    color: Theme.colors.success,
  },
});
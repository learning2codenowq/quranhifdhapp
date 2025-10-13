import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  StyleSheet 
} from 'react-native';
import { Icon } from '../Icon';
import { Theme } from '../../styles/theme';

export default function ReplayModal({ 
  visible, 
  onClose, 
  onStart, 
  darkMode, 
  themedColors,
  totalAyahs 
}) {
  const [startAyah, setStartAyah] = useState('1');
  const [endAyah, setEndAyah] = useState('1');
  const [repetitions, setRepetitions] = useState('3');

  const handleStart = () => {
    const start = parseInt(startAyah) || 1;
    const end = parseInt(endAyah) || 1;
    const reps = parseInt(repetitions) || 1;

    // Validation
    if (start < 1 || end > totalAyahs || start > end || reps < 1) {
      alert('Please enter valid numbers');
      return;
    }

    onStart({
      startAyah: start,
      endAyah: end,
      repetitions: reps
    });

    // Reset for next time
    setStartAyah('1');
    setEndAyah('1');
    setRepetitions('3');
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={[
          styles.modal,
          darkMode && { backgroundColor: themedColors.cardBackground }
        ]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[
              styles.title,
              darkMode && { color: themedColors.textPrimary }
            ]}>
              Replay Segment
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon 
                name="close-circle" 
                type="Ionicons"
                size={28} 
                color={darkMode ? themedColors.textSecondary : Theme.colors.textMuted} 
              />
            </TouchableOpacity>
          </View>

          {/* Input Section */}
          <View style={styles.inputRow}>
            <View style={styles.inputGroup}>
              <Text style={[
                styles.inputLabel,
                darkMode && { color: themedColors.textSecondary }
              ]}>
                From Ayah
              </Text>
              <TextInput
                style={[
                  styles.input,
                  darkMode && { 
                    backgroundColor: themedColors.surface,
                    color: themedColors.textPrimary,
                    borderColor: themedColors.border
                  }
                ]}
                keyboardType="number-pad"
                value={startAyah}
                onChangeText={setStartAyah}
                maxLength={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[
                styles.inputLabel,
                darkMode && { color: themedColors.textSecondary }
              ]}>
                To Ayah
              </Text>
              <TextInput
                style={[
                  styles.input,
                  darkMode && { 
                    backgroundColor: themedColors.surface,
                    color: themedColors.textPrimary,
                    borderColor: themedColors.border
                  }
                ]}
                keyboardType="number-pad"
                value={endAyah}
                onChangeText={setEndAyah}
                maxLength={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[
                styles.inputLabel,
                darkMode && { color: themedColors.textSecondary }
              ]}>
                Repeat
              </Text>
              <TextInput
                style={[
                  styles.input,
                  darkMode && { 
                    backgroundColor: themedColors.surface,
                    color: themedColors.textPrimary,
                    borderColor: themedColors.border
                  }
                ]}
                keyboardType="number-pad"
                value={repetitions}
                onChangeText={setRepetitions}
                maxLength={2}
              />
            </View>
          </View>

          {/* Start Button */}
          <TouchableOpacity
            style={[
              styles.startButton,
              darkMode && { backgroundColor: themedColors.accent }
            ]}
            onPress={handleStart}
          >
            <Text style={styles.startButtonText}>Start Replay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Theme.colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: Theme.colors.white,
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    ...Theme.shadows.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Theme.colors.primary,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  inputGroup: {
    flex: 1,
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 14,
    color: Theme.colors.textMuted,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 2,
    borderColor: Theme.colors.gray200,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    color: Theme.colors.primary,
    backgroundColor: Theme.colors.gray100,
    minWidth: 60,
  },
  startButton: {
    backgroundColor: Theme.colors.secondary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    ...Theme.shadows.md,
  },
  startButtonText: {
    color: Theme.colors.textOnPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
});
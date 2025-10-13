import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../../styles/theme';

export default function DailyTargetModal({ 
  visible, 
  onClose, 
  currentTarget, 
  onSelect,
  darkMode = false,
  themedColors = {}
}) {
  const targets = [5, 10, 15, 20];

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={[
          styles.modal,
          darkMode && { backgroundColor: themedColors.cardBackground }
        ]}>
          <Text style={[
            styles.title,
            darkMode && { color: themedColors.textPrimary }
          ]}>
            Daily Target
          </Text>
          
          <Text style={[
            styles.subtitle,
            darkMode && { color: themedColors.textSecondary }
          ]}>
            Choose your daily memorization goal:
          </Text>
          
          <View style={styles.targetOptions}>
            {targets.map((target) => (
              <TouchableOpacity
                key={target}
                style={[
                  styles.targetOption,
                  currentTarget === target && styles.selectedTargetOption,
                  darkMode && currentTarget !== target && { 
                    backgroundColor: themedColors.surface,
                    borderColor: themedColors.border
                  }
                ]}
                onPress={() => {
                  onSelect(target);
                  onClose();
                }}
              >
                <Text style={[
                  styles.targetOptionText,
                  currentTarget === target && styles.selectedTargetOptionText,
                  darkMode && currentTarget !== target && { color: themedColors.textPrimary }
                ]}>
                  {target} ayahs
                </Text>
                {target === 10 && (
                  <Text style={styles.recommendedText}>Recommended</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.cancelButton,
              darkMode && { backgroundColor: themedColors.surface }
            ]}
            onPress={onClose}
          >
            <Text style={[
              styles.cancelButtonText,
              darkMode && { color: themedColors.textSecondary }
            ]}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '90%',
    maxWidth: 350,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  targetOptions: {
    width: '100%',
    marginBottom: 20,
  },
  targetOption: {
    borderWidth: 2,
    borderColor: Theme.colors.gray200,
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  selectedTargetOption: {
    borderColor: Theme.colors.secondary,
    backgroundColor: Theme.colors.secondary + '20',
  },
  targetOptionText: {
    fontSize: 16,
    color: Theme.colors.primary,
    fontWeight: '600',
  },
  selectedTargetOptionText: {
    color: Theme.colors.secondary,
    fontWeight: 'bold',
  },
  recommendedText: {
    fontSize: 12,
    color: Theme.colors.secondary,
    fontWeight: 'bold',
    marginTop: 4,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});
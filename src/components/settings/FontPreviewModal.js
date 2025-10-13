import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Theme } from '../../styles/theme';

export default function FontPreviewModal({ 
  visible, 
  onClose, 
  arabicFontSize,
  translationFontSize,
  onApply,
  darkMode = false,
  themedColors = {}
}) {
  const getArabicFontSize = (sizeCategory) => {
    const sizes = {
      'Small': 18,
      'Medium': 24,
      'Large': 30,
      'Extra Large': 36
    };
    return sizes[sizeCategory] || 24;
  };

  const getTranslationFontSize = (sizeCategory) => {
    const sizes = {
      'Small': 12,
      'Medium': 16,
      'Large': 20,
      'Extra Large': 24
    };
    return sizes[sizeCategory] || 16;
  };

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
            Font Size Preview
          </Text>
          
          <View style={styles.previewContainer}>
            <Text style={[
              styles.previewLabel,
              darkMode && { color: themedColors.textSecondary }
            ]}>
              Arabic Text ({arabicFontSize})
            </Text>
            <Text style={[
              styles.arabicPreview, 
              { 
                fontSize: getArabicFontSize(arabicFontSize),
                fontFamily: 'UthmanicFont'
              },
              darkMode && { 
                backgroundColor: themedColors.surface,
                color: themedColors.textPrimary
              }
            ]}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </Text>
            
            <Text style={[
              styles.previewLabel,
              darkMode && { color: themedColors.textSecondary }
            ]}>
              Translation Text ({translationFontSize})
            </Text>
            <Text style={[
              styles.translationPreview,
              { fontSize: getTranslationFontSize(translationFontSize) },
              darkMode && { 
                backgroundColor: themedColors.surface,
                color: themedColors.textSecondary
              }
            ]}>
              In the name of Allah, the Most Gracious, the Most Merciful.
            </Text>
          </View>

          <View style={styles.buttons}>
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
            
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={() => {
                onApply();
                onClose();
              }}
            >
              <Text style={styles.applyButtonText}>Apply</Text>
            </TouchableOpacity>
          </View>
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
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    textAlign: 'center',
    marginBottom: 25,
  },
  previewContainer: {
    marginBottom: 25,
  },
  previewLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    marginTop: 15,
  },
  arabicPreview: {
    textAlign: 'center',
    color: Theme.colors.primary,
    marginBottom: 10,
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  translationPreview: {
    textAlign: 'center',
    color: '#666',
    paddingVertical: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    fontStyle: 'italic',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#d4af37',
    borderRadius: 15,
    paddingVertical: 12,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
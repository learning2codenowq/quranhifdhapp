import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Theme } from '../../styles/theme';

export default function UserNameModal({ 
  visible, 
  onClose, 
  currentName, 
  onSave,
  darkMode = false,
  themedColors = {}
}) {
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    if (visible) {
      setTempName(currentName);
    }
  }, [visible, currentName]);

  const handleSave = () => {
    const trimmedName = tempName.trim();
    if (trimmedName.length > 0) {
      onSave(trimmedName);
      onClose();
    } else {
      Alert.alert('Invalid Name', 'Please enter a valid name.');
    }
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
            Edit Name
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
            placeholder="Enter your name"
            placeholderTextColor={darkMode ? themedColors.textMuted : '#999'}
            value={tempName}
            onChangeText={setTempName}
            autoFocus={true}
            maxLength={30}
          />

          <View style={styles.buttons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save</Text>
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
    width: '90%',
    maxWidth: 350,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 2,
    borderColor: Theme.colors.gray200,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    width: '100%',
    marginBottom: 20,
    color: Theme.colors.primary,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: Theme.colors.secondary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
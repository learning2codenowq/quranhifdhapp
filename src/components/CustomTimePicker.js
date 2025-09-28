import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Theme } from '../styles/theme';

export default function CustomTimePicker({ 
  visible, 
  onClose, 
  onSave, 
  initialTime, 
  title, 
  subtitle 
}) {
  const [hour, setHour] = useState(initialTime.hour);
  const [minute, setMinute] = useState(initialTime.minute);

  const adjustHour = (increment) => {
    if (increment) {
      setHour((prev) => (prev + 1) % 24);
    } else {
      setHour((prev) => (prev - 1 + 24) % 24);
    }
  };

  const adjustMinute = (increment) => {
    if (increment) {
      setMinute((prev) => (prev + 15) % 60);
    } else {
      setMinute((prev) => (prev - 15 + 60) % 60);
    }
  };

  const formatTime = () => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const handleSave = () => {
    onSave({ hour, minute });
    onClose();
  };

  const handleCancel = () => {
    setHour(initialTime.hour);
    setMinute(initialTime.minute);
    onClose();
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
          
          <View style={styles.timeDisplay}>
            <Text style={styles.timeText}>{formatTime()}</Text>
          </View>

          <View style={styles.controls}>
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Hour</Text>
              <View style={styles.controlButtons}>
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => adjustHour(false)}
                >
                  <Text style={styles.controlButtonText}>−</Text>
                </TouchableOpacity>
                
                <Text style={styles.controlValue}>
                  {hour.toString().padStart(2, '0')}
                </Text>
                
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => adjustHour(true)}
                >
                  <Text style={styles.controlButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Minute</Text>
              <View style={styles.controlButtons}>
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => adjustMinute(false)}
                >
                  <Text style={styles.controlButtonText}>−</Text>
                </TouchableOpacity>
                
                <Text style={styles.controlValue}>
                  {minute.toString().padStart(2, '0')}
                </Text>
                
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => adjustMinute(true)}
                >
                  <Text style={styles.controlButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.buttons}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
            >
              <Text style={styles.saveText}>Save</Text>
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
    borderRadius: 24,
    padding: 30,
    width: '100%',
    maxWidth: 350,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  timeDisplay: {
    backgroundColor: Theme.colors.gray100,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  timeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 30,
  },
  controlGroup: {
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontWeight: '600',
  },
  controlButtons: {
    alignItems: 'center',
    gap: 12,
  },
  controlButton: {
    backgroundColor: Theme.colors.secondary,
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  controlButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  controlValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    minWidth: 40,
    textAlign: 'center',
  },
  buttons: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: Theme.colors.secondary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
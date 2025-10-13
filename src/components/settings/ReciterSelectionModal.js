import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Icon } from '../Icon';
import { Theme } from '../../styles/theme';

export default function ReciterSelectionModal({ 
  visible, 
  onClose, 
  reciters,
  selectedReciterId,
  onSelect,
  loading = false,
  darkMode = false,
  themedColors = {}
}) {
  // Separate featured and all reciters
  const featuredReciters = reciters.filter(r => r.featured);
  const allReciters = reciters;

  const renderReciterItem = (reciter) => {
    const isSelected = selectedReciterId === reciter.id;
    
    // Build style text
    let styleText = reciter.style || 'Hafs';
    if (reciter.rewaya && reciter.rewaya !== 'Hafs') {
      styleText = `${reciter.rewaya} • ${styleText}`;
    }

    return (
      <TouchableOpacity
        key={reciter.id}
        style={[
          styles.reciterCard,
          isSelected && styles.selectedReciterCard,
          darkMode && !isSelected && { backgroundColor: themedColors.surface }
        ]}
        onPress={() => {
          onSelect(reciter.id);
          onClose();
        }}
      >
        <View style={styles.reciterCardContent}>
          <View style={styles.reciterInfo}>
            <Text style={[
              styles.reciterCardName,
              isSelected && styles.selectedReciterName,
              darkMode && !isSelected && { color: themedColors.textPrimary }
            ]}>
              {reciter.name}
            </Text>
            
            {reciter.arabicName && (
              <Text style={[
                styles.reciterCardArabicName,
                isSelected && styles.selectedReciterArabicName,
                darkMode && !isSelected && { color: themedColors.textSecondary }
              ]}>
                {reciter.arabicName}
              </Text>
            )}
            
            <Text style={[
              styles.reciterCardDetails,
              isSelected && styles.selectedReciterDetails,
              darkMode && { color: themedColors.textMuted }
            ]}>
              {styleText}
            </Text>
          </View>

          {isSelected && (
            <View style={styles.checkmarkCircle}>
              <Icon 
                name="checkmark" 
                type="Ionicons" 
                size={20} 
                color={Theme.colors.textOnPrimary} 
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
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
            <View>
              <Text style={[
                styles.title,
                darkMode && { color: themedColors.textPrimary }
              ]}>
                Select Reciter
              </Text>
              <Text style={[
                styles.subtitle,
                darkMode && { color: themedColors.textSecondary }
              ]}>
                Choose your preferred Quran reciter
              </Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.closeButton,
                darkMode && { backgroundColor: themedColors.surface }
              ]}
              onPress={onClose}
            >
              <Icon 
                name="close" 
                type="Ionicons" 
                size={24} 
                color={darkMode ? themedColors.textSecondary : Theme.colors.textMuted} 
              />
            </TouchableOpacity>
          </View>

          {/* Loading State */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Theme.colors.secondary} />
              <Text style={[
                styles.loadingText,
                darkMode && { color: themedColors.textSecondary }
              ]}>
                Loading reciters...
              </Text>
            </View>
          ) : (
            <ScrollView 
              style={styles.scrollView}
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={true}
            >
              {/* Featured Section */}
              {featuredReciters.length > 0 && (
                <View style={styles.featuredSection}>
                  <Text style={[
                    styles.sectionLabel,
                    darkMode && { color: themedColors.textSecondary }
                  ]}>
                    FEATURED
                  </Text>
                  {featuredReciters.map(renderReciterItem)}
                </View>
              )}

              {/* All Reciters Section */}
              <View style={styles.allRecitersSection}>
                <Text style={[
                  styles.sectionLabel,
                  darkMode && { color: themedColors.textSecondary }
                ]}>
                  ALL RECITERS
                </Text>
                {allReciters.map(renderReciterItem)}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.gray200,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Theme.colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Theme.colors.textSecondary,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Theme.colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 14,
    color: Theme.colors.textMuted,
    marginTop: 16,
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 40,
  },
  featuredSection: {
    marginBottom: 24,
  },
  allRecitersSection: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Theme.colors.textMuted,
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
  },
  reciterCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Theme.shadows.sm,
  },
  selectedReciterCard: {
    backgroundColor: Theme.colors.successLight,
    borderColor: Theme.colors.success,
  },
  reciterCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reciterInfo: {
    flex: 1,
  },
  reciterCardName: {
    fontSize: 17,
    fontWeight: '600',
    color: Theme.colors.primary,
    marginBottom: 4,
  },
  selectedReciterName: {
    color: Theme.colors.success,
    fontWeight: '700',
  },
  reciterCardArabicName: {
    fontSize: 15,
    color: Theme.colors.textSecondary,
    marginBottom: 4,
    fontFamily: 'UthmanicFont',
  },
  selectedReciterArabicName: {
    color: Theme.colors.success,
  },
  reciterCardDetails: {
    fontSize: 13,
    color: Theme.colors.textMuted,
    fontStyle: 'italic',
  },
  selectedReciterDetails: {
    color: Theme.colors.success,
    fontWeight: '600',
  },
  checkmarkCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Theme.colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});
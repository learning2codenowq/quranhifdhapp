import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Theme, getThemedColors } from '../styles/theme';
import { QuranUtils } from '../utils/QuranUtils';

export default function WeeklyProgress({ state, darkMode = false }) {
  const [weekData, setWeekData] = useState([]);
  const themedColors = getThemedColors(darkMode);

  useEffect(() => {
    console.log('📅 WeeklyProgress: Regenerating week data');
    generateWeekData();
  }, [state?.progress, state?.settings?.dailyGoal, darkMode]);

  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const generateWeekData = () => {
    const today = new Date();
    const todayStr = getTodayDateString();
    
    console.log('📅 Today:', today.toDateString());
    console.log('📅 Today string:', todayStr);
    console.log('📅 Today day of week:', today.getDay()); // 0 = Sunday, 5 = Friday
    
    // Get day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const todayDayOfWeek = today.getDay();
    
    // Calculate days since Monday (Monday = 0, Tuesday = 1, ..., Sunday = 6)
    let daysSinceMonday;
    if (todayDayOfWeek === 0) {
      // Sunday
      daysSinceMonday = 6;
    } else {
      // Monday to Saturday
      daysSinceMonday = todayDayOfWeek - 1;
    }
    
    console.log('📅 Days since Monday:', daysSinceMonday);
    
    // Get Monday of this week
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysSinceMonday);
    monday.setHours(0, 0, 0, 0);
    
    console.log('📅 Monday of this week:', monday.toDateString());

    const dailyGoal = state?.settings?.dailyGoal || 10;
    const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    
    const data = weekDays.map((dayLetter, index) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + index);
      
      const dateStr = getDateString(date);
      const isToday = dateStr === todayStr;
      
      // Compare dates properly
      const dateOnly = new Date(date);
      dateOnly.setHours(0, 0, 0, 0);
      const todayOnly = new Date(today);
      todayOnly.setHours(0, 0, 0, 0);
      
      const isFuture = dateOnly > todayOnly;
      
      const progress = state?.progress?.[dateStr] || 0;
      
      console.log(`📅 ${dayLetter} (${date.toDateString()}, ${dateStr}): isToday=${isToday}, progress=${progress}, goal=${dailyGoal}, isFuture=${isFuture}`);
      
      let status = 'future';
      
      if (isFuture) {
        status = 'future';
      } else if (isToday) {
        status = progress >= dailyGoal ? 'completed' : 'pending';
      } else {
        status = progress >= dailyGoal ? 'completed' : 'failed';
      }
      
      console.log(`📅 ${dayLetter} final status:`, status);
      
      return {
        day: dayLetter,
        isToday,
        status,
        dateStr,
        progress,
        dailyGoal
      };
    });
    
    setWeekData(data);
  };

  const getDotColor = (status) => {
    switch (status) {
      case 'completed':
        return Theme.colors.success;
      case 'failed':
        return Theme.colors.error;
      case 'pending':
        return darkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(34, 87, 93, 0.3)';
      case 'future':
        return darkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
      default:
        return Theme.colors.gray300;
    }
  };

  const getDotSize = (isToday) => {
    return isToday ? 14 : 10;
  };

  return (
    <View style={styles.weekSection}>
      <Text style={[
        styles.sectionTitle,
        darkMode && { color: themedColors.textPrimary }
      ]}>
        This Week
      </Text>
      <View style={[
        styles.weekCard,
        darkMode && { backgroundColor: themedColors.cardBackground }
      ]}>
        <View style={styles.weekDays}>
          {weekData.map((dayData, index) => (
            <View key={index} style={styles.weekDayItem}>
              <Text style={[
                styles.weekDayLabel,
                dayData.isToday && styles.weekDayLabelToday,
                darkMode && !dayData.isToday && { color: themedColors.textMuted },
                darkMode && dayData.isToday && { color: themedColors.primary }
              ]}>
                {dayData.day}
              </Text>
              <View style={[
                styles.weekDayDot,
                { 
                  backgroundColor: getDotColor(dayData.status),
                  width: getDotSize(dayData.isToday),
                  height: getDotSize(dayData.isToday),
                  borderRadius: getDotSize(dayData.isToday) / 2,
                },
                dayData.isToday && {
                  borderWidth: 2,
                  borderColor: darkMode ? themedColors.primary : Theme.colors.primary,
                }
              ]} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  weekSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Theme.colors.textOnDark,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  weekCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    ...Theme.shadows.sm,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekDayItem: {
    alignItems: 'center',
    gap: 10,
  },
  weekDayLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Theme.colors.textSecondary,
    letterSpacing: 0.2,
  },
  weekDayLabelToday: {
    color: Theme.colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  weekDayDot: {
    // Size is set dynamically in component
  },
});
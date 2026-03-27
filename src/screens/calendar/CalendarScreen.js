import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows, CategoryColors } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';
import EmergencyButton from '../../components/EmergencyButton';

export default function CalendarScreen({ navigation }) {
  const { userProfile } = useAuth();
  const { tasks, getMemberById } = useApp();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const isAdmin = userProfile?.role === 'admin';

  // Build marked dates for calendar
  const markedDates = useMemo(() => {
    const marks = {};
    const relevantTasks = isAdmin
      ? tasks
      : tasks.filter((t) => t.assignedTo === userProfile?.id || (t.createdBy === userProfile?.id && !t.assignedTo));

    relevantTasks.forEach((task) => {
      if (!task.dueDate) return;
      try {
        const date = task.dueDate?.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
        const key = format(date, 'yyyy-MM-dd');
        if (!marks[key]) {
          marks[key] = { dots: [], marked: true };
        }
        const color = CategoryColors[task.category] || Colors.primary;
        if (marks[key].dots.length < 3) {
          marks[key].dots.push({ color, key: task.id });
        }
      } catch {}
    });

    if (marks[selectedDate]) {
      marks[selectedDate] = { ...marks[selectedDate], selected: true, selectedColor: Colors.primary };
    } else {
      marks[selectedDate] = { selected: true, selectedColor: Colors.primary };
    }

    return marks;
  }, [tasks, selectedDate, userProfile, isAdmin]);

  // Tasks for selected day
  const tasksForDay = useMemo(() => {
    const relevantTasks = isAdmin
      ? tasks
      : tasks.filter((t) => t.assignedTo === userProfile?.id || (t.createdBy === userProfile?.id && !t.assignedTo));

    return relevantTasks.filter((task) => {
      if (!task.dueDate) return false;
      try {
        const date = task.dueDate?.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
        return format(date, 'yyyy-MM-dd') === selectedDate;
      } catch {
        return false;
      }
    });
  }, [tasks, selectedDate, userProfile, isAdmin]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <Calendar
          markingType="multi-dot"
          markedDates={markedDates}
          onDayPress={(day) => setSelectedDate(day.dateString)}
          theme={{
            backgroundColor: Colors.background,
            calendarBackground: Colors.surface,
            textSectionTitleColor: Colors.textSecondary,
            selectedDayBackgroundColor: Colors.primary,
            selectedDayTextColor: '#fff',
            todayTextColor: Colors.primary,
            dayTextColor: Colors.textPrimary,
            textDisabledColor: Colors.textLight,
            dotColor: Colors.primary,
            selectedDotColor: '#fff',
            arrowColor: Colors.primary,
            monthTextColor: Colors.textPrimary,
            indicatorColor: Colors.primary,
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600',
          }}
          style={styles.calendar}
        />

        {/* Selected day tasks */}
        <View style={styles.daySection}>
          <Text style={styles.dayTitle}>
            {format(new Date(selectedDate + 'T12:00:00'), 'EEEE, MMMM d')}
          </Text>

          {tasksForDay.length === 0 ? (
            <View style={styles.empty}>
              <MaterialCommunityIcons name="calendar-check-outline" size={36} color={Colors.textLight} />
              <Text style={styles.emptyText}>Nothing scheduled</Text>
            </View>
          ) : (
            tasksForDay.map((task) => {
              const assignedTo = task.assignedTo ? getMemberById(task.assignedTo) : null;
              const createdBy = getMemberById(task.createdBy);
              const catColor = CategoryColors[task.category] || Colors.primary;

              return (
                <View key={task.id} style={styles.calTaskCard}>
                  <View style={[styles.calTaskStripe, { backgroundColor: catColor }]} />
                  <View style={styles.calTaskBody}>
                    <Text style={[styles.calTaskTitle, task.status === 'completed' && styles.calTaskTitleDone]}>
                      {task.title}
                    </Text>
                    <View style={styles.calTaskMeta}>
                      {task.dueTime && (
                        <View style={styles.metaItem}>
                          <MaterialCommunityIcons name="clock-outline" size={12} color={Colors.textSecondary} />
                          <Text style={styles.metaText}>{task.dueTime}</Text>
                        </View>
                      )}
                      {assignedTo && (
                        <View style={styles.metaItem}>
                          <MaterialCommunityIcons name="account" size={12} color={Colors.textSecondary} />
                          <Text style={styles.metaText}>{assignedTo.name}</Text>
                        </View>
                      )}
                      <View style={[styles.catBadge, { backgroundColor: catColor + '20' }]}>
                        <Text style={[styles.catText, { color: catColor }]}>{task.category}</Text>
                      </View>
                    </View>
                  </View>
                  {task.status === 'completed' && (
                    <MaterialCommunityIcons name="check-circle" size={22} color={Colors.success} style={{ marginRight: Spacing.sm }} />
                  )}
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
        activeOpacity={0.85}
      >
        <MaterialCommunityIcons name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <EmergencyButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.base,
    paddingTop: Spacing.lg,
  },
  title: { fontSize: Typography.xl, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  calendar: {
    borderRadius: Radius.lg,
    marginHorizontal: Spacing.base,
    ...Shadows.sm,
    overflow: 'hidden',
  },
  daySection: { padding: Spacing.base, paddingTop: Spacing.lg },
  dayTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  empty: { alignItems: 'center', paddingVertical: Spacing.xl, gap: Spacing.sm },
  emptyText: { fontSize: Typography.sm, color: Colors.textLight },
  calTaskCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    alignItems: 'center',
    ...Shadows.sm,
  },
  calTaskStripe: { width: 5, alignSelf: 'stretch' },
  calTaskBody: { flex: 1, padding: Spacing.base },
  calTaskTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  calTaskTitleDone: { textDecorationLine: 'line-through', color: Colors.textSecondary },
  calTaskMeta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaText: { fontSize: Typography.xs, color: Colors.textSecondary },
  catBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  catText: { fontSize: 10, fontWeight: '600', textTransform: 'capitalize' },
  fab: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
  },
});

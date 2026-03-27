import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import EmergencyButton from '../../components/EmergencyButton';
import { format } from 'date-fns';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export default function SimpleDashboard({ navigation }) {
  const { userProfile } = useAuth();
  const { tasks, householdTasks, completeTask, getMemberById } = useApp();

  const largeText = userProfile?.largeText;
  const fs = (size) => largeText ? Math.round(size * 1.3) : size;

  const firstName = userProfile?.name?.split(' ')[0] || 'there';

  const myPendingTasks = useMemo(
    () => tasks.filter((t) => (t.assignedTo === userProfile?.id || (t.createdBy === userProfile?.id && !t.assignedTo)) && t.status === 'pending'),
    [tasks, userProfile]
  );

  const assignedToMe = myPendingTasks.filter((t) => t.assignedTo === userProfile?.id && t.createdBy !== userProfile?.id);
  const myOwn = myPendingTasks.filter((t) => !(t.assignedTo === userProfile?.id && t.createdBy !== userProfile?.id));

  const openHouseholdTasks = householdTasks.filter((t) => t.status !== 'done');

  const handleComplete = async (taskId, task) => {
    await completeTask(taskId);
  };

  const categoryColors = {
    appointment: '#4A90D9',
    medication: '#9B59B6',
    errand: '#E67E22',
    call: '#1ABC9C',
    chore: '#27AE60',
    other: '#6B7280',
  };

  return (
    <SafeAreaView style={[styles.safe, userProfile?.highContrast && styles.safeHC]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Big friendly header */}
        <LinearGradient colors={[Colors.teal, '#2D8A85']} style={styles.header}>
          <Text style={[styles.greeting, { fontSize: fs(Typography.base) }]}>{getGreeting()},</Text>
          <Text style={[styles.name, { fontSize: fs(Typography.xxxl) }]}>{firstName}! 👋</Text>
          <Text style={[styles.date, { fontSize: fs(Typography.sm) }]}>
            {format(new Date(), 'EEEE, MMMM d')}
          </Text>

          {/* Big summary message */}
          <View style={styles.summaryBox}>
            {assignedToMe.length > 0 ? (
              <Text style={[styles.summaryText, { fontSize: fs(Typography.base) }]}>
                You have <Text style={styles.summaryBold}>{assignedToMe.length} task{assignedToMe.length !== 1 ? 's' : ''}</Text> waiting for you today
              </Text>
            ) : myPendingTasks.length > 0 ? (
              <Text style={[styles.summaryText, { fontSize: fs(Typography.base) }]}>
                You have <Text style={styles.summaryBold}>{myPendingTasks.length} thing{myPendingTasks.length !== 1 ? 's' : ''}</Text> on your list
              </Text>
            ) : (
              <Text style={[styles.summaryText, { fontSize: fs(Typography.base) }]}>
                🎉 You're all done! Great job!
              </Text>
            )}
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Tasks assigned by family */}
          {assignedToMe.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontSize: fs(Typography.md) }]}>
                Family asked you to do:
              </Text>
              {assignedToMe.map((task) => {
                const from = getMemberById(task.createdBy);
                return (
                  <View key={task.id} style={styles.bigTaskCard}>
                    <View style={[styles.bigTaskLeft, { backgroundColor: categoryColors[task.category] || Colors.primary }]}>
                      <MaterialCommunityIcons name="account-heart" size={fs(20)} color="#fff" />
                      <Text style={[styles.bigTaskFrom, { fontSize: fs(Typography.xs) }]}>
                        From {from?.name || 'Family'}
                      </Text>
                    </View>
                    <View style={styles.bigTaskContent}>
                      <Text style={[styles.bigTaskTitle, { fontSize: fs(Typography.md) }]}>{task.title}</Text>
                      {task.dueDate && (
                        <Text style={[styles.bigTaskDue, { fontSize: fs(Typography.sm) }]}>
                          📅 {format(task.dueDate?.toDate ? task.dueDate.toDate() : new Date(task.dueDate), 'MMM d')}
                          {task.dueTime ? ` at ${task.dueTime}` : ''}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      style={styles.bigCheckBtn}
                      onPress={() => handleComplete(task.id, task)}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={fs(44)} color={Colors.success} />
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          {/* My own tasks */}
          {myOwn.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontSize: fs(Typography.md) }]}>My Tasks</Text>
              {myOwn.map((task) => (
                <View key={task.id} style={styles.bigTaskCard}>
                  <View style={[styles.bigTaskLeft, { backgroundColor: categoryColors[task.category] || Colors.navy }]}>
                    <MaterialCommunityIcons name="clipboard-text" size={fs(20)} color="#fff" />
                  </View>
                  <View style={styles.bigTaskContent}>
                    <Text style={[styles.bigTaskTitle, { fontSize: fs(Typography.md) }]}>{task.title}</Text>
                    {task.dueDate && (
                      <Text style={[styles.bigTaskDue, { fontSize: fs(Typography.sm) }]}>
                        📅 {format(task.dueDate?.toDate ? task.dueDate.toDate() : new Date(task.dueDate), 'MMM d')}
                        {task.dueTime ? ` at ${task.dueTime}` : ''}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.bigCheckBtn}
                    onPress={() => handleComplete(task.id, task)}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={fs(44)} color={Colors.success} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Household tasks */}
          {openHouseholdTasks.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { fontSize: fs(Typography.md) }]}>Household Needs</Text>
              {openHouseholdTasks.slice(0, 5).map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={styles.houseTaskCard}
                  onPress={() => navigation.navigate('Household')}
                >
                  <MaterialCommunityIcons name="home-outline" size={fs(22)} color={Colors.warning} />
                  <Text style={[styles.houseTaskTitle, { fontSize: fs(Typography.base) }]} numberOfLines={1}>
                    {task.title}
                  </Text>
                  <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.textLight} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Add task button */}
          <TouchableOpacity
            style={styles.addTaskBtn}
            onPress={() => navigation.navigate('AddTask')}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="plus" size={fs(22)} color="#fff" />
            <Text style={[styles.addTaskBtnText, { fontSize: fs(Typography.base) }]}>Add a Reminder</Text>
          </TouchableOpacity>

          {/* Settings */}
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => navigation.navigate('Settings')}
          >
            <MaterialCommunityIcons name="cog-outline" size={fs(18)} color={Colors.textSecondary} />
            <Text style={[styles.settingsBtnText, { fontSize: fs(Typography.sm) }]}>Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <EmergencyButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  safeHC: { backgroundColor: '#000' },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl + 10,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  greeting: { color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  name: { fontWeight: Typography.fontWeight.extrabold, color: '#fff', marginTop: 2 },
  date: { color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  summaryBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginTop: Spacing.lg,
  },
  summaryText: { color: '#fff', lineHeight: 24 },
  summaryBold: { fontWeight: Typography.fontWeight.extrabold },
  body: { padding: Spacing.base, paddingTop: Spacing.lg },
  section: { marginBottom: Spacing.xl },
  sectionTitle: {
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  bigTaskCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    minHeight: 80,
    ...Shadows.md,
  },
  bigTaskLeft: {
    width: 64,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: Spacing.sm,
  },
  bigTaskFrom: {
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  bigTaskContent: {
    flex: 1,
    padding: Spacing.base,
    justifyContent: 'center',
  },
  bigTaskTitle: {
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  bigTaskDue: {
    color: Colors.textSecondary,
    marginTop: 4,
  },
  bigCheckBtn: {
    justifyContent: 'center',
    paddingHorizontal: Spacing.base,
  },
  houseTaskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  houseTaskTitle: {
    flex: 1,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  addTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.teal,
    borderRadius: Radius.full,
    paddingVertical: Spacing.base + 2,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    ...Shadows.md,
  },
  addTaskBtnText: {
    color: '#fff',
    fontWeight: Typography.fontWeight.bold,
  },
  settingsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  settingsBtnText: { color: Colors.textSecondary },
});

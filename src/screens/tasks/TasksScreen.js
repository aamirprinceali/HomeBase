import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import TaskCard from '../../components/TaskCard';
import EmergencyButton from '../../components/EmergencyButton';

const FILTERS = ['All', 'Mine', 'Assigned', 'Done'];

export default function TasksScreen({ navigation }) {
  const { userProfile } = useAuth();
  const { tasks, completeTask, uncompleteTask, deleteTask, getMemberById } = useApp();
  const [filter, setFilter] = useState('All');

  const isAdmin = userProfile?.role === 'admin';
  const largeText = userProfile?.largeText;

  const filteredTasks = useMemo(() => {
    const uid = userProfile?.id;
    let result = tasks.filter((t) => t.assignedTo === uid || (t.createdBy === uid && !t.assignedTo) || t.assignedTo === uid);

    // Also show tasks admin created and assigned to others
    if (isAdmin) {
      result = tasks;
    }

    switch (filter) {
      case 'Mine':
        return result.filter((t) => t.createdBy === uid && (!t.assignedTo || t.assignedTo === uid) && t.status === 'pending');
      case 'Assigned':
        return result.filter((t) => t.assignedTo === uid && t.createdBy !== uid && t.status === 'pending');
      case 'Done':
        return result.filter((t) => t.status === 'completed' && (isAdmin || t.assignedTo === uid || t.createdBy === uid));
      default:
        return result.filter((t) => t.status === 'pending');
    }
  }, [tasks, filter, userProfile, isAdmin]);

  const handleComplete = async (task) => {
    if (task.status === 'completed') {
      await uncompleteTask(task.id);
    } else {
      await completeTask(task.id);
    }
  };

  const handleDelete = (taskId) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTask(taskId) },
    ]);
  };

  const getAssignerName = (task) => {
    if (task.assignedTo === userProfile?.id && task.createdBy !== userProfile?.id) {
      const member = getMemberById(task.createdBy);
      return member?.name || 'Someone';
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Tasks</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddTask')}
        >
          <MaterialCommunityIcons name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.list} contentContainerStyle={{ padding: Spacing.base, paddingBottom: 100 }}>
        {filteredTasks.length === 0 ? (
          <View style={styles.empty}>
            <MaterialCommunityIcons name="clipboard-check-outline" size={48} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>Nothing here</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'Done' ? 'No completed tasks yet' : 'Tap + to add a task'}
            </Text>
          </View>
        ) : (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={() => handleComplete(task)}
              onDelete={() => handleDelete(task.id)}
              memberName={getAssignerName(task)}
              largeText={largeText}
            />
          ))
        )}
      </ScrollView>
      <EmergencyButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.base,
    paddingTop: Spacing.lg,
  },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  filterTab: {
    paddingHorizontal: Spacing.base,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterTabText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
  filterTabTextActive: { color: '#fff' },
  list: { flex: 1 },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: Spacing.sm,
  },
  emptyTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textSecondary,
  },
  emptySubtitle: { fontSize: Typography.sm, color: Colors.textLight },
});

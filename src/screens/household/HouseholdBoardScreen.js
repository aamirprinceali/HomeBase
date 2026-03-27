import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import HouseholdTaskCard from '../../components/HouseholdTaskCard';
import EmergencyButton from '../../components/EmergencyButton';

export default function HouseholdBoardScreen() {
  const { userProfile } = useAuth();
  const {
    householdTasks,
    addHouseholdTask,
    claimHouseholdTask,
    unclaimHouseholdTask,
    setHouseholdTaskDate,
    completeHouseholdTask,
    deleteHouseholdTask,
    getMemberById,
  } = useApp();

  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dateModalTask, setDateModalTask] = useState(null);
  const [plannedDate, setPlannedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('open'); // 'open' | 'done'

  const isAdmin = userProfile?.role === 'admin';

  const filtered = householdTasks.filter((t) =>
    filter === 'done' ? t.status === 'done' : t.status !== 'done'
  );

  const handleAdd = async () => {
    if (!title.trim()) {
      Alert.alert('Name Required', 'What needs to get done?');
      return;
    }
    setLoading(true);
    try {
      await addHouseholdTask({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
      setShowAdd(false);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetDate = async () => {
    if (!plannedDate.trim()) return;
    const d = new Date(plannedDate);
    if (isNaN(d.getTime())) {
      Alert.alert('Invalid Date', 'Please enter a date like 2024-12-25');
      return;
    }
    await setHouseholdTaskDate(dateModalTask, d);
    setDateModalTask(null);
    setPlannedDate('');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Household Board</Text>
          <Text style={styles.subtitle}>Things that need to get done around the house</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowAdd(true)}>
          <MaterialCommunityIcons name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filter */}
      <View style={styles.filterRow}>
        {['open', 'done'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
              {f === 'open' ? 'Open Tasks' : 'Completed'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <MaterialCommunityIcons name="home-check-outline" size={52} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>
              {filter === 'open' ? 'No open tasks' : 'Nothing completed yet'}
            </Text>
            {filter === 'open' && (
              <Text style={styles.emptySubtitle}>Tap + to add something that needs doing</Text>
            )}
          </View>
        ) : (
          filtered.map((task) => {
            const poster = getMemberById(task.postedBy);
            const claimer = task.claimedBy ? getMemberById(task.claimedBy) : null;
            return (
              <HouseholdTaskCard
                key={task.id}
                task={task}
                currentUserId={userProfile?.id}
                memberName={poster?.name}
                claimedByName={claimer?.name}
                onClaim={() => claimHouseholdTask(task.id)}
                onUnclaim={() => unclaimHouseholdTask(task.id)}
                onComplete={() => {
                  Alert.alert('Mark as Done?', `Are you sure "${task.title}" is complete?`, [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Mark Done', onPress: () => completeHouseholdTask(task.id) },
                  ]);
                }}
                onSetDate={() => setDateModalTask(task.id)}
                onDelete={() => {
                  Alert.alert('Delete Task', 'Remove this from the household board?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => deleteHouseholdTask(task.id) },
                  ]);
                }}
                isAdmin={isAdmin}
              />
            );
          })
        )}
      </ScrollView>

      {/* Add task modal */}
      <Modal visible={showAdd} transparent animationType="slide" onRequestClose={() => setShowAdd(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Add Household Task</Text>
              <Text style={styles.modalSubtitle}>Let the household know what needs doing</Text>

              <TextInput
                style={styles.modalInput}
                placeholder="e.g. Call the electrician"
                placeholderTextColor={Colors.textLight}
                value={title}
                onChangeText={setTitle}
                autoFocus
              />
              <TextInput
                style={[styles.modalInput, styles.modalTextArea]}
                placeholder="Details (optional)..."
                placeholderTextColor={Colors.textLight}
                value={description}
                onChangeText={setDescription}
                multiline
              />

              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setShowAdd(false)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalSave, loading && { opacity: 0.6 }]}
                  onPress={handleAdd}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.modalSaveText}>Add Task</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Set date modal */}
      <Modal visible={!!dateModalTask} transparent animationType="slide" onRequestClose={() => setDateModalTask(null)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Set Planned Date</Text>
              <Text style={styles.modalSubtitle}>When do you plan to get this done?</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="YYYY-MM-DD (e.g. 2024-12-25)"
                placeholderTextColor={Colors.textLight}
                value={plannedDate}
                onChangeText={setPlannedDate}
                keyboardType="numbers-and-punctuation"
                autoFocus
              />
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setDateModalTask(null)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSave} onPress={handleSetDate}>
                  <Text style={styles.modalSaveText}>Set Date</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <EmergencyButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.base,
    paddingTop: Spacing.lg,
  },
  title: { fontSize: Typography.xl, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  subtitle: { fontSize: Typography.sm, color: Colors.textSecondary, marginTop: 2 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.warning,
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
  filterTabActive: { backgroundColor: Colors.warning, borderColor: Colors.warning },
  filterTabText: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: '500' },
  filterTabTextActive: { color: '#fff' },
  list: { padding: Spacing.base, paddingBottom: 100 },
  empty: { alignItems: 'center', paddingTop: 80, gap: Spacing.sm },
  emptyTitle: { fontSize: Typography.lg, fontWeight: Typography.fontWeight.bold, color: Colors.textSecondary },
  emptySubtitle: { fontSize: Typography.sm, color: Colors.textLight },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.xl,
    paddingBottom: 40,
    gap: Spacing.md,
  },
  modalTitle: { fontSize: Typography.lg, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  modalSubtitle: { fontSize: Typography.sm, color: Colors.textSecondary },
  modalInput: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.base,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  modalTextArea: { minHeight: 80, textAlignVertical: 'top' },
  modalActions: { flexDirection: 'row', gap: Spacing.sm },
  modalCancel: {
    flex: 1,
    paddingVertical: Spacing.base,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  modalCancelText: { fontSize: Typography.base, color: Colors.textSecondary, fontWeight: '500' },
  modalSave: {
    flex: 2,
    paddingVertical: Spacing.base,
    borderRadius: Radius.full,
    backgroundColor: Colors.warning,
    alignItems: 'center',
  },
  modalSaveText: { fontSize: Typography.base, color: '#fff', fontWeight: Typography.fontWeight.bold },
});

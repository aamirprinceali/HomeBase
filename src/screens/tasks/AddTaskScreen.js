import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows, CategoryColors, CategoryIcons } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const CATEGORIES = ['appointment', 'medication', 'errand', 'call', 'chore', 'other'];
const RECURRING_OPTIONS = ['daily', 'weekly', 'monthly'];

export default function AddTaskScreen({ navigation, route }) {
  const { userProfile } = useAuth();
  const { addTask, members } = useApp();

  const preAssignTo = route?.params?.assignTo || null;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState('weekly');
  const [assignTo, setAssignTo] = useState(preAssignTo);
  const [loading, setLoading] = useState(false);

  const isAdmin = userProfile?.role === 'admin';
  const otherMembers = members.filter((m) => m.id !== userProfile?.id);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Title Required', 'Please give your task a name.');
      return;
    }

    let parsedDate = null;
    if (dueDate.trim()) {
      const d = new Date(dueDate);
      if (isNaN(d.getTime())) {
        Alert.alert('Invalid Date', 'Please enter a date like: 2024-12-25');
        return;
      }
      parsedDate = d;
    }

    setLoading(true);
    try {
      await addTask({
        title: title.trim(),
        description: description.trim(),
        category,
        dueDate: parsedDate,
        dueTime: dueTime.trim() || null,
        isRecurring,
        recurringInterval: isRecurring ? recurringInterval : null,
        assignedTo: assignTo || null,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Task</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Title */}
          <View style={styles.field}>
            <Text style={styles.label}>What needs to get done?</Text>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="e.g. Call the electrician"
                placeholderTextColor={Colors.textLight}
                value={title}
                onChangeText={setTitle}
                autoFocus
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.field}>
            <Text style={styles.label}>Notes (optional)</Text>
            <View style={[styles.inputWrap, styles.textAreaWrap]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Any extra details..."
                placeholderTextColor={Colors.textLight}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Category */}
          <View style={styles.field}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryChip,
                    category === cat && { backgroundColor: CategoryColors[cat], borderColor: CategoryColors[cat] },
                  ]}
                  onPress={() => setCategory(cat)}
                >
                  <MaterialCommunityIcons
                    name={CategoryIcons[cat]}
                    size={16}
                    color={category === cat ? '#fff' : CategoryColors[cat]}
                  />
                  <Text
                    style={[
                      styles.categoryChipText,
                      category === cat && { color: '#fff' },
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Due date */}
          <View style={styles.row}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Due Date (optional)</Text>
              <View style={styles.inputWrap}>
                <MaterialCommunityIcons name="calendar" size={18} color={Colors.textLight} />
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.textLight}
                  value={dueDate}
                  onChangeText={setDueDate}
                  keyboardType="numbers-and-punctuation"
                />
              </View>
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Time (optional)</Text>
              <View style={styles.inputWrap}>
                <MaterialCommunityIcons name="clock-outline" size={18} color={Colors.textLight} />
                <TextInput
                  style={styles.input}
                  placeholder="9:00 AM"
                  placeholderTextColor={Colors.textLight}
                  value={dueTime}
                  onChangeText={setDueTime}
                />
              </View>
            </View>
          </View>

          {/* Recurring */}
          <View style={styles.field}>
            <View style={styles.switchRow}>
              <View>
                <Text style={styles.label}>Recurring Task</Text>
                <Text style={styles.switchSubtitle}>Repeat this task automatically</Text>
              </View>
              <Switch
                value={isRecurring}
                onValueChange={setIsRecurring}
                trackColor={{ true: Colors.primary }}
                thumbColor="#fff"
              />
            </View>
            {isRecurring && (
              <View style={styles.recurringOptions}>
                {RECURRING_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[
                      styles.recurringChip,
                      recurringInterval === opt && styles.recurringChipActive,
                    ]}
                    onPress={() => setRecurringInterval(opt)}
                  >
                    <Text
                      style={[
                        styles.recurringChipText,
                        recurringInterval === opt && styles.recurringChipTextActive,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Assign to (admin + member can assign) */}
          {otherMembers.length > 0 && (
            <View style={styles.field}>
              <Text style={styles.label}>Assign To (optional)</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.memberScroll}>
                <TouchableOpacity
                  style={[styles.memberChip, !assignTo && styles.memberChipActive]}
                  onPress={() => setAssignTo(null)}
                >
                  <Text style={[styles.memberChipText, !assignTo && styles.memberChipTextActive]}>Just me</Text>
                </TouchableOpacity>
                {otherMembers.map((m) => (
                  <TouchableOpacity
                    key={m.id}
                    style={[
                      styles.memberChip,
                      assignTo === m.id && styles.memberChipActive,
                      assignTo === m.id && { borderColor: m.profileColor || Colors.primary },
                    ]}
                    onPress={() => setAssignTo(m.id)}
                  >
                    <View style={[styles.memberDot, { backgroundColor: m.profileColor || Colors.primary }]} />
                    <Text style={[styles.memberChipText, assignTo === m.id && styles.memberChipTextActive]}>
                      {m.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Save */}
          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
            onPress={handleSave}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <MaterialCommunityIcons name="check" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>Save Task</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.xl, paddingBottom: 60 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  field: { marginBottom: Spacing.lg },
  row: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  textAreaWrap: { alignItems: 'flex-start', paddingVertical: Spacing.sm },
  input: { flex: 1, fontSize: Typography.base, color: Colors.textPrimary },
  textArea: { minHeight: 70, textAlignVertical: 'top' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 5,
    backgroundColor: Colors.surface,
  },
  categoryChipText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
    fontWeight: Typography.fontWeight.medium,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchSubtitle: { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 2 },
  recurringOptions: { flexDirection: 'row', gap: Spacing.sm, marginTop: Spacing.sm },
  recurringChip: {
    paddingHorizontal: Spacing.base,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  recurringChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  recurringChipText: { fontSize: Typography.sm, color: Colors.textSecondary, textTransform: 'capitalize', fontWeight: '500' },
  recurringChipTextActive: { color: '#fff' },
  memberScroll: { marginTop: 4 },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginRight: Spacing.sm,
    gap: 6,
  },
  memberChipActive: { backgroundColor: Colors.primary + '15', borderColor: Colors.primary },
  memberDot: { width: 10, height: 10, borderRadius: 5 },
  memberChipText: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: '500' },
  memberChipTextActive: { color: Colors.primary, fontWeight: Typography.fontWeight.semibold },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: Spacing.base,
    gap: Spacing.sm,
    marginTop: Spacing.md,
    ...Shadows.md,
  },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontSize: Typography.base, fontWeight: Typography.fontWeight.bold, color: '#fff' },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../theme';
import { useApp } from '../../context/AppContext';
import { EXPENSE_CATEGORIES } from './FinancesScreen';

export default function AddExpenseScreen({ navigation }) {
  const { addExpense } = useApp();

  // ── Form state ───────────────────────────────────────────────────────────────
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  // ── Save handler ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      Alert.alert('Enter an amount', 'Please enter a valid dollar amount.');
      return;
    }
    try {
      setSaving(true);
      await addExpense({
        amount: parsed,
        category,
        note: note.trim(),
        date: new Date(), // Firestore will convert this to a timestamp
      });
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Could not save expense. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ── Top bar ──────────────────────────────────────────────────────── */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add Expense</Text>
          <TouchableOpacity onPress={handleSave} disabled={saving} style={styles.saveBtn}>
            <Text style={styles.saveText}>{saving ? 'Saving…' : 'Save'}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">

          {/* ── Amount input ─────────────────────────────────────────────── */}
          <View style={styles.amountContainer}>
            <Text style={styles.dollarSign}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={Colors.textLight}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
              maxLength={10}
              autoFocus
            />
          </View>

          {/* ── Category picker ──────────────────────────────────────────── */}
          <Text style={styles.fieldLabel}>Category</Text>
          <View style={styles.categoryGrid}>
            {EXPENSE_CATEGORIES.map((cat) => {
              const selected = category === cat.key;
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[
                    styles.catChip,
                    selected && { backgroundColor: cat.color, borderColor: cat.color },
                  ]}
                  onPress={() => setCategory(cat.key)}
                >
                  <MaterialCommunityIcons
                    name={cat.icon}
                    size={20}
                    color={selected ? '#fff' : cat.color}
                  />
                  <Text style={[styles.catChipText, selected && { color: '#fff' }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── Note input ───────────────────────────────────────────────── */}
          <Text style={styles.fieldLabel}>Note (optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="e.g. Groceries at Walmart"
            placeholderTextColor={Colors.textLight}
            value={note}
            onChangeText={setNote}
            maxLength={80}
          />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  // Top bar
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title: { fontSize: Typography.base, fontFamily: Typography.fontFamily.semibold, color: Colors.textPrimary },
  cancelBtn: { padding: Spacing.xs },
  cancelText: { fontSize: Typography.base, color: Colors.textSecondary },
  saveBtn: { padding: Spacing.xs },
  saveText: { fontSize: Typography.base, color: Colors.success, fontFamily: Typography.fontFamily.semibold },

  body: { padding: Spacing.base, paddingTop: Spacing.xxl },

  // Amount
  amountContainer: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  dollarSign: { fontSize: 40, color: Colors.textSecondary, marginRight: Spacing.xs, fontFamily: Typography.fontFamily.semibold },
  amountInput: {
    fontSize: 64, color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    minWidth: 180, textAlign: 'center',
  },

  // Field label
  fieldLabel: {
    fontSize: Typography.sm, fontFamily: Typography.fontFamily.semibold,
    color: Colors.textSecondary, marginBottom: Spacing.sm,
  },

  // Category grid — 4 per row
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.xl },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderRadius: Radius.full, backgroundColor: Colors.surfaceAlt,
    borderWidth: 1, borderColor: Colors.border,
  },
  catChipText: { fontSize: Typography.xs, color: Colors.textSecondary, fontFamily: Typography.fontFamily.medium },

  // Note input
  noteInput: {
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    borderRadius: Radius.md, padding: Spacing.md,
    color: Colors.textPrimary, fontSize: Typography.base,
  },
});

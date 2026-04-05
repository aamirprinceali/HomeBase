import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../theme';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { format, startOfWeek, startOfMonth, isAfter } from 'date-fns';

// ── Expense categories with icons and colors ──────────────────────────────────
export const EXPENSE_CATEGORIES = [
  { key: 'food',          label: 'Food',          icon: 'food-fork-drink',      color: '#DDAE79' },
  { key: 'bills',         label: 'Bills',         icon: 'lightning-bolt',       color: '#7D8FEF' },
  { key: 'medical',       label: 'Medical',       icon: 'medical-bag',          color: '#A38CE0' },
  { key: 'personal',      label: 'Personal',      icon: 'account',              color: '#9DB4D3' },
  { key: 'transport',     label: 'Transport',     icon: 'car',                  color: '#7AA6F8' },
  { key: 'shopping',      label: 'Shopping',      icon: 'shopping',             color: '#8BCBC4' },
  { key: 'entertainment', label: 'Fun',           icon: 'movie-open',           color: '#D9818B' },
  { key: 'other',         label: 'Other',         icon: 'dots-horizontal',      color: '#9EACC0' },
];

export const getCategoryMeta = (key) =>
  EXPENSE_CATEGORIES.find((c) => c.key === key) || EXPENSE_CATEGORIES[7];

export default function FinancesScreen({ navigation }) {
  const { expenses, deleteExpense } = useApp();
  const { userProfile } = useAuth();
  const [filter, setFilter] = useState('all'); // 'all' | category key

  // ── Only show this user's expenses ──────────────────────────────────────────
  const myExpenses = useMemo(
    () => expenses.filter((e) => e.createdBy === userProfile?.id),
    [expenses, userProfile]
  );

  // ── Weekly and monthly totals ────────────────────────────────────────────────
  const { weekTotal, monthTotal } = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
    const monthStart = startOfMonth(now);
    let weekTotal = 0;
    let monthTotal = 0;
    myExpenses.forEach((e) => {
      const date = e.date?.toDate ? e.date.toDate() : new Date(e.date);
      if (isAfter(date, weekStart)) weekTotal += e.amount;
      if (isAfter(date, monthStart)) monthTotal += e.amount;
    });
    return { weekTotal, monthTotal };
  }, [myExpenses]);

  // ── Category breakdown for current month ────────────────────────────────────
  const categoryBreakdown = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthExpenses = myExpenses.filter((e) => {
      const date = e.date?.toDate ? e.date.toDate() : new Date(e.date);
      return isAfter(date, monthStart);
    });
    const totals = {};
    monthExpenses.forEach((e) => {
      totals[e.category] = (totals[e.category] || 0) + e.amount;
    });
    return EXPENSE_CATEGORIES
      .map((cat) => ({ ...cat, total: totals[cat.key] || 0 }))
      .filter((cat) => cat.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [myExpenses]);

  // ── Filtered expense list ────────────────────────────────────────────────────
  const displayedExpenses = useMemo(() => {
    const list = filter === 'all' ? myExpenses : myExpenses.filter((e) => e.category === filter);
    return list.slice().sort((a, b) => {
      const da = a.date?.toDate ? a.date.toDate() : new Date(a.date);
      const db2 = b.date?.toDate ? b.date.toDate() : new Date(b.date);
      return db2 - da;
    });
  }, [myExpenses, filter]);

  const formatCurrency = (n) => `$${n.toFixed(2)}`;

  // ── Single expense row ───────────────────────────────────────────────────────
  const renderExpense = ({ item }) => {
    const cat = getCategoryMeta(item.category);
    const date = item.date?.toDate ? item.date.toDate() : new Date(item.date);
    return (
      <View style={styles.expenseRow}>
        {/* Category icon badge */}
        <View style={[styles.iconBadge, { backgroundColor: cat.color + '22' }]}>
          <MaterialCommunityIcons name={cat.icon} size={22} color={cat.color} />
        </View>

        {/* Description + date */}
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseLabel}>{item.note || cat.label}</Text>
          <Text style={styles.expenseDate}>{format(date, 'MMM d, yyyy')}</Text>
        </View>

        {/* Amount + delete */}
        <View style={styles.expenseRight}>
          <Text style={styles.expenseAmount}>{formatCurrency(item.amount)}</Text>
          <TouchableOpacity onPress={() => deleteExpense(item.id)} style={styles.deleteBtn}>
            <MaterialCommunityIcons name="trash-can-outline" size={16} color={Colors.textLight} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Header gradient ─────────────────────────────────────────────── */}
        <LinearGradient colors={[Colors.primaryDark, '#8FA6F5', '#C8D8FF']} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Finances</Text>
              <Text style={styles.headerSub}>Track your spending</Text>
            </View>
            <TouchableOpacity
              style={styles.addBtn}
              onPress={() => navigation.navigate('AddExpense')}
            >
              <MaterialCommunityIcons name="plus" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* ── Summary cards ───────────────────────────────────────────── */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{formatCurrency(weekTotal)}</Text>
              <Text style={styles.summaryLabel}>This Week</Text>
            </View>
            <View style={[styles.summaryCard, styles.summaryCardRight]}>
              <Text style={styles.summaryValue}>{formatCurrency(monthTotal)}</Text>
              <Text style={styles.summaryLabel}>This Month</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Category breakdown ──────────────────────────────────────────── */}
        {categoryBreakdown.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>This Month by Category</Text>
            {categoryBreakdown.map((cat) => {
              const pct = monthTotal > 0 ? (cat.total / monthTotal) * 100 : 0;
              return (
                <TouchableOpacity
                  key={cat.key}
                  style={styles.catRow}
                  onPress={() => setFilter(filter === cat.key ? 'all' : cat.key)}
                >
                  <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                  <Text style={styles.catLabel}>{cat.label}</Text>
                  {/* Progress bar */}
                  <View style={styles.catBarBg}>
                    <View style={[styles.catBarFill, { width: `${pct}%`, backgroundColor: cat.color }]} />
                  </View>
                  <Text style={styles.catAmount}>{formatCurrency(cat.total)}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ── Filter chips ────────────────────────────────────────────────── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
          <TouchableOpacity
            style={[styles.chip, filter === 'all' && styles.chipActive]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.chipText, filter === 'all' && styles.chipTextActive]}>All</Text>
          </TouchableOpacity>
          {EXPENSE_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.key}
              style={[styles.chip, filter === cat.key && { backgroundColor: cat.color }]}
              onPress={() => setFilter(filter === cat.key ? 'all' : cat.key)}
            >
              <MaterialCommunityIcons name={cat.icon} size={14} color={filter === cat.key ? '#fff' : Colors.textSecondary} />
              <Text style={[styles.chipText, filter === cat.key && styles.chipTextActive]}> {cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Expense list ────────────────────────────────────────────────── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {filter === 'all' ? 'All Expenses' : `${getCategoryMeta(filter).label} Expenses`}
          </Text>
          {displayedExpenses.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="wallet-outline" size={48} color={Colors.textLight} />
              <Text style={styles.emptyText}>No expenses yet</Text>
              <Text style={styles.emptySubText}>Tap + to log your first expense</Text>
            </View>
          ) : (
            <FlatList
              data={displayedExpenses}
              keyExtractor={(item) => item.id}
              renderItem={renderExpense}
              scrollEnabled={false}
            />
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: { paddingTop: Spacing.xl, paddingHorizontal: Spacing.base, paddingBottom: Spacing.xxl },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.lg },
  headerTitle: { fontSize: Typography.xl, fontFamily: Typography.fontFamily.bold, color: '#fff' },
  headerSub: { fontSize: Typography.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  addBtn: {
    width: 44, height: 44, borderRadius: Radius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },

  // Summary cards
  summaryRow: { flexDirection: 'row', gap: Spacing.md },
  summaryCard: {
    flex: 1, backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.lg, padding: Spacing.base,
  },
  summaryCardRight: { marginLeft: Spacing.sm },
  summaryValue: { fontSize: Typography.lg, fontFamily: Typography.fontFamily.bold, color: '#fff' },
  summaryLabel: { fontSize: Typography.xs, color: 'rgba(255,255,255,0.7)', marginTop: 2 },

  // Category breakdown
  section: { paddingHorizontal: Spacing.base, marginTop: Spacing.xl },
  sectionTitle: {
    fontSize: Typography.base, fontFamily: Typography.fontFamily.semibold,
    color: Colors.textPrimary, marginBottom: Spacing.md,
  },
  catRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  catDot: { width: 10, height: 10, borderRadius: 5, marginRight: Spacing.sm },
  catLabel: { fontSize: Typography.sm, color: Colors.textSecondary, width: 80 },
  catBarBg: { flex: 1, height: 6, backgroundColor: Colors.surfaceElevated, borderRadius: Radius.full, marginHorizontal: Spacing.sm, overflow: 'hidden' },
  catBarFill: { height: '100%', borderRadius: Radius.full },
  catAmount: { fontSize: Typography.sm, fontFamily: Typography.fontFamily.semibold, color: Colors.textPrimary, width: 60, textAlign: 'right' },

  // Filter chips
  filterScroll: { marginTop: Spacing.lg },
  filterContent: { paddingHorizontal: Spacing.base, gap: Spacing.sm },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs + 2,
    borderRadius: Radius.full, backgroundColor: Colors.surfaceAlt,
    borderWidth: 1, borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: Typography.xs, color: Colors.textSecondary, fontFamily: Typography.fontFamily.medium },
  chipTextActive: { color: '#fff' },

  // Expense rows
  expenseRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface, borderRadius: Radius.md,
    padding: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
    ...Shadows.sm,
  },
  iconBadge: { width: 44, height: 44, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
  expenseInfo: { flex: 1 },
  expenseLabel: { fontSize: Typography.sm, fontFamily: Typography.fontFamily.semibold, color: Colors.textPrimary },
  expenseDate: { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 2 },
  expenseRight: { alignItems: 'flex-end', gap: 4 },
  expenseAmount: { fontSize: Typography.base, fontFamily: Typography.fontFamily.bold, color: Colors.primaryDark },
  deleteBtn: { padding: 4 },

  // Empty state
  emptyState: { alignItems: 'center', paddingVertical: Spacing.xxxl },
  emptyText: { fontSize: Typography.base, color: Colors.textSecondary, marginTop: Spacing.md, fontFamily: Typography.fontFamily.semibold },
  emptySubText: { fontSize: Typography.sm, color: Colors.textLight, marginTop: Spacing.xs },
});

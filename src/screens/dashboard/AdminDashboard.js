import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
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

export default function AdminDashboard({ navigation }) {
  const { userProfile } = useAuth();
  const { tasks, householdTasks, members, household, shoppingItems } = useApp();

  const firstName = userProfile?.name?.split(' ')[0] || 'there';
  const today = format(new Date(), 'EEEE, MMMM d');

  const myPendingTasks = useMemo(
    () => tasks.filter((t) => (t.assignedTo === userProfile?.id || (!t.assignedTo && t.createdBy === userProfile?.id)) && t.status === 'pending'),
    [tasks, userProfile]
  );

  const openHouseholdTasks = useMemo(
    () => householdTasks.filter((t) => t.status !== 'done'),
    [householdTasks]
  );

  const uncheckedShopping = shoppingItems.filter((i) => !i.isChecked).length;

  const getMemberStats = (memberId) => {
    const memberTasks = tasks.filter((t) => t.assignedTo === memberId || (t.createdBy === memberId && !t.assignedTo));
    const pending = memberTasks.filter((t) => t.status === 'pending').length;
    const completed = memberTasks.filter((t) => t.status === 'completed').length;
    return { pending, completed, total: memberTasks.length };
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.name}>{firstName} 👋</Text>
              <Text style={styles.date}>{today}</Text>
            </View>
            <TouchableOpacity
              style={styles.settingsBtn}
              onPress={() => navigation.navigate('Settings')}
            >
              <MaterialCommunityIcons name="cog-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Quick stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{myPendingTasks.length}</Text>
              <Text style={styles.statLabel}>My Tasks</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{openHouseholdTasks.length}</Text>
              <Text style={styles.statLabel}>House Tasks</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{uncheckedShopping}</Text>
              <Text style={styles.statLabel}>Shopping</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{members.length}</Text>
              <Text style={styles.statLabel}>Members</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* My tasks preview */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Tasks</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
                <Text style={styles.sectionLink}>See all</Text>
              </TouchableOpacity>
            </View>
            {myPendingTasks.length === 0 ? (
              <View style={styles.emptyCard}>
                <MaterialCommunityIcons name="check-circle-outline" size={28} color={Colors.success} />
                <Text style={styles.emptyText}>You're all caught up!</Text>
              </View>
            ) : (
              myPendingTasks.slice(0, 3).map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={styles.taskPreviewCard}
                  onPress={() => navigation.navigate('Tasks')}
                >
                  <View style={[styles.taskDot, { backgroundColor: Colors.primary }]} />
                  <Text style={styles.taskPreviewTitle} numberOfLines={1}>{task.title}</Text>
                  {task.dueDate && (
                    <Text style={styles.taskPreviewDate}>
                      {format(task.dueDate?.toDate ? task.dueDate.toDate() : new Date(task.dueDate), 'MMM d')}
                    </Text>
                  )}
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Family Overview */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Family Overview</Text>
            </View>
            {members.map((member) => {
              const stats = getMemberStats(member.id);
              return (
                <View key={member.id} style={styles.memberCard}>
                  <View style={[styles.memberAvatar, { backgroundColor: member.profileColor || Colors.primary }]}>
                    <Text style={styles.memberInitial}>
                      {member.name?.[0]?.toUpperCase() || '?'}
                    </Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <View style={styles.memberNameRow}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <View style={[styles.roleBadge, member.role === 'admin' && styles.roleBadgeAdmin]}>
                        <Text style={[styles.roleText, member.role === 'admin' && styles.roleTextAdmin]}>
                          {member.role}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.memberStats}>
                      <Text style={styles.memberStat}>
                        <Text style={styles.memberStatNum}>{stats.pending}</Text> pending
                      </Text>
                      <Text style={styles.memberStatDivider}>·</Text>
                      <Text style={styles.memberStat}>
                        <Text style={styles.memberStatNum}>{stats.completed}</Text> done
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.assignBtn}
                    onPress={() => navigation.navigate('Tasks', { assignTo: member.id })}
                  >
                    <MaterialCommunityIcons name="plus" size={16} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {/* Household Board Preview */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Household Board</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Household')}>
                <Text style={styles.sectionLink}>See all</Text>
              </TouchableOpacity>
            </View>
            {openHouseholdTasks.length === 0 ? (
              <View style={styles.emptyCard}>
                <MaterialCommunityIcons name="home-check-outline" size={28} color={Colors.success} />
                <Text style={styles.emptyText}>No open household tasks</Text>
              </View>
            ) : (
              openHouseholdTasks.slice(0, 3).map((task) => (
                <TouchableOpacity
                  key={task.id}
                  style={styles.taskPreviewCard}
                  onPress={() => navigation.navigate('Household')}
                >
                  <View style={[styles.taskDot, { backgroundColor: Colors.warning }]} />
                  <Text style={styles.taskPreviewTitle} numberOfLines={1}>{task.title}</Text>
                  <View style={[styles.statusPill, { backgroundColor: task.claimedBy ? Colors.primary + '20' : Colors.warning + '20' }]}>
                    <Text style={{ fontSize: 10, color: task.claimedBy ? Colors.primary : Colors.warning, fontWeight: '600' }}>
                      {task.claimedBy ? 'Claimed' : 'Open'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              {[
                { icon: 'plus-circle', label: 'Add Task', color: Colors.primary, screen: 'AddTask' },
                { icon: 'home-plus', label: 'House Task', color: Colors.warning, screen: 'Household' },
                { icon: 'cart-plus', label: 'Shopping', color: Colors.teal, screen: 'Shopping' },
                { icon: 'calendar-plus', label: 'Calendar', color: Colors.navy, screen: 'Calendar' },
              ].map((action) => (
                <TouchableOpacity
                  key={action.screen}
                  style={styles.quickActionCard}
                  onPress={() => navigation.navigate(action.screen)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.quickActionIcon, { backgroundColor: action.color + '15' }]}>
                    <MaterialCommunityIcons name={action.icon} size={24} color={action.color} />
                  </View>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      <EmergencyButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xl,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: { fontSize: Typography.base, color: 'rgba(255,255,255,0.8)' },
  name: { fontSize: Typography.xxl, fontWeight: Typography.fontWeight.extrabold, color: '#fff' },
  date: { fontSize: Typography.sm, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: Typography.xl,
    fontWeight: Typography.fontWeight.extrabold,
    color: '#fff',
  },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2, textAlign: 'center' },
  body: { padding: Spacing.base },
  section: { marginBottom: Spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  sectionLink: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.fontWeight.medium },
  emptyCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  emptyText: { fontSize: Typography.sm, color: Colors.textSecondary },
  taskPreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.base,
    marginBottom: Spacing.xs,
    gap: Spacing.sm,
    ...Shadows.sm,
  },
  taskDot: { width: 8, height: 8, borderRadius: 4 },
  taskPreviewTitle: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    fontWeight: Typography.fontWeight.medium,
  },
  taskPreviewDate: { fontSize: Typography.xs, color: Colors.textSecondary },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.xs,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  memberAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInitial: { fontSize: Typography.lg, fontWeight: Typography.fontWeight.bold, color: '#fff' },
  memberInfo: { flex: 1 },
  memberNameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  memberName: { fontSize: Typography.base, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
  },
  roleBadgeAdmin: { backgroundColor: Colors.primary + '20' },
  roleText: { fontSize: 10, color: Colors.textSecondary, textTransform: 'capitalize', fontWeight: '600' },
  roleTextAdmin: { color: Colors.primary },
  memberStats: { flexDirection: 'row', alignItems: 'center', marginTop: 3, gap: 6 },
  memberStat: { fontSize: Typography.xs, color: Colors.textSecondary },
  memberStatNum: { fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  memberStatDivider: { color: Colors.textLight },
  assignBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActions: { flexDirection: 'row', gap: Spacing.sm },
  quickActionCard: { flex: 1, alignItems: 'center', gap: Spacing.sm },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: { fontSize: Typography.xs, color: Colors.textSecondary, textAlign: 'center', fontWeight: '500' },
});

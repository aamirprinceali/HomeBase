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

export default function MemberDashboard({ navigation }) {
  const { userProfile } = useAuth();
  const { tasks, householdTasks, shoppingItems, getMemberById } = useApp();

  const firstName = userProfile?.name?.split(' ')[0] || 'there';
  const today = format(new Date(), 'EEEE, MMMM d');

  const myTasks = useMemo(
    () => tasks.filter((t) => t.assignedTo === userProfile?.id || (t.createdBy === userProfile?.id && !t.assignedTo)),
    [tasks, userProfile]
  );

  const pendingTasks = myTasks.filter((t) => t.status === 'pending');
  const assignedToMe = pendingTasks.filter((t) => t.assignedTo === userProfile?.id && t.createdBy !== userProfile?.id);
  const myOwn = pendingTasks.filter((t) => t.createdBy === userProfile?.id && (!t.assignedTo || t.assignedTo === userProfile?.id));

  const openHouseholdTasks = householdTasks.filter((t) => t.status !== 'done').slice(0, 3);
  const uncheckedShopping = shoppingItems.filter((i) => !i.isChecked).length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={[Colors.navy, Colors.navyLight]} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.name}>{firstName} ✨</Text>
              <Text style={styles.date}>{today}</Text>
            </View>
            <TouchableOpacity
              style={styles.settingsBtn}
              onPress={() => navigation.navigate('Settings')}
            >
              <MaterialCommunityIcons name="cog-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{pendingTasks.length}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{assignedToMe.length}</Text>
              <Text style={styles.statLabel}>Assigned</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{uncheckedShopping}</Text>
              <Text style={styles.statLabel}>Shopping</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.body}>
          {/* Assigned to me */}
          {assignedToMe.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Assigned to You</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
                  <Text style={styles.sectionLink}>See all</Text>
                </TouchableOpacity>
              </View>
              {assignedToMe.slice(0, 3).map((task) => {
                const from = getMemberById(task.createdBy);
                return (
                  <TouchableOpacity key={task.id} style={styles.assignedCard} onPress={() => navigation.navigate('Tasks')}>
                    <View style={styles.fromBadge}>
                      <MaterialCommunityIcons name="arrow-right-circle" size={14} color={Colors.primary} />
                      <Text style={styles.fromText}>From {from?.name || 'Someone'}</Text>
                    </View>
                    <Text style={styles.taskTitle}>{task.title}</Text>
                    {task.dueDate && (
                      <Text style={styles.dueText}>
                        Due: {format(task.dueDate?.toDate ? task.dueDate.toDate() : new Date(task.dueDate), 'MMM d')}
                        {task.dueTime ? ` at ${task.dueTime}` : ''}
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* My own tasks */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Tasks</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Tasks')}>
                <Text style={styles.sectionLink}>See all</Text>
              </TouchableOpacity>
            </View>
            {myOwn.length === 0 ? (
              <View style={styles.emptyCard}>
                <MaterialCommunityIcons name="check-all" size={28} color={Colors.success} />
                <Text style={styles.emptyText}>Nothing on your list right now</Text>
              </View>
            ) : (
              myOwn.slice(0, 3).map((task) => (
                <TouchableOpacity key={task.id} style={styles.taskPreviewCard} onPress={() => navigation.navigate('Tasks')}>
                  <View style={[styles.taskDot, { backgroundColor: Colors.teal }]} />
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

          {/* Household tasks */}
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
              openHouseholdTasks.map((task) => (
                <TouchableOpacity key={task.id} style={styles.taskPreviewCard} onPress={() => navigation.navigate('Household')}>
                  <View style={[styles.taskDot, { backgroundColor: Colors.warning }]} />
                  <Text style={styles.taskPreviewTitle} numberOfLines={1}>{task.title}</Text>
                  <View style={[styles.statusPill, { backgroundColor: task.claimedBy ? Colors.primary + '15' : Colors.warning + '15' }]}>
                    <Text style={{ fontSize: 10, color: task.claimedBy ? Colors.primary : Colors.warning, fontWeight: '600' }}>
                      {task.claimedBy ? 'Claimed' : 'Open'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Quick actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              {[
                { icon: 'plus-circle', label: 'Add Task', color: Colors.primary, screen: 'AddTask' },
                { icon: 'cart-plus', label: 'Shopping', color: Colors.teal, screen: 'Shopping' },
                { icon: 'calendar', label: 'Calendar', color: Colors.navy, screen: 'Calendar' },
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
  statsRow: { flexDirection: 'row', gap: Spacing.sm },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  statNumber: { fontSize: Typography.xl, fontWeight: Typography.fontWeight.extrabold, color: '#fff' },
  statLabel: { fontSize: 10, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  body: { padding: Spacing.base },
  section: { marginBottom: Spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: { fontSize: Typography.base, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  sectionLink: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.fontWeight.medium },
  assignedCard: {
    backgroundColor: Colors.primary + '08',
    borderRadius: Radius.lg,
    padding: Spacing.base,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    marginBottom: Spacing.xs,
  },
  fromBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  fromText: { fontSize: Typography.xs, color: Colors.primary, fontWeight: '600' },
  taskTitle: { fontSize: Typography.base, fontWeight: Typography.fontWeight.semibold, color: Colors.textPrimary },
  dueText: { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 4 },
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
  taskPreviewTitle: { flex: 1, fontSize: Typography.sm, color: Colors.textPrimary, fontWeight: '500' },
  taskPreviewDate: { fontSize: Typography.xs, color: Colors.textSecondary },
  statusPill: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
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

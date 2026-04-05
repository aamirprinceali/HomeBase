import React, { useMemo, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { format, isSameDay, isToday, startOfDay } from 'date-fns';
import { Colors, Radius, Shadows, Spacing, Typography } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import EmergencyButton from '../../components/EmergencyButton';

const PLACEHOLDER_BILLS = [
  { id: 'rent', label: 'Rent / Mortgage', day: 1, amount: '$1,850', status: 'Placeholder' },
  { id: 'power', label: 'Utilities', day: 15, amount: '$145', status: 'Placeholder' },
  { id: 'internet', label: 'Internet', day: 22, amount: '$85', status: 'Placeholder' },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

const toDateValue = (value) => {
  if (!value) return null;
  try {
    return value?.toDate ? value.toDate() : new Date(value);
  } catch {
    return null;
  }
};

const formatTime = () => format(new Date(), 'h:mm a');

function DashboardCard({ title, subtitle, actionLabel, onPress, children, style }) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle}>{title}</Text>
          {subtitle ? <Text style={styles.cardSubtitle}>{subtitle}</Text> : null}
        </View>
        {actionLabel ? (
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.cardAction}>{actionLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {children}
    </View>
  );
}

export default function AdminDashboard({ navigation }) {
  const { userProfile } = useAuth();
  const { tasks, householdTasks, members, shoppingItems, expenses } = useApp();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const firstName = userProfile?.name?.split(' ')[0] || 'there';
  const todayLabel = format(new Date(), 'EEEE, MMMM d');
  const avatarLetter = userProfile?.name?.[0]?.toUpperCase() || 'H';

  const myTasks = useMemo(
    () =>
      tasks.filter(
        (task) =>
          (task.assignedTo === userProfile?.id || (!task.assignedTo && task.createdBy === userProfile?.id)) &&
          task.status === 'pending'
      ),
    [tasks, userProfile]
  );

  const openHouseholdTasks = useMemo(
    () => householdTasks.filter((task) => task.status !== 'done'),
    [householdTasks]
  );

  const uncheckedShopping = useMemo(
    () => shoppingItems.filter((item) => !item.isChecked),
    [shoppingItems]
  );

  const expenseTotal = useMemo(
    () =>
      expenses
        .filter((expense) => expense.createdBy === userProfile?.id)
        .reduce((sum, expense) => sum + (expense.amount || 0), 0),
    [expenses, userProfile]
  );

  const selectedDayTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const dueDate = toDateValue(task.dueDate);
        if (!dueDate) return false;
        return format(dueDate, 'yyyy-MM-dd') === selectedDate;
      })
      .slice(0, 3);
  }, [selectedDate, tasks]);

  const todayFocus = useMemo(() => {
    const today = startOfDay(new Date());
    const dueToday = tasks.filter((task) => {
      const dueDate = toDateValue(task.dueDate);
      return dueDate && isSameDay(dueDate, today) && task.status === 'pending';
    });

    const houseToday = householdTasks.filter((task) => {
      const planned = toDateValue(task.plannedDate);
      return planned && isSameDay(planned, today) && task.status !== 'done';
    });

    return {
      dueToday,
      houseToday,
    };
  }, [householdTasks, tasks]);

  const recentActivity = useMemo(() => {
    const taskEvents = tasks
      .map((task) => {
        const completedAt = toDateValue(task.completedAt);
        const createdAt = toDateValue(task.createdAt);
        if (completedAt) {
          return {
            id: `task-complete-${task.id}`,
            date: completedAt,
            label: `Completed "${task.title}"`,
            icon: 'check-circle-outline',
            screen: 'Tasks',
          };
        }
        if (createdAt) {
          return {
            id: `task-created-${task.id}`,
            date: createdAt,
            label: `Added task "${task.title}"`,
            icon: 'checkbox-marked-circle-plus-outline',
            screen: 'Tasks',
          };
        }
        return null;
      })
      .filter(Boolean);

    const householdEvents = householdTasks
      .map((task) => {
        const createdAt = toDateValue(task.createdAt);
        if (!createdAt) return null;
        return {
          id: `house-${task.id}`,
          date: createdAt,
          label: `Posted household item "${task.title}"`,
          icon: 'home-plus-outline',
          screen: 'Household',
        };
      })
      .filter(Boolean);

    const shoppingEvents = shoppingItems
      .map((item) => {
        const createdAt = toDateValue(item.createdAt);
        if (!createdAt) return null;
        return {
          id: `shopping-${item.id}`,
          date: createdAt,
          label: `Added "${item.name}" to shopping`,
          icon: 'cart-plus',
          screen: 'Shopping',
        };
      })
      .filter(Boolean);

    const expenseEvents = expenses
      .filter((expense) => expense.createdBy === userProfile?.id)
      .map((expense) => {
        const createdAt = toDateValue(expense.createdAt) || toDateValue(expense.date);
        if (!createdAt) return null;
        return {
          id: `expense-${expense.id}`,
          date: createdAt,
          label: `Logged ${expense.note || 'an expense'} for $${Number(expense.amount || 0).toFixed(0)}`,
          icon: 'wallet-outline',
          screen: 'Finances',
        };
      })
      .filter(Boolean);

    return [...taskEvents, ...householdEvents, ...shoppingEvents, ...expenseEvents]
      .sort((a, b) => b.date - a.date)
      .slice(0, 4);
  }, [expenses, householdTasks, shoppingItems, tasks, userProfile]);

  const markedDates = useMemo(() => {
    const marks = {};
    tasks.forEach((task) => {
      const dueDate = toDateValue(task.dueDate);
      if (!dueDate) return;
      const key = format(dueDate, 'yyyy-MM-dd');
      marks[key] = {
        ...(marks[key] || {}),
        marked: true,
        dotColor: isToday(dueDate) ? Colors.primaryDark : Colors.primary,
      };
    });

    marks[selectedDate] = {
      ...(marks[selectedDate] || {}),
      selected: true,
      selectedColor: Colors.primaryDark,
      marked: !!marks[selectedDate]?.marked,
      dotColor: marks[selectedDate]?.dotColor || Colors.accent,
    };

    return marks;
  }, [selectedDate, tasks]);

  const nextBill = useMemo(() => {
    const now = new Date();
    const currentDay = now.getDate();
    return (
      PLACEHOLDER_BILLS.find((bill) => bill.day >= currentDay) ||
      PLACEHOLDER_BILLS[0]
    );
  }, []);

  const openAddMenu = () => {
    Alert.alert('Add To HomeBase', 'Choose what you want to add.', [
      { text: 'Task', onPress: () => navigation.navigate('AddTask') },
      { text: 'Household Task', onPress: () => navigation.navigate('Household') },
      { text: 'Shopping Item', onPress: () => navigation.navigate('Shopping') },
      { text: 'Expense', onPress: () => navigation.navigate('AddExpense') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#F4F1FA', '#F8F6F3', '#EDF3FB']} style={styles.background}>
        <View style={styles.glowOne} />
        <View style={styles.glowTwo} />

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.headerShell}>
            <View style={styles.headerCopy}>
              <Text style={styles.greeting}>{getGreeting()}, {firstName} 👋</Text>
              <Text style={styles.headerMeta}>{todayLabel} • {formatTime()}</Text>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Tasks')}>
                <MaterialCommunityIcons name="bell-outline" size={20} color={Colors.textPrimary} />
                {todayFocus.dueToday.length > 0 ? <View style={styles.notificationDot} /> : null}
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={openAddMenu}>
                <MaterialCommunityIcons name="plus" size={18} color="#fff" />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.avatar, { backgroundColor: userProfile?.profileColor || Colors.primary }]}
                onPress={() => navigation.navigate('Settings')}
              >
                <Text style={styles.avatarText}>{avatarLetter}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statGrid}>
            {[
              { label: 'My Tasks', value: myTasks.length, icon: 'checkbox-marked-circle-outline', screen: 'Tasks' },
              { label: 'House Tasks', value: openHouseholdTasks.length, icon: 'home-group', screen: 'Household' },
              { label: 'Shopping', value: uncheckedShopping.length, icon: 'cart-outline', screen: 'Shopping' },
              { label: 'Members', value: members.length, icon: 'account-group-outline', screen: 'Settings' },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.statCard}
                activeOpacity={0.85}
                onPress={() => navigation.navigate(item.screen)}
              >
                <View style={styles.statIconWrap}>
                  <MaterialCommunityIcons name={item.icon} size={18} color={Colors.primaryDark} />
                </View>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            <DashboardCard
              title="Upcoming Tasks"
              subtitle="Your next priorities"
              actionLabel="See all"
              onPress={() => navigation.navigate('Tasks')}
              style={styles.largeCard}
            >
              {myTasks.length === 0 ? (
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="check-circle-outline" size={26} color={Colors.success} />
                  <Text style={styles.emptyText}>You’re all caught up for now.</Text>
                </View>
              ) : (
                myTasks.slice(0, 4).map((task) => (
                  <TouchableOpacity
                    key={task.id}
                    style={styles.listRow}
                    onPress={() => navigation.navigate('Tasks')}
                  >
                    <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={20} color={Colors.primaryDark} />
                    <View style={styles.listBody}>
                      <Text style={styles.listTitle} numberOfLines={1}>{task.title}</Text>
                      <Text style={styles.listMeta}>
                        {task.dueDate ? format(toDateValue(task.dueDate), 'MMM d') : 'No due date'}
                        {task.dueTime ? ` • ${task.dueTime}` : ''}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </DashboardCard>

            <DashboardCard
              title="Calendar"
              subtitle="Tap a day to preview"
              actionLabel="Open"
              onPress={() => navigation.navigate('Calendar')}
              style={styles.sideCard}
            >
              <Calendar
                current={selectedDate}
                onDayPress={(day) => setSelectedDate(day.dateString)}
                hideExtraDays
                enableSwipeMonths
                markedDates={markedDates}
                theme={{
                  backgroundColor: Colors.surface,
                  calendarBackground: Colors.surface,
                  textSectionTitleColor: Colors.textSecondary,
                  selectedDayBackgroundColor: Colors.primaryDark,
                  selectedDayTextColor: '#fff',
                  todayTextColor: Colors.primaryDark,
                  dayTextColor: Colors.textPrimary,
                  textDisabledColor: Colors.textLight,
                  dotColor: Colors.primaryDark,
                  arrowColor: Colors.primaryDark,
                  monthTextColor: Colors.textPrimary,
                  textDayFontWeight: '500',
                  textMonthFontWeight: '600',
                  textDayHeaderFontWeight: '600',
                }}
                style={styles.miniCalendar}
              />

              <View style={styles.calendarPreview}>
                {(selectedDayTasks.length === 0 ? [{ id: 'none', title: 'No tasks due for this day.' }] : selectedDayTasks).map((task) => (
                  <View key={task.id} style={styles.calendarTaskRow}>
                    <MaterialCommunityIcons name="calendar-check-outline" size={16} color={Colors.navy} />
                    <Text style={styles.calendarTaskText} numberOfLines={1}>{task.title}</Text>
                  </View>
                ))}
              </View>
            </DashboardCard>
          </View>

          <View style={styles.row}>
            <DashboardCard
              title="Household"
              subtitle="Family overview and board"
              actionLabel="View board"
              onPress={() => navigation.navigate('Household')}
              style={styles.thirdCard}
            >
              <View style={styles.memberStack}>
                {members.slice(0, 4).map((member) => {
                  const memberTaskCount = tasks.filter((task) => task.assignedTo === member.id && task.status === 'pending').length;
                  return (
                    <View key={member.id} style={styles.memberRow}>
                      <View style={[styles.memberAvatar, { backgroundColor: member.profileColor || Colors.primary }]}>
                        <Text style={styles.memberAvatarText}>{member.name?.[0]?.toUpperCase() || '?'}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.memberName}>{member.name}</Text>
                        <Text style={styles.memberInfo}>{memberTaskCount} active tasks</Text>
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={styles.boardPreview}>
                {openHouseholdTasks.slice(0, 2).map((task) => (
                  <View key={task.id} style={styles.boardPill}>
                    <Text style={styles.boardPillText} numberOfLines={1}>{task.title}</Text>
                  </View>
                ))}
                {openHouseholdTasks.length === 0 ? <Text style={styles.smallHint}>No open household items.</Text> : null}
              </View>
            </DashboardCard>

            <DashboardCard
              title="Shopping"
              subtitle="Shared list preview"
              actionLabel="Open"
              onPress={() => navigation.navigate('Shopping')}
              style={styles.thirdCard}
            >
              {uncheckedShopping.slice(0, 3).map((item) => (
                <View key={item.id} style={styles.compactRow}>
                  <MaterialCommunityIcons name="circle-small" size={18} color={Colors.primaryDark} />
                  <Text style={styles.compactRowText} numberOfLines={1}>{item.name}</Text>
                </View>
              ))}
              {uncheckedShopping.length === 0 ? <Text style={styles.smallHint}>Everything on the list is picked up.</Text> : null}
            </DashboardCard>

            <DashboardCard
              title="Upcoming Bills"
              subtitle="Placeholder preview"
              actionLabel="Finances"
              onPress={() => navigation.navigate('Finances')}
              style={styles.thirdCard}
            >
              <Text style={styles.financesTotal}>${expenseTotal.toFixed(0)}</Text>
              <Text style={styles.financesCaption}>Spending logged so far</Text>
              {PLACEHOLDER_BILLS.slice(0, 2).map((bill) => (
                <View key={bill.id} style={styles.billRow}>
                  <View>
                    <Text style={styles.billLabel}>{bill.label}</Text>
                    <Text style={styles.billMeta}>Due on day {bill.day}</Text>
                  </View>
                  <Text style={styles.billAmount}>{bill.amount}</Text>
                </View>
              ))}
            </DashboardCard>
          </View>

          <View style={styles.row}>
            <DashboardCard
              title="Activity"
              subtitle="Recent household updates"
              actionLabel="Refresh"
              onPress={() => navigation.navigate('Tasks')}
              style={styles.halfCard}
            >
              {recentActivity.length === 0 ? (
                <Text style={styles.smallHint}>Your latest updates will appear here.</Text>
              ) : (
                recentActivity.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.activityRow}
                    onPress={() => navigation.navigate(item.screen)}
                  >
                    <View style={styles.activityIcon}>
                      <MaterialCommunityIcons name={item.icon} size={16} color={Colors.primaryDark} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.activityLabel} numberOfLines={1}>{item.label}</Text>
                      <Text style={styles.activityTime}>{format(item.date, 'MMM d • h:mm a')}</Text>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </DashboardCard>

            <DashboardCard
              title="Today Focus"
              subtitle="What needs attention now"
              actionLabel="Open"
              onPress={() => navigation.navigate('Tasks')}
              style={styles.halfCard}
            >
              <View style={styles.focusRow}>
                <Text style={styles.focusValue}>{todayFocus.dueToday.length}</Text>
                <Text style={styles.focusLabel}>tasks due today</Text>
              </View>
              <View style={styles.focusRow}>
                <Text style={styles.focusValue}>{todayFocus.houseToday.length}</Text>
                <Text style={styles.focusLabel}>house items planned today</Text>
              </View>
              <View style={styles.nextBillCard}>
                <MaterialCommunityIcons name="wallet-outline" size={18} color={Colors.primaryDark} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.nextBillTitle}>{nextBill.label}</Text>
                  <Text style={styles.nextBillMeta}>Placeholder due on day {nextBill.day}</Text>
                </View>
              </View>
            </DashboardCard>
          </View>

          <DashboardCard title="Quick Actions" subtitle="Simple shortcuts for the whole house" style={styles.card}>
            <View style={styles.quickActions}>
              {[
                { icon: 'plus-circle-outline', label: 'Add Task', screen: 'AddTask' },
                { icon: 'home-plus', label: 'House Task', screen: 'Household' },
                { icon: 'cart-outline', label: 'Shopping', screen: 'Shopping' },
                { icon: 'calendar-month-outline', label: 'Calendar', screen: 'Calendar' },
                { icon: 'wallet-outline', label: 'Finances', screen: 'Finances' },
              ].map((action) => (
                <TouchableOpacity
                  key={action.label}
                  style={styles.quickAction}
                  onPress={() => navigation.navigate(action.screen)}
                >
                  <View style={styles.quickActionIcon}>
                    <MaterialCommunityIcons name={action.icon} size={20} color={Colors.primaryDark} />
                  </View>
                  <Text style={styles.quickActionLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </DashboardCard>
        </ScrollView>
      </LinearGradient>
      <EmergencyButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  background: { flex: 1 },
  glowOne: {
    position: 'absolute',
    top: -30,
    right: -10,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#DEE6FF',
    opacity: 0.7,
  },
  glowTwo: {
    position: 'absolute',
    bottom: 120,
    left: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#E9DFFC',
    opacity: 0.45,
  },
  content: {
    padding: Spacing.base,
    paddingBottom: 122,
    gap: Spacing.base,
  },
  headerShell: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.78)',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    ...Shadows.md,
  },
  headerCopy: { flex: 1, paddingRight: Spacing.base },
  greeting: {
    fontSize: Typography.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.textPrimary,
  },
  headerMeta: {
    marginTop: 4,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primaryDark,
  },
  addButtonText: {
    color: '#fff',
    fontSize: Typography.sm,
    fontFamily: Typography.fontFamily.semibold,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: Typography.base,
    fontFamily: Typography.fontFamily.bold,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.86)',
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceAlt,
    marginBottom: Spacing.sm,
  },
  statValue: {
    fontSize: Typography.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.textPrimary,
  },
  statLabel: {
    marginTop: 2,
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: Radius.xl,
    padding: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.base,
    gap: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.base,
    fontFamily: Typography.fontFamily.semibold,
    color: Colors.textPrimary,
  },
  cardSubtitle: {
    marginTop: 2,
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  cardAction: {
    fontSize: Typography.sm,
    color: Colors.primaryDark,
    fontFamily: Typography.fontFamily.semibold,
  },
  largeCard: { width: '58%' },
  sideCard: { width: '39%' },
  thirdCard: { width: '100%' },
  halfCard: { width: '48.5%' },
  emptyState: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
  },
  emptyText: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  listBody: { flex: 1 },
  listTitle: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.medium,
  },
  listMeta: {
    marginTop: 2,
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  miniCalendar: {
    borderRadius: Radius.lg,
    marginHorizontal: -4,
  },
  calendarPreview: {
    marginTop: Spacing.sm,
    gap: 8,
  },
  calendarTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  calendarTaskText: {
    flex: 1,
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  memberStack: { gap: 10 },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  memberAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarText: {
    color: '#fff',
    fontSize: Typography.sm,
    fontFamily: Typography.fontFamily.bold,
  },
  memberName: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.medium,
  },
  memberInfo: {
    marginTop: 1,
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  boardPreview: {
    marginTop: Spacing.base,
    gap: 8,
  },
  boardPill: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: Radius.full,
    backgroundColor: Colors.surfaceAlt,
  },
  boardPillText: {
    fontSize: Typography.xs,
    color: Colors.textPrimary,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  compactRowText: {
    flex: 1,
    fontSize: Typography.sm,
    color: Colors.textPrimary,
  },
  smallHint: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  financesTotal: {
    fontSize: Typography.xxl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.textPrimary,
  },
  financesCaption: {
    marginTop: 2,
    marginBottom: Spacing.md,
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  billLabel: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
  },
  billMeta: {
    marginTop: 2,
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  billAmount: {
    fontSize: Typography.sm,
    color: Colors.primaryDark,
    fontFamily: Typography.fontFamily.semibold,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 8,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityLabel: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
  },
  activityTime: {
    marginTop: 2,
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  focusRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 10,
  },
  focusValue: {
    fontSize: Typography.xl,
    fontFamily: Typography.fontFamily.bold,
    color: Colors.primaryDark,
  },
  focusLabel: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  nextBillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
  },
  nextBillTitle: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.medium,
  },
  nextBillMeta: {
    marginTop: 2,
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickAction: {
    width: '48%',
    minHeight: 74,
    borderRadius: Radius.xl,
    padding: Spacing.base,
    backgroundColor: Colors.surfaceAlt,
    justifyContent: 'center',
  },
  quickActionIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFFB8',
    marginBottom: Spacing.sm,
  },
  quickActionLabel: {
    fontSize: Typography.sm,
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.medium,
  },
});

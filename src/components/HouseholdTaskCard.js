import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../theme';
import { format } from 'date-fns';

const statusConfig = {
  new: { label: 'New', color: Colors.warning, icon: 'new-box' },
  claimed: { label: 'Claimed', color: Colors.primary, icon: 'hand-pointing-right' },
  in_progress: { label: 'In Progress', color: Colors.teal, icon: 'progress-wrench' },
  done: { label: 'Done', color: Colors.success, icon: 'check-circle' },
};

export default function HouseholdTaskCard({
  task,
  currentUserId,
  memberName,
  claimedByName,
  onClaim,
  onUnclaim,
  onComplete,
  onSetDate,
  onDelete,
  isAdmin,
}) {
  const status = statusConfig[task.status] || statusConfig.new;
  const isMine = task.claimedBy === currentUserId;
  const isDone = task.status === 'done';

  const plannedDateText = task.plannedDate
    ? format(task.plannedDate?.toDate ? task.plannedDate.toDate() : new Date(task.plannedDate), 'MMM d, yyyy')
    : null;

  return (
    <View style={[styles.card, isDone && styles.cardDone]}>
      {/* Status strip */}
      <View style={[styles.statusStrip, { backgroundColor: status.color }]}>
        <MaterialCommunityIcons name={status.icon} size={14} color="#fff" />
        <Text style={styles.statusLabel}>{status.label}</Text>
      </View>

      <View style={styles.body}>
        <Text style={[styles.title, isDone && styles.titleDone]}>{task.title}</Text>

        {task.description ? (
          <Text style={styles.description} numberOfLines={2}>{task.description}</Text>
        ) : null}

        <View style={styles.meta}>
          {memberName && (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="account" size={13} color={Colors.textSecondary} />
              <Text style={styles.metaText}>Posted by {memberName}</Text>
            </View>
          )}
          {claimedByName && (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="hand-pointing-right" size={13} color={Colors.primary} />
              <Text style={[styles.metaText, { color: Colors.primary }]}>Claimed by {claimedByName}</Text>
            </View>
          )}
          {plannedDateText && (
            <View style={styles.metaItem}>
              <MaterialCommunityIcons name="calendar-check" size={13} color={Colors.success} />
              <Text style={[styles.metaText, { color: Colors.success }]}>Planned: {plannedDateText}</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        {!isDone && (
          <View style={styles.actions}>
            {!task.claimedBy && (
              <TouchableOpacity style={[styles.actionBtn, styles.claimBtn]} onPress={onClaim}>
                <MaterialCommunityIcons name="hand-pointing-right" size={15} color={Colors.primary} />
                <Text style={[styles.actionText, { color: Colors.primary }]}>I'll do this</Text>
              </TouchableOpacity>
            )}
            {isMine && (
              <>
                <TouchableOpacity style={[styles.actionBtn, styles.unclaimBtn]} onPress={onUnclaim}>
                  <MaterialCommunityIcons name="close-circle-outline" size={15} color={Colors.textSecondary} />
                  <Text style={[styles.actionText, { color: Colors.textSecondary }]}>Unclaim</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.doneBtn]} onPress={onComplete}>
                  <MaterialCommunityIcons name="check" size={15} color={Colors.surface} />
                  <Text style={[styles.actionText, { color: Colors.surface }]}>Mark Done</Text>
                </TouchableOpacity>
              </>
            )}
            {isAdmin && !plannedDateText && (
              <TouchableOpacity style={[styles.actionBtn, styles.dateBtn]} onPress={onSetDate}>
                <MaterialCommunityIcons name="calendar-plus" size={15} color={Colors.teal} />
                <Text style={[styles.actionText, { color: Colors.teal }]}>Set Date</Text>
              </TouchableOpacity>
            )}
            {isAdmin && (
              <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
                <MaterialCommunityIcons name="trash-can-outline" size={16} color={Colors.danger} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  cardDone: {
    opacity: 0.65,
  },
  statusStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: 6,
    gap: 5,
  },
  statusLabel: {
    fontSize: Typography.xs,
    color: '#fff',
    fontWeight: Typography.fontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  body: {
    padding: Spacing.base,
  },
  title: {
    fontSize: Typography.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  description: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  meta: {
    gap: 4,
    marginBottom: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    gap: 4,
  },
  claimBtn: {
    backgroundColor: Colors.primary + '15',
  },
  unclaimBtn: {
    backgroundColor: Colors.border,
  },
  doneBtn: {
    backgroundColor: Colors.success,
  },
  dateBtn: {
    backgroundColor: Colors.teal + '20',
  },
  actionText: {
    fontSize: Typography.xs,
    fontWeight: Typography.fontWeight.semibold,
  },
  deleteBtn: {
    marginLeft: 'auto',
    padding: 6,
  },
});

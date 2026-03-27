import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows, CategoryColors, CategoryIcons } from '../theme';
import { format } from 'date-fns';

export default function TaskCard({ task, onComplete, onDelete, memberName, largeText = false, simple = false }) {
  const isCompleted = task.status === 'completed';
  const categoryColor = CategoryColors[task.category] || Colors.textSecondary;
  const categoryIcon = CategoryIcons[task.category] || 'checkbox-blank-circle-outline';

  const fs = (size) => largeText ? Math.round(size * 1.3) : size;

  const formatDueDate = () => {
    if (!task.dueDate) return null;
    try {
      const date = task.dueDate?.toDate ? task.dueDate.toDate() : new Date(task.dueDate);
      return format(date, 'MMM d') + (task.dueTime ? ` at ${task.dueTime}` : '');
    } catch {
      return null;
    }
  };

  const dueText = formatDueDate();

  return (
    <View style={[styles.card, isCompleted && styles.cardCompleted, simple && styles.cardSimple]}>
      {/* Left accent bar */}
      <View style={[styles.accentBar, { backgroundColor: categoryColor }]} />

      <View style={styles.content}>
        {/* Assigned badge */}
        {task.assignedTo && memberName && !simple && (
          <View style={styles.assignedBadge}>
            <MaterialCommunityIcons name="arrow-right-circle" size={12} color={Colors.primary} />
            <Text style={styles.assignedText}>From {memberName}</Text>
          </View>
        )}

        {/* Title */}
        <Text style={[styles.title, { fontSize: fs(Typography.base) }, isCompleted && styles.titleCompleted]}>
          {task.title}
        </Text>

        {/* Description */}
        {task.description && !simple && (
          <Text style={[styles.description, { fontSize: fs(Typography.sm) }]} numberOfLines={2}>
            {task.description}
          </Text>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <View style={[styles.categoryBadge, { backgroundColor: categoryColor + '20' }]}>
              <MaterialCommunityIcons name={categoryIcon} size={12} color={categoryColor} />
              {!simple && (
                <Text style={[styles.categoryText, { color: categoryColor, fontSize: fs(Typography.xs) }]}>
                  {task.category}
                </Text>
              )}
            </View>
            {dueText && (
              <View style={styles.dueBadge}>
                <MaterialCommunityIcons name="clock-outline" size={12} color={Colors.textSecondary} />
                <Text style={[styles.dueText, { fontSize: fs(Typography.xs) }]}>{dueText}</Text>
              </View>
            )}
            {task.isRecurring && (
              <MaterialCommunityIcons name="repeat" size={14} color={Colors.teal} style={{ marginLeft: 4 }} />
            )}
          </View>
        </View>
      </View>

      {/* Complete button */}
      <TouchableOpacity
        style={[styles.checkButton, isCompleted && styles.checkButtonDone, simple && styles.checkButtonSimple]}
        onPress={onComplete}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons
          name={isCompleted ? 'check-circle' : 'checkbox-blank-circle-outline'}
          size={simple ? 36 : 28}
          color={isCompleted ? Colors.success : Colors.border}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  cardCompleted: {
    opacity: 0.6,
  },
  cardSimple: {
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.xl,
    ...Shadows.md,
  },
  accentBar: {
    width: 5,
    borderTopLeftRadius: Radius.lg,
    borderBottomLeftRadius: Radius.lg,
  },
  content: {
    flex: 1,
    padding: Spacing.base,
  },
  assignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  assignedText: {
    fontSize: Typography.xs,
    color: Colors.primary,
    fontWeight: Typography.fontWeight.medium,
    marginLeft: 3,
  },
  title: {
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  description: {
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.full,
    gap: 3,
  },
  categoryText: {
    fontWeight: Typography.fontWeight.medium,
    textTransform: 'capitalize',
  },
  dueBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dueText: {
    color: Colors.textSecondary,
  },
  checkButton: {
    justifyContent: 'center',
    paddingHorizontal: Spacing.md,
  },
  checkButtonDone: {},
  checkButtonSimple: {
    paddingHorizontal: Spacing.lg,
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import EmergencyButton from '../../components/EmergencyButton';

export default function ShoppingListScreen() {
  const { userProfile } = useAuth();
  const { shoppingItems, addShoppingItem, toggleShoppingItem, deleteShoppingItem, clearCheckedItems, getMemberById } = useApp();
  const [newItem, setNewItem] = useState('');

  const unchecked = shoppingItems.filter((i) => !i.isChecked);
  const checked = shoppingItems.filter((i) => i.isChecked);

  const handleAdd = async () => {
    if (!newItem.trim()) return;
    await addShoppingItem(newItem.trim());
    setNewItem('');
  };

  const handleClearChecked = () => {
    if (checked.length === 0) return;
    Alert.alert('Clear Picked Up Items?', `Remove ${checked.length} checked item${checked.length > 1 ? 's' : ''}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: clearCheckedItems },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Shopping List</Text>
            <Text style={styles.subtitle}>
              {unchecked.length} item{unchecked.length !== 1 ? 's' : ''} to pick up
            </Text>
          </View>
          {checked.length > 0 && (
            <TouchableOpacity style={styles.clearBtn} onPress={handleClearChecked}>
              <MaterialCommunityIcons name="broom" size={18} color={Colors.textSecondary} />
              <Text style={styles.clearBtnText}>Clear done</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Add item bar */}
        <View style={styles.addBar}>
          <View style={styles.addInputWrap}>
            <MaterialCommunityIcons name="cart-plus" size={20} color={Colors.textLight} />
            <TextInput
              style={styles.addInput}
              placeholder="Add an item..."
              placeholderTextColor={Colors.textLight}
              value={newItem}
              onChangeText={setNewItem}
              onSubmitEditing={handleAdd}
              returnKeyType="done"
            />
          </View>
          <TouchableOpacity
            style={[styles.addButton, !newItem.trim() && styles.addButtonDisabled]}
            onPress={handleAdd}
            disabled={!newItem.trim()}
          >
            <MaterialCommunityIcons name="plus" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.list}>
          {shoppingItems.length === 0 ? (
            <View style={styles.empty}>
              <MaterialCommunityIcons name="cart-outline" size={52} color={Colors.textLight} />
              <Text style={styles.emptyTitle}>List is empty</Text>
              <Text style={styles.emptySubtitle}>Add items above — everyone in the house can see them</Text>
            </View>
          ) : (
            <>
              {/* Unchecked */}
              {unchecked.map((item) => {
                const addedBy = getMemberById(item.addedBy);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.itemCard}
                    onPress={() => toggleShoppingItem(item.id, item.isChecked)}
                    onLongPress={() => {
                      Alert.alert('Remove Item', `Remove "${item.name}" from the list?`, [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Remove', style: 'destructive', onPress: () => deleteShoppingItem(item.id) },
                      ]);
                    }}
                    activeOpacity={0.7}
                  >
                    <MaterialCommunityIcons
                      name="checkbox-blank-circle-outline"
                      size={26}
                      color={Colors.border}
                    />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      {addedBy && (
                        <Text style={styles.itemAdded}>Added by {addedBy.name}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}

              {/* Checked */}
              {checked.length > 0 && (
                <>
                  <Text style={styles.sectionDivider}>Picked Up</Text>
                  {checked.map((item) => {
                    const checkedBy = item.checkedBy ? getMemberById(item.checkedBy) : null;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.itemCard, styles.itemCardChecked]}
                        onPress={() => toggleShoppingItem(item.id, item.isChecked)}
                        onLongPress={() => {
                          Alert.alert('Remove Item', `Remove "${item.name}"?`, [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Remove', style: 'destructive', onPress: () => deleteShoppingItem(item.id) },
                          ]);
                        }}
                        activeOpacity={0.7}
                      >
                        <MaterialCommunityIcons name="check-circle" size={26} color={Colors.success} />
                        <View style={styles.itemInfo}>
                          <Text style={[styles.itemName, styles.itemNameChecked]}>{item.name}</Text>
                          {checkedBy && (
                            <Text style={styles.itemAdded}>Picked up by {checkedBy.name}</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </>
              )}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
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
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  clearBtnText: { fontSize: Typography.sm, color: Colors.textSecondary, fontWeight: '500' },
  addBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  addInputWrap: {
    flex: 1,
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
  addInput: { flex: 1, fontSize: Typography.base, color: Colors.textPrimary },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  addButtonDisabled: { opacity: 0.4 },
  list: { padding: Spacing.base, paddingBottom: 100 },
  empty: { alignItems: 'center', paddingTop: 80, gap: Spacing.sm },
  emptyTitle: { fontSize: Typography.lg, fontWeight: Typography.fontWeight.bold, color: Colors.textSecondary },
  emptySubtitle: { fontSize: Typography.sm, color: Colors.textLight, textAlign: 'center', lineHeight: 20 },
  sectionDivider: {
    fontSize: Typography.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textLight,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginVertical: Spacing.sm,
    marginLeft: 4,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    marginBottom: Spacing.xs,
    gap: Spacing.md,
    ...Shadows.sm,
  },
  itemCardChecked: { opacity: 0.6 },
  itemInfo: { flex: 1 },
  itemName: {
    fontSize: Typography.base,
    fontWeight: Typography.fontWeight.medium,
    color: Colors.textPrimary,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  itemAdded: { fontSize: Typography.xs, color: Colors.textLight, marginTop: 2 },
});

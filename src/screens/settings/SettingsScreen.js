import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

const PROFILE_COLORS = Colors.profileColors;
const ROLES = ['admin', 'member', 'simple'];

export default function SettingsScreen({ navigation }) {
  const { userProfile, logout, updateUserProfile } = useAuth();
  const { household, members, regenerateInviteCode, updateMemberRole } = useApp();

  const [showAddContact, setShowAddContact] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const isAdmin = userProfile?.role === 'admin';

  const toggleLargeText = () => updateUserProfile({ largeText: !userProfile?.largeText });
  const toggleHighContrast = () => updateUserProfile({ highContrast: !userProfile?.highContrast });

  const handleColorSelect = (color) => updateUserProfile({ profileColor: color });

  const handleAddContact = async () => {
    if (!contactName.trim() || !contactPhone.trim()) {
      Alert.alert('Missing Info', 'Please enter both a name and phone number.');
      return;
    }
    const existing = userProfile?.emergencyContacts || [];
    await updateUserProfile({
      emergencyContacts: [...existing, { name: contactName.trim(), phone: contactPhone.trim() }],
    });
    setContactName('');
    setContactPhone('');
    setShowAddContact(false);
  };

  const handleRemoveContact = (index) => {
    Alert.alert('Remove Contact', 'Remove this emergency contact?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          const updated = [...(userProfile?.emergencyContacts || [])];
          updated.splice(index, 1);
          updateUserProfile({ emergencyContacts: updated });
        },
      },
    ]);
  };

  const handleRegenerateCode = () => {
    Alert.alert('New Invite Code', 'This will create a new code. The old one will stop working. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Generate New', onPress: regenerateInviteCode },
    ]);
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const handleChangeRole = (memberId, memberName) => {
    if (memberId === userProfile?.id) {
      Alert.alert("Can't change your own role.");
      return;
    }
    Alert.alert(`Change ${memberName}'s Role`, 'Select a new role:', [
      ...ROLES.map((role) => ({
        text: role.charAt(0).toUpperCase() + role.slice(1) + (role === 'simple' ? ' (simplified view)' : ''),
        onPress: () => updateMemberRole(memberId, role),
      })),
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={[styles.profileAvatar, { backgroundColor: userProfile?.profileColor || Colors.primary }]}>
            <Text style={styles.profileInitial}>{userProfile?.name?.[0]?.toUpperCase() || '?'}</Text>
          </View>
          <View>
            <Text style={styles.profileName}>{userProfile?.name}</Text>
            <Text style={styles.profileEmail}>{userProfile?.email}</Text>
            <View style={styles.rolePill}>
              <Text style={styles.roleText}>{userProfile?.role}</Text>
            </View>
          </View>
        </View>

        {/* Profile color */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Color</Text>
          <View style={styles.colorRow}>
            {PROFILE_COLORS.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorDot,
                  { backgroundColor: color },
                  userProfile?.profileColor === color && styles.colorDotSelected,
                ]}
                onPress={() => handleColorSelect(color)}
              />
            ))}
          </View>
        </View>

        {/* Display preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display</Text>
          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Large Text</Text>
                <Text style={styles.settingDesc}>Makes all text bigger and easier to read</Text>
              </View>
              <Switch
                value={userProfile?.largeText || false}
                onValueChange={toggleLargeText}
                trackColor={{ true: Colors.primary }}
                thumbColor="#fff"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>High Contrast</Text>
                <Text style={styles.settingDesc}>Increases contrast for better visibility</Text>
              </View>
              <Switch
                value={userProfile?.highContrast || false}
                onValueChange={toggleHighContrast}
                trackColor={{ true: Colors.primary }}
                thumbColor="#fff"
              />
            </View>
          </View>
        </View>

        {/* Emergency contacts */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            <TouchableOpacity onPress={() => setShowAddContact(true)}>
              <Text style={styles.sectionAction}>Add</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.card}>
            {(userProfile?.emergencyContacts || []).length === 0 ? (
              <Text style={styles.emptyText}>No emergency contacts added yet</Text>
            ) : (
              (userProfile?.emergencyContacts || []).map((contact, i) => (
                <View key={i}>
                  {i > 0 && <View style={styles.divider} />}
                  <View style={styles.contactRow}>
                    <View style={styles.contactIcon}>
                      <MaterialCommunityIcons name="account-heart" size={20} color={Colors.danger} />
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactPhone}>{contact.phone}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleRemoveContact(i)}>
                      <MaterialCommunityIcons name="close" size={18} color={Colors.textLight} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        </View>

        {/* Household info (admin only) */}
        {isAdmin && household && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Household</Text>
            <View style={styles.card}>
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>{household.name}</Text>
                  <Text style={styles.settingDesc}>Your household name</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingLabel}>Invite Code</Text>
                  <Text style={styles.inviteCode}>{household.inviteCode}</Text>
                </View>
                <TouchableOpacity style={styles.regenBtn} onPress={handleRegenerateCode}>
                  <Text style={styles.regenBtnText}>New Code</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Family members (admin only) */}
        {isAdmin && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Family Members</Text>
            <View style={styles.card}>
              {members.map((member, i) => (
                <View key={member.id}>
                  {i > 0 && <View style={styles.divider} />}
                  <View style={styles.memberRow}>
                    <View style={[styles.memberAvatar, { backgroundColor: member.profileColor || Colors.primary }]}>
                      <Text style={styles.memberInitial}>{member.name?.[0]?.toUpperCase()}</Text>
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.name}</Text>
                      <Text style={styles.memberRole}>{member.role}</Text>
                    </View>
                    {member.id !== userProfile?.id && (
                      <TouchableOpacity
                        style={styles.changeRoleBtn}
                        onPress={() => handleChangeRole(member.id, member.name)}
                      >
                        <Text style={styles.changeRoleBtnText}>Change Role</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={18} color={Colors.danger} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add contact modal */}
      <Modal visible={showAddContact} transparent animationType="slide" onRequestClose={() => setShowAddContact(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <Text style={styles.modalTitle}>Add Emergency Contact</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Name (e.g. My Son Aamir)"
                placeholderTextColor={Colors.textLight}
                value={contactName}
                onChangeText={setContactName}
                autoFocus
              />
              <TextInput
                style={styles.modalInput}
                placeholder="Phone Number"
                placeholderTextColor={Colors.textLight}
                value={contactPhone}
                onChangeText={setContactPhone}
                keyboardType="phone-pad"
              />
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalCancel} onPress={() => setShowAddContact(false)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalSave} onPress={handleAddContact}>
                  <Text style={styles.modalSaveText}>Add Contact</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.base, paddingBottom: 60 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.base,
    marginBottom: Spacing.base,
  },
  title: { fontSize: Typography.lg, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.md,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: { fontSize: Typography.xxl, fontWeight: Typography.fontWeight.bold, color: '#fff' },
  profileName: { fontSize: Typography.lg, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary },
  profileEmail: { fontSize: Typography.sm, color: Colors.textSecondary, marginTop: 2 },
  rolePill: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginTop: 6,
  },
  roleText: { fontSize: Typography.xs, color: Colors.primary, fontWeight: '600', textTransform: 'capitalize' },
  section: { marginBottom: Spacing.xl },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  sectionTitle: { fontSize: Typography.base, fontWeight: Typography.fontWeight.bold, color: Colors.textPrimary, marginBottom: Spacing.sm },
  sectionAction: { fontSize: Typography.sm, color: Colors.primary, fontWeight: Typography.fontWeight.semibold },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.base,
    ...Shadows.sm,
  },
  colorRow: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  colorDot: { width: 36, height: 36, borderRadius: 18 },
  colorDotSelected: { borderWidth: 3, borderColor: Colors.textPrimary },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.sm },
  settingInfo: { flex: 1, marginRight: Spacing.base },
  settingLabel: { fontSize: Typography.base, fontWeight: Typography.fontWeight.medium, color: Colors.textPrimary },
  settingDesc: { fontSize: Typography.xs, color: Colors.textSecondary, marginTop: 2 },
  divider: { height: 1, backgroundColor: Colors.borderLight, marginVertical: 2 },
  inviteCode: {
    fontSize: Typography.xl,
    fontWeight: Typography.fontWeight.extrabold,
    color: Colors.primary,
    letterSpacing: 4,
    marginTop: 4,
  },
  regenBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.primary + '15',
  },
  regenBtnText: { fontSize: Typography.xs, color: Colors.primary, fontWeight: '600' },
  emptyText: { fontSize: Typography.sm, color: Colors.textSecondary, textAlign: 'center', paddingVertical: Spacing.sm },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, gap: Spacing.md },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.danger + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: { flex: 1 },
  contactName: { fontSize: Typography.base, fontWeight: Typography.fontWeight.medium, color: Colors.textPrimary },
  contactPhone: { fontSize: Typography.sm, color: Colors.textSecondary, marginTop: 2 },
  memberRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, gap: Spacing.md },
  memberAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  memberInitial: { fontSize: Typography.base, fontWeight: 'bold', color: '#fff' },
  memberInfo: { flex: 1 },
  memberName: { fontSize: Typography.base, fontWeight: '500', color: Colors.textPrimary },
  memberRole: { fontSize: Typography.xs, color: Colors.textSecondary, textTransform: 'capitalize' },
  changeRoleBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  changeRoleBtnText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '500' },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.base,
    marginTop: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.danger + '40',
  },
  signOutText: { fontSize: Typography.base, color: Colors.danger, fontWeight: Typography.fontWeight.semibold },
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
  modalInput: {
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    padding: Spacing.base,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
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
    backgroundColor: Colors.danger,
    alignItems: 'center',
  },
  modalSaveText: { fontSize: Typography.base, color: '#fff', fontWeight: Typography.fontWeight.bold },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Linking,
  Alert,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius, Shadows, Typography } from '../theme';
import { useAuth } from '../context/AuthContext';

export default function EmergencyButton() {
  const { userProfile } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  const contacts = userProfile?.emergencyContacts || [];

  const handleCall = (phone) => {
    const cleanPhone = phone.replace(/\D/g, '');
    Linking.openURL(`tel:${cleanPhone}`);
  };

  const handleText = (phone, name) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = `🚨 EMERGENCY - ${userProfile?.name || 'A family member'} needs help right away. Please call or respond immediately.`;
    Linking.openURL(`sms:${cleanPhone}?body=${encodeURIComponent(message)}`);
  };

  const handleEmergencyContact = (contact) => {
    Alert.alert(
      `Contact ${contact.name}`,
      'What would you like to do?',
      [
        {
          text: 'Call',
          onPress: () => handleCall(contact.phone),
        },
        {
          text: 'Send Emergency Text',
          onPress: () => handleText(contact.phone, contact.name),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  if (contacts.length === 0) return null;

  return (
    <>
      <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="phone-alert" size={22} color={Colors.textWhite} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <MaterialCommunityIcons name="phone-alert" size={32} color={Colors.danger} />
              <Text style={styles.modalTitle}>Emergency Contacts</Text>
              <Text style={styles.modalSubtitle}>Choose who to reach</Text>
            </View>

            {contacts.map((contact, index) => (
              <TouchableOpacity
                key={index}
                style={styles.contactCard}
                onPress={() => handleEmergencyContact(contact)}
                activeOpacity={0.7}
              >
                <View style={[styles.contactAvatar, { backgroundColor: Colors.danger + '20' }]}>
                  <MaterialCommunityIcons name="account" size={24} color={Colors.danger} />
                </View>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactPhone}>{contact.phone}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={22} color={Colors.textLight} />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    backgroundColor: Colors.danger,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.lg,
    zIndex: 999,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: Spacing.xl,
    paddingBottom: 40,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.sm,
  },
  modalSubtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: Spacing.base,
    marginBottom: Spacing.sm,
  },
  contactAvatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: Typography.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  contactPhone: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  cancelButton: {
    marginTop: Spacing.md,
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.medium,
  },
});

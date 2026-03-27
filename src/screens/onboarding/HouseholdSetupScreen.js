import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, Typography, Spacing, Radius, Shadows } from '../../theme';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

export default function HouseholdSetupScreen() {
  const { createHousehold, joinHousehold } = useApp();
  const { userProfile } = useAuth();
  const [mode, setMode] = useState(null); // 'create' | 'join'
  const [householdName, setHouseholdName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!householdName.trim()) {
      Alert.alert('Name Required', "Give your household a name — even just 'The Smith Family' works!");
      return;
    }
    setLoading(true);
    try {
      await createHousehold(householdName.trim());
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('Code Required', 'Please enter the invite code you received.');
      return;
    }
    setLoading(true);
    try {
      await joinHousehold(inviteCode.trim());
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <MaterialCommunityIcons name="home-heart" size={48} color={Colors.primary} />
            <Text style={styles.title}>Set Up Your Home</Text>
            <Text style={styles.subtitle}>
              Hey {userProfile?.name?.split(' ')[0] || 'there'}! One last step — create your household or join one that's already set up.
            </Text>
          </View>

          {!mode ? (
            <View style={styles.choices}>
              <TouchableOpacity
                style={styles.choiceCard}
                onPress={() => setMode('create')}
                activeOpacity={0.8}
              >
                <LinearGradient colors={[Colors.primary, Colors.primaryDark]} style={styles.choiceGradient}>
                  <MaterialCommunityIcons name="home-plus" size={36} color="#fff" />
                  <Text style={styles.choiceTitle}>Create a Household</Text>
                  <Text style={styles.choiceDesc}>Start fresh. You'll become the admin and can invite family members.</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.choiceCard}
                onPress={() => setMode('join')}
                activeOpacity={0.8}
              >
                <LinearGradient colors={[Colors.navy, Colors.navyLight]} style={styles.choiceGradient}>
                  <MaterialCommunityIcons name="home-account" size={36} color="#fff" />
                  <Text style={styles.choiceTitle}>Join a Household</Text>
                  <Text style={styles.choiceDesc}>Someone already set one up. Use their invite code to join.</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : mode === 'create' ? (
            <View style={styles.form}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setMode(null)}>
                <MaterialCommunityIcons name="arrow-left" size={18} color={Colors.textSecondary} />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>

              <Text style={styles.formTitle}>Name Your Household</Text>
              <Text style={styles.formSubtitle}>This is what everyone in your family will see.</Text>

              <View style={styles.inputWrap}>
                <MaterialCommunityIcons name="home-outline" size={20} color={Colors.textLight} />
                <TextInput
                  style={styles.input}
                  placeholder="e.g. The Johnson Family"
                  placeholderTextColor={Colors.textLight}
                  value={householdName}
                  onChangeText={setHouseholdName}
                  autoCapitalize="words"
                />
              </View>

              <TouchableOpacity
                style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                onPress={handleCreate}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.textWhite} />
                ) : (
                  <Text style={styles.submitBtnText}>Create Household</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.form}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setMode(null)}>
                <MaterialCommunityIcons name="arrow-left" size={18} color={Colors.textSecondary} />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>

              <Text style={styles.formTitle}>Enter Invite Code</Text>
              <Text style={styles.formSubtitle}>
                Ask the admin of your household for the 6-character code.
              </Text>

              <View style={styles.inputWrap}>
                <MaterialCommunityIcons name="key-outline" size={20} color={Colors.textLight} />
                <TextInput
                  style={[styles.input, styles.codeInput]}
                  placeholder="ABC123"
                  placeholderTextColor={Colors.textLight}
                  value={inviteCode}
                  onChangeText={(t) => setInviteCode(t.toUpperCase())}
                  autoCapitalize="characters"
                  maxLength={6}
                />
              </View>

              <TouchableOpacity
                style={[styles.submitBtn, { backgroundColor: Colors.navy }, loading && styles.submitBtnDisabled]}
                onPress={handleJoin}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <ActivityIndicator color={Colors.textWhite} />
                ) : (
                  <Text style={styles.submitBtnText}>Join Household</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.xl, flexGrow: 1 },
  header: { alignItems: 'center', marginBottom: Spacing.xxl, marginTop: Spacing.xl },
  title: {
    fontSize: Typography.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
  },
  subtitle: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  choices: { gap: Spacing.base },
  choiceCard: { borderRadius: Radius.xl, overflow: 'hidden', ...Shadows.md },
  choiceGradient: {
    padding: Spacing.xl,
    alignItems: 'flex-start',
    gap: Spacing.sm,
    minHeight: 140,
  },
  choiceTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.fontWeight.bold,
    color: '#fff',
  },
  choiceDesc: {
    fontSize: Typography.sm,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  form: { gap: Spacing.base },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.sm,
  },
  backText: { fontSize: Typography.sm, color: Colors.textSecondary },
  formTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  formSubtitle: { fontSize: Typography.sm, color: Colors.textSecondary, lineHeight: 20 },
  inputWrap: {
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
  input: { flex: 1, fontSize: Typography.base, color: Colors.textPrimary },
  codeInput: {
    fontSize: Typography.xl,
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: 6,
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingVertical: Spacing.base,
    alignItems: 'center',
    marginTop: Spacing.sm,
    ...Shadows.md,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: {
    fontSize: Typography.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textWhite,
  },
});

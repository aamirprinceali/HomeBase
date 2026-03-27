import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Radius } from '../../theme';

export default function WelcomeScreen({ navigation }) {
  return (
    <LinearGradient colors={['#FF6B35', '#E55520', '#2D3561']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safe}>
        {/* Logo area */}
        <View style={styles.hero}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="home-heart" size={56} color={Colors.primary} />
          </View>
          <Text style={styles.appName}>HomeBase</Text>
          <Text style={styles.tagline}>Your family, organized — together.</Text>
        </View>

        {/* Feature highlights */}
        <View style={styles.features}>
          {[
            { icon: 'checkbox-marked-circle-outline', text: 'Assign tasks to anyone in the house' },
            { icon: 'home-group', text: 'Shared household board for everyone' },
            { icon: 'cart-outline', text: 'One shopping list, updated in real time' },
            { icon: 'bell-ring-outline', text: 'Smart reminders so nothing slips through' },
          ].map((item, i) => (
            <View key={i} style={styles.featureRow}>
              <MaterialCommunityIcons name={item.icon} size={20} color={Colors.tealLight} />
              <Text style={styles.featureText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryBtnText}>I already have an account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingTop: 20,
  },
  hero: {
    alignItems: 'center',
    marginTop: 30,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  appName: {
    fontSize: Typography.xxxl,
    fontWeight: Typography.fontWeight.extrabold,
    color: Colors.textWhite,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: Typography.base,
    color: 'rgba(255,255,255,0.75)',
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
  features: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    gap: Spacing.base,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureText: {
    fontSize: Typography.sm,
    color: Colors.textWhite,
    flex: 1,
  },
  buttons: {
    gap: Spacing.md,
  },
  primaryBtn: {
    backgroundColor: Colors.textWhite,
    borderRadius: Radius.full,
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  primaryBtnText: {
    fontSize: Typography.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  secondaryBtn: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: Radius.full,
    paddingVertical: Spacing.base,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: Typography.base,
    color: Colors.textWhite,
    fontWeight: Typography.fontWeight.medium,
  },
});

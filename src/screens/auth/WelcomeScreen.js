import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radius } from '../../theme';

const { width, height } = Dimensions.get('window');

const features = [
  { icon: 'checkbox-marked-circle-outline', text: 'Tasks assigned, tracked, done' },
  { icon: 'home-group', text: 'Shared board everyone can see' },
  { icon: 'cart-outline', text: 'Shopping list, live for the whole house' },
  { icon: 'bell-ring-outline', text: 'Reminders so nothing slips through' },
];

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.root}>
      {/* Background glow blobs */}
      <View style={styles.blobTopRight} />
      <View style={styles.blobBottomLeft} />

      <SafeAreaView style={styles.safe}>
        {/* Top: logo + wordmark */}
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <LinearGradient
              colors={[Colors.primary, Colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoGradient}
            >
              <MaterialCommunityIcons name="home-heart" size={32} color="#fff" />
            </LinearGradient>
          </View>
          <View>
            <Text style={styles.appName}>HomeBase</Text>
            <Text style={styles.tagline}>Your family, organized — together.</Text>
          </View>
        </View>

        {/* Center: big headline */}
        <View style={styles.heroSection}>
          <Text style={styles.heroLine1}>Run your home</Text>
          <LinearGradient
            colors={[Colors.primary, Colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientTextWrap}
          >
            <Text style={styles.heroLine2}>like a pro.</Text>
          </LinearGradient>
          <Text style={styles.heroSub}>
            One place for tasks, schedules, shopping, and everyone in your house.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.featureGrid}>
          {features.map((item, i) => (
            <View key={i} style={styles.featureCard}>
              <View style={styles.featureIconWrap}>
                <MaterialCommunityIcons name={item.icon} size={18} color={Colors.accent} />
              </View>
              <Text style={styles.featureText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* CTA Buttons */}
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryBtn}
            >
              <Text style={styles.primaryBtnText}>Get Started</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
            </LinearGradient>
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  blobTopRight: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.primary,
    opacity: 0.12,
  },
  blobBottomLeft: {
    position: 'absolute',
    bottom: 60,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: Colors.accent,
    opacity: 0.08,
  },
  safe: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xl,
    justifyContent: 'space-between',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  logoWrap: {
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  logoGradient: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 20,
    fontFamily: 'Outfit_700Bold',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 12,
    fontFamily: 'Outfit_400Regular',
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // Hero
  heroSection: {
    marginTop: Spacing.xxl,
  },
  heroLine1: {
    fontSize: 42,
    fontFamily: 'Outfit_800ExtraBold',
    color: Colors.textPrimary,
    letterSpacing: -1.5,
    lineHeight: 48,
  },
  gradientTextWrap: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    marginTop: 2,
  },
  heroLine2: {
    fontSize: 42,
    fontFamily: 'Outfit_800ExtraBold',
    color: '#fff',
    letterSpacing: -1.5,
    lineHeight: 48,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  heroSub: {
    fontSize: 15,
    fontFamily: 'Outfit_400Regular',
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
    lineHeight: 22,
    maxWidth: 320,
  },

  // Feature grid
  featureGrid: {
    gap: Spacing.sm,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  featureIconWrap: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    backgroundColor: Colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    color: Colors.textSecondary,
    flex: 1,
  },

  // Buttons
  buttons: {
    gap: Spacing.md,
  },
  primaryBtn: {
    borderRadius: Radius.full,
    paddingVertical: 16,
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
    color: '#fff',
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryBtnText: {
    fontSize: 15,
    fontFamily: 'Outfit_500Medium',
    color: Colors.textSecondary,
  },
});

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { Colors } from '../theme';

// Auth screens
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Onboarding
import HouseholdSetupScreen from '../screens/onboarding/HouseholdSetupScreen';

// Dashboard
import AdminDashboard from '../screens/dashboard/AdminDashboard';
import MemberDashboard from '../screens/dashboard/MemberDashboard';
import SimpleDashboard from '../screens/dashboard/SimpleDashboard';

// App screens
import TasksScreen from '../screens/tasks/TasksScreen';
import AddTaskScreen from '../screens/tasks/AddTaskScreen';
import HouseholdBoardScreen from '../screens/household/HouseholdBoardScreen';
import ShoppingListScreen from '../screens/shopping/ShoppingListScreen';
import CalendarScreen from '../screens/calendar/CalendarScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  const { userProfile } = useAuth();
  const role = userProfile?.role;
  const isSimple = role === 'simple';

  const DashboardComponent =
    role === 'admin' ? AdminDashboard :
    role === 'simple' ? SimpleDashboard :
    MemberDashboard;

  const tabBarStyle = {
    backgroundColor: '#fff',
    borderTopColor: Colors.borderLight,
    paddingTop: 6,
    height: 80,
  };

  if (isSimple) {
    // Simplified navigation for Dad
    return (
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle,
          tabBarActiveTintColor: Colors.teal,
          tabBarInactiveTintColor: Colors.textLight,
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600', paddingBottom: 8 },
        }}
      >
        <Tab.Screen
          name="Home"
          component={DashboardComponent}
          options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home-heart" size={size} color={color} /> }}
        />
        <Tab.Screen
          name="Tasks"
          component={TasksScreen}
          options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={size} color={color} /> }}
        />
        <Tab.Screen
          name="Household"
          component={HouseholdBoardScreen}
          options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home-group" size={size} color={color} /> }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textLight,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', paddingBottom: 8 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardComponent}
        options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home-heart" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="checkbox-marked-circle-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Household"
        component={HouseholdBoardScreen}
        options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home-group" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Shopping"
        component={ShoppingListScreen}
        options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="cart-outline" size={size} color={color} /> }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="calendar-month-outline" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={HomeTabs} />
      <Stack.Screen name="AddTask" component={AddTaskScreen} options={{ presentation: 'modal' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  const needsHousehold = user && userProfile && !userProfile.householdId;

  return (
    <NavigationContainer>
      {!user ? (
        <AuthStack />
      ) : needsHousehold ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="HouseholdSetup" component={HouseholdSetupScreen} />
        </Stack.Navigator>
      ) : (
        <AppStack />
      )}
    </NavigationContainer>
  );
}

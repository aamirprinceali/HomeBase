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
import FinancesScreen from '../screens/finances/FinancesScreen';
import AddExpenseScreen from '../screens/finances/AddExpenseScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function tabIcon(name, focused, color, size) {
  return (
    <View
      style={{
        minWidth: 42,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: focused ? Colors.surfaceAlt : 'transparent',
      }}
    >
      <MaterialCommunityIcons name={name} size={focused ? size + 1 : size} color={color} />
    </View>
  );
}

function HomeTabs() {
  const { userProfile } = useAuth();
  const role = userProfile?.role;
  const isSimple = role === 'simple';

  const DashboardComponent =
    role === 'admin' ? AdminDashboard :
    role === 'simple' ? SimpleDashboard :
    MemberDashboard;

  const tabBarStyle = {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 12,
    height: 78,
    paddingTop: 8,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderTopWidth: 0,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 28,
    shadowColor: '#9AA9C2',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 10,
  };

  const commonScreenOptions = {
    headerShown: false,
    tabBarStyle,
    tabBarActiveTintColor: Colors.primaryDark,
    tabBarInactiveTintColor: Colors.textSecondary,
    tabBarLabelStyle: {
      fontSize: 10,
      fontWeight: '600',
      paddingBottom: 8,
    },
    tabBarHideOnKeyboard: true,
  };

  if (isSimple) {
    return (
      <Tab.Navigator
        screenOptions={commonScreenOptions}
      >
        <Tab.Screen
          name="Home"
          component={DashboardComponent}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ color, size, focused }) => tabIcon('home-heart', focused, color, size),
          }}
        />
        <Tab.Screen
          name="Tasks"
          component={TasksScreen}
          options={{ tabBarIcon: ({ color, size, focused }) => tabIcon('checkbox-marked-circle-outline', focused, color, size) }}
        />
        <Tab.Screen
          name="Household"
          component={HouseholdBoardScreen}
          options={{ tabBarIcon: ({ color, size, focused }) => tabIcon('home-group', focused, color, size) }}
        />
        <Tab.Screen
          name="Finances"
          component={FinancesScreen}
          options={{ tabBarIcon: ({ color, size, focused }) => tabIcon('wallet-outline', focused, color, size) }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={commonScreenOptions}
    >
      <Tab.Screen
        name="Home"
        component={DashboardComponent}
        options={{
          tabBarLabel: '',
          tabBarIcon: ({ color, size, focused }) => tabIcon('home-heart', focused, color, size),
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TasksScreen}
        options={{ tabBarIcon: ({ color, size, focused }) => tabIcon('checkbox-marked-circle-outline', focused, color, size) }}
      />
      <Tab.Screen
        name="Household"
        component={HouseholdBoardScreen}
        options={{ tabBarIcon: ({ color, size, focused }) => tabIcon('home-group', focused, color, size) }}
      />
      <Tab.Screen
        name="Shopping"
        component={ShoppingListScreen}
        options={{ tabBarIcon: ({ color, size, focused }) => tabIcon('cart-outline', focused, color, size) }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{ tabBarIcon: ({ color, size, focused }) => tabIcon('calendar-month-outline', focused, color, size) }}
      />
      <Tab.Screen
        name="Finances"
        component={FinancesScreen}
        options={{ tabBarIcon: ({ color, size, focused }) => tabIcon('wallet-outline', focused, color, size) }}
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
      <Stack.Screen name="AddExpense" component={AddExpenseScreen} options={{ presentation: 'modal' }} />
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

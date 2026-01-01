import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Text } from 'react-native';
import { useAuth } from '../context/AuthProvider';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import LessonsScreen from '../screens/LessonsScreen';
import PracticeScreen from '../screens/PracticeScreen';
import LeagueScreen from '../screens/LeagueScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LessonScreen from '../screens/LessonScreen';
import UnitScreen from '../screens/UnitScreen';
import { colors } from '../theme';
import Icon from '../components/Icon';
import type { IconName } from '../components/Icon';
import { useI18n } from '../i18n';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

const TabIcon = ({ name, focused }: { name: IconName; focused: boolean }) => (
  <View
    style={{
      width: 42,
      height: 32,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: focused ? colors.card : 'transparent',
      borderWidth: focused ? 1 : 0,
      borderColor: focused ? colors.border : 'transparent',
    }}
  >
    <Icon name={name} size={22} color={focused ? colors.primary : colors.muted} />
  </View>
);

const AppTabs = () => (
  <Tabs.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        backgroundColor: colors.bg1,
        borderTopColor: colors.border,
        height: 62,
        paddingTop: 8,
      },
    }}
  >
    <Tabs.Screen
      name="Home"
      component={HomeScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon name="home-variant-outline" focused={focused} /> }}
    />
    <Tabs.Screen
      name="Lessons"
      component={LessonsScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon name="book-open-outline" focused={focused} /> }}
    />
    <Tabs.Screen
      name="Practice"
      component={PracticeScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon name="target" focused={focused} /> }}
    />
    <Tabs.Screen
      name="League"
      component={LeagueScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon name="trophy-outline" focused={focused} /> }}
    />
    <Tabs.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ tabBarIcon: ({ focused }) => <TabIcon name="account-circle-outline" focused={focused} /> }}
    />
  </Tabs.Navigator>
);

const LoadingScreen = () => {
  const { t } = useI18n();
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bg1 }}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={{ color: colors.text, marginTop: 12, fontWeight: '700' }}>
        {t('nav.loadingSession')}
      </Text>
    </View>
  );
};

export default function NavRoot() {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={LoadingScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  return (
    <NavigationContainer>
      {user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Main" component={AppTabs} />
          <Stack.Screen name="Lesson" component={LessonScreen} />
          <Stack.Screen name="Unit" component={UnitScreen} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

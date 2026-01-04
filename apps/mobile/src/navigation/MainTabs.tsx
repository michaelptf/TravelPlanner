import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TripInfoScreen from '../screens/TripInfoScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import MapScreen from '../screens/MapScreen';
import GoalsScreen from '../screens/GoalsScreen';
import ExpensesScreen from '../screens/ExpensesScreen';

const Tab = createBottomTabNavigator();

const MainTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      detachInactiveScreens: false
    }}
  >
    <Tab.Screen name="TripInfo" component={TripInfoScreen} options={{ title: 'Trip Info' }} />
    <Tab.Screen name="Schedule" component={ScheduleScreen} options={{ title: 'Schedule' }} />
    <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Map' }} />
    <Tab.Screen name="Goals" component={GoalsScreen} options={{ title: 'Goals' }} />
    <Tab.Screen name="Expenses" component={ExpensesScreen} options={{ title: 'Expenses' }} />
  </Tab.Navigator>
);

export default MainTabs;

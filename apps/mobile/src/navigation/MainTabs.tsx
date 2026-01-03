import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TripInfoScreen from '../screens/TripInfoScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import MapScreen from '../screens/MapScreen';
import GoalsScreen from '../screens/GoalsScreen';
import ExpensesScreen from '../screens/ExpensesScreen';

const Tab = createBottomTabNavigator();

const MainTabs: React.FC = () => (
  <Tab.Navigator>
    <Tab.Screen name="TripInfo" component={TripInfoScreen} />
    <Tab.Screen name="Schedule" component={ScheduleScreen} />
    <Tab.Screen name="Map" component={MapScreen} />
    <Tab.Screen name="Goals" component={GoalsScreen} />
    <Tab.Screen name="Expenses" component={ExpensesScreen} />
  </Tab.Navigator>
);

export default MainTabs;

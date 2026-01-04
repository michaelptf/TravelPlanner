import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TripInfoScreen from '../screens/TripInfoScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import MapScreen from '../screens/MapScreen';
import GoalsScreen from '../screens/GoalsScreen';
import ExpensesScreen from '../screens/ExpensesScreen';

const Stack = createNativeStackNavigator();

const MainTabs: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false
    }}
  >
    <Stack.Screen name="TripInfo" component={TripInfoScreen} />
  </Stack.Navigator>
);

export default MainTabs;

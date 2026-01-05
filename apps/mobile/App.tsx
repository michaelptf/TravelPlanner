import React, { useState } from 'react';
import { View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BottomNav, { TabName } from './src/components/BottomNav';
import TripInfoScreen from './src/screens/TripInfoScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import MapScreen from './src/screens/MapScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import ExpensesScreen from './src/screens/ExpensesScreen';

const qc = new QueryClient();

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('infos');

  const renderScreen = () => {
    switch (activeTab) {
      case 'infos':
        return <TripInfoScreen />;
      case 'schedule':
        return <ScheduleScreen />;
      case 'map':
        return <MapScreen />;
      case 'goals':
        return <GoalsScreen />;
      case 'expenses':
        return <ExpensesScreen />;
      default:
        return <TripInfoScreen />;
    }
  };

  return (
    <QueryClientProvider client={qc}>
      <View style={{ flex: 1 }}>
        {renderScreen()}
        <BottomNav activeTab={activeTab} onTabPress={setActiveTab} />
      </View>
    </QueryClientProvider>
  );
}



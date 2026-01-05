import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScheduleScreen from './src/screens/ScheduleScreen';

const qc = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <ScheduleScreen />
    </QueryClientProvider>
  );
}


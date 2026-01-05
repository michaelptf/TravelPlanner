import Constants from 'expo-constants';

const getApiBase = () => {
  const manifest: any = (Constants as any)?.manifest || (Constants as any)?.manifest2;
  const debuggerHost = manifest?.debuggerHost as string | undefined;
  if (debuggerHost) {
    const host = debuggerHost.split(':')[0];
    return `http://${host}:4000`;
  }
  const hostUri = (Constants as any)?.expoConfig?.hostUri as string | undefined;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:4000`;
  }
  return 'http://localhost:4000';
};

export const fetchSchedule = async (tripId: string) => {
  const base = getApiBase();
  const res = await fetch(`${base}/api/schedule?trip_id=${encodeURIComponent(tripId)}`);
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  return json.data;
};

export const createSchedule = async (payload: any) => {
  const base = getApiBase();
  const res = await fetch(`${base}/api/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  return json.data;
};

export const deleteSchedule = async (id: string) => {
  const base = getApiBase();
  const res = await fetch(`${base}/api/schedule/${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  return json.data;
};

export const fetchExpenses = async (tripId: string) => {
  const base = getApiBase();
  const res = await fetch(`${base}/api/expenses?trip_id=${encodeURIComponent(tripId)}`);
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  return json.data;
};

export const createExpense = async (payload: any) => {
  const base = getApiBase();
  const res = await fetch(`${base}/api/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  return json.data;
};

export const deleteExpense = async (id: string) => {
  const base = getApiBase();
  const res = await fetch(`${base}/api/expenses/${encodeURIComponent(id)}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
  const json = await res.json();
  return json.data;
};

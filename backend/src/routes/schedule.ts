import { Router } from 'express';
import { supabase } from '../services/supabaseClient';

const router = Router();

type ScheduleItem = {
  id: string;
  trip_id: string;
  title: string;
  start: string;
  location?: string;
  notes?: string;
};

// In-memory mock store for dev
const mockStore: Record<string, ScheduleItem[]> = {
  'mock-trip-1': [
    {
      id: 's1',
      trip_id: 'mock-trip-1',
      title: 'Mock Event: Welcome Dinner',
      start: new Date().toISOString(),
      location: 'Downtown',
      notes: 'Meet at 7pm',
    },
  ],
};

// Helper to validate trip id (accept UUID or mock ids)
const isValidTripId = (id: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id) || id.startsWith('mock-');
};

// GET /api/schedule?trip_id=...
router.get('/', async (req, res) => {
  try {
    const tripId = req.query.trip_id as string | undefined;
    if (!tripId) return res.json({ data: [] });
    if (!isValidTripId(tripId)) return res.status(400).json({ error: 'Invalid trip_id' });

    if (!supabase) {
      if (process.env.NODE_ENV !== 'production') {
        return res.json({ data: mockStore[tripId] || [] });
      }
      return res.status(503).json({ error: 'Supabase not configured' });
    }

    const { data, error } = await supabase.from('schedule').select('*').eq('trip_id', tripId);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ data });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'unexpected_error' });
  }
});

// POST /api/schedule
router.post('/', async (req, res) => {
  try {
    const payload = req.body as Partial<ScheduleItem>;
    if (!payload.trip_id || !isValidTripId(payload.trip_id)) return res.status(400).json({ error: 'trip_id required and must be valid' });
    if (!payload.title) return res.status(400).json({ error: 'title required' });

    if (!supabase) {
      if (process.env.NODE_ENV !== 'production') {
        const item: ScheduleItem = {
          id: Date.now().toString(),
          trip_id: payload.trip_id,
          title: payload.title!,
          start: payload.start || new Date().toISOString(),
          location: payload.location,
          notes: payload.notes,
        };
        mockStore[payload.trip_id] = mockStore[payload.trip_id] || [];
        mockStore[payload.trip_id].unshift(item);
        return res.status(201).json({ data: item });
      }
      return res.status(503).json({ error: 'Supabase not configured' });
    }

    const { data, error } = await supabase.from('schedule').insert([payload]).select();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json({ data });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'unexpected_error' });
  }
});

// PUT /api/schedule/:id
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body as Partial<ScheduleItem>;

    if (!supabase) {
      if (process.env.NODE_ENV !== 'production') {
        for (const k of Object.keys(mockStore)) {
          mockStore[k] = mockStore[k].map((it) => (it.id === id ? { ...it, ...payload } : it));
        }
        return res.json({ data: { id, ...payload } });
      }
      return res.status(503).json({ error: 'Supabase not configured' });
    }

    const { data, error } = await supabase.from('schedule').update(payload).match({ id }).select();
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ data });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'unexpected_error' });
  }
});

// DELETE /api/schedule/:id
router.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id;

    if (!supabase) {
      if (process.env.NODE_ENV !== 'production') {
        for (const k of Object.keys(mockStore)) {
          mockStore[k] = mockStore[k].filter((it) => it.id !== id);
        }
        return res.json({ data: { id } });
      }
      return res.status(503).json({ error: 'Supabase not configured' });
    }

    const { data, error } = await supabase.from('schedule').delete().match({ id }).select();
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ data });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'unexpected_error' });
  }
});

export default router;

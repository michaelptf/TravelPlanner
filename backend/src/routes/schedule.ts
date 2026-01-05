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

    // Find schedule_day ids for the trip, then fetch schedule_items
    const { data: days, error: daysErr } = await supabase.from('schedule_days').select('id,date').eq('trip_id', tripId);
    if (daysErr) return res.status(500).json({ error: daysErr.message });
    const dayIds = (days || []).map((d: any) => d.id);
    if (dayIds.length === 0) return res.json({ data: [] });

    const { data, error } = await supabase.from('schedule_items').select('*').in('schedule_day_id', dayIds).order('start_time', { ascending: true });
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

    // Ensure a schedule_day exists for the date
    const start = payload.start ? new Date(payload.start) : new Date();
    const dateString = start.toISOString().split('T')[0];

    let { data: existingDays } = await supabase.from('schedule_days').select('id').eq('trip_id', payload.trip_id).eq('date', dateString);
    let dayId: string;
    if (existingDays && existingDays.length > 0) {
      dayId = existingDays[0].id;
    } else {
      const { data: createdDay, error: createDayErr } = await supabase.from('schedule_days').insert([{ trip_id: payload.trip_id, date: dateString }]).select();
      if (createDayErr) return res.status(500).json({ error: createDayErr.message });
      dayId = createdDay![0].id;
    }

    const insertPayload = {
      schedule_day_id: dayId,
      title: payload.title,
      description: payload.notes,
      start_time: payload.start || new Date().toISOString(),
      end_time: payload.end || null,
      lat: payload.lat || null,
      lng: payload.lng || null,
      place_id: payload.place_id || null,
      ai_generated: payload.ai_generated || false,
    };

    const { data, error } = await supabase.from('schedule_items').insert([insertPayload]).select();
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

    const { data, error } = await supabase.from('schedule_items').update(payload).match({ id }).select();
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

    const { data, error } = await supabase.from('schedule_items').delete().match({ id }).select();
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ data });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'unexpected_error' });
  }
});

export default router;

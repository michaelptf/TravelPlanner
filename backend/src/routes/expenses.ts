import { Router } from 'express';
import { supabase } from '../services/supabaseClient';

const router = Router();

type Expense = {
  id: string;
  trip_id: string;
  description: string;
  amount: number;
  payer: string;
  participants: string[];
};

// In-memory mock store for dev
const mockStore: Record<string, Expense[]> = {
  'mock-trip-1': [
    { id: 'e1', trip_id: 'mock-trip-1', description: 'Dinner', amount: 120.5, payer: 'Alice', participants: ['Alice', 'Bob', 'Charlie'] },
  ],
};

const isValidTripId = (id: string) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id) || id.startsWith('mock-');
};

// GET /api/expenses?trip_id=...
router.get('/', async (req, res) => {
  try {
    let tripId = (req.query.trip_id as string | undefined)?.trim();
    if (!tripId) return res.json({ data: [] });

    // Enforce UUIDs when connected to Supabase to avoid invalid uuid casts
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (supabase) {
      if (!uuidRegex.test(tripId)) return res.status(400).json({ error: 'Invalid trip_id: must be a UUID when Supabase is configured' });
      const { data, error } = await supabase.from('expenses').select('*').eq('trip_id', tripId);
      if (error) return res.status(500).json({ error: error.message });
      return res.json({ data });
    } else {
      if (!isValidTripId(tripId)) return res.status(400).json({ error: 'Invalid trip_id' });
      return res.json({ data: mockStore[tripId] || [] });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'unexpected_error' });
  }
});

// POST /api/expenses
router.post('/', async (req, res) => {
  try {
    const payload = req.body as Partial<Expense>;
    if (!payload.trip_id) return res.status(400).json({ error: 'trip_id required' });
    const tripId = (payload.trip_id as string).trim();
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (supabase && !uuidRegex.test(tripId)) return res.status(400).json({ error: 'trip_id required and must be a UUID when Supabase is configured' });
    if (!supabase && !isValidTripId(tripId)) return res.status(400).json({ error: 'trip_id required and must be valid' });
    if (!payload.description) return res.status(400).json({ error: 'description required' });
    if (typeof payload.amount !== 'number' || payload.amount <= 0) return res.status(400).json({ error: 'amount required and must be > 0' });

    if (!supabase) {
      if (process.env.NODE_ENV !== 'production') {
        const item: Expense = {
          id: Date.now().toString(),
          trip_id: payload.trip_id,
          description: payload.description!,
          amount: payload.amount!,
          payer: payload.payer || 'Unknown',
          participants: payload.participants || [payload.payer || 'Unknown'],
        };
        mockStore[payload.trip_id] = mockStore[payload.trip_id] || [];
        mockStore[payload.trip_id].unshift(item);
        return res.status(201).json({ data: item });
      }
      return res.status(503).json({ error: 'Supabase not configured' });
    }

    const { data, error } = await supabase.from('expenses').insert([payload]).select();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json({ data });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'unexpected_error' });
  }
});

// PUT /api/expenses/:id
router.put('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const payload = req.body as Partial<Expense>;

    if (!supabase) {
      if (process.env.NODE_ENV !== 'production') {
        for (const k of Object.keys(mockStore)) {
          mockStore[k] = mockStore[k].map((it) => (it.id === id ? { ...it, ...payload } : it));
        }
        return res.json({ data: { id, ...payload } });
      }
      return res.status(503).json({ error: 'Supabase not configured' });
    }

    const { data, error } = await supabase.from('expenses').update(payload).match({ id }).select();
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ data });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'unexpected_error' });
  }
});

// DELETE /api/expenses/:id
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

    const { data, error } = await supabase.from('expenses').delete().match({ id }).select();
    if (error) return res.status(400).json({ error: error.message });
    return res.json({ data });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'unexpected_error' });
  }
});

export default router;

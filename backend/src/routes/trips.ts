import { Router } from 'express';
import { supabase } from '../services/supabaseClient';

const router = Router();

// GET /api/trips - list trips for a given user (query: user_id)
router.get('/', async (req, res) => {
  try {
    const userId = req.query.user_id as string | undefined;
    if (!userId) return res.json({ data: [] });

    if (!supabase) {
      // Supabase not configured locally — return mock data in dev so mobile can continue working
      if (process.env.NODE_ENV !== 'production') {
        const mock = [
          {
            id: 'mock-trip-1',
            owner_id: userId || null,
            title: 'Mock Trip to Tokyo',
            description: 'This is a locally provided mock trip for development.',
            start_date: '2026-03-01',
            end_date: '2026-03-10',
            default_currency: 'USD',
            ai_enabled: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        return res.json({ data: mock });
      }

      return res.status(503).json({ error: 'Supabase not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in backend/.env' });
    }

    const { data, error } = await supabase.from('trips').select('*').eq('owner_id', userId);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ data });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'unexpected_error' });
  }
});

// POST /api/trips - create trip
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    const { data, error } = await supabase.from('trips').insert([payload]).select();
    if (error) return res.status(400).json({ error: error.message });
    return res.status(201).json({ data });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'unexpected_error' });
  }
});

export default router;

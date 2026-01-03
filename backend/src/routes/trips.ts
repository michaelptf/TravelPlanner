import { Router } from 'express';
import { supabase } from '../services/supabaseClient';

const router = Router();

// GET /api/trips - list trips for a given user (query: user_id)
router.get('/', async (req, res) => {
  try {
    const userId = req.query.user_id as string | undefined;
    if (!userId) return res.json({ data: [] });

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

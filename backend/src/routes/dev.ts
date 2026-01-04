import { Router } from 'express';
import { supabase } from '../services/supabaseClient';

const router = Router();

// Dev-only seed endpoint: POST /api/dev/seed
router.post('/seed', async (_req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not allowed in production' });
  }

  if (!supabase) return res.status(503).json({ error: 'Supabase not configured' });

  try {
    const demoProfile = {
      id: '11111111-1111-1111-1111-111111111111',
      full_name: 'Demo Owner',
    };

    const demoTrip = {
      id: '22222222-2222-2222-2222-222222222222',
      owner_id: demoProfile.id,
      title: 'Demo Trip (Seeded)',
      description: 'Seeded demo trip for local development',
      start_date: '2026-03-01',
      end_date: '2026-03-05'
    };

    await supabase.from('profiles').upsert(demoProfile).select();
    await supabase.from('trips').upsert(demoTrip).select();
    await supabase.from('trip_members').upsert({ trip_id: demoTrip.id, profile_id: demoProfile.id, name: 'Demo Owner', role: 'owner' }).select();

    return res.json({ ok: true, demoProfile, demoTrip });
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.error('Seeding error', err);
    return res.status(500).json({ error: 'seed_failed' });
  }
});

export default router;

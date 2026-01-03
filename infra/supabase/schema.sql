-- TravelPlanner: Supabase / Postgres DDL (core tables + RLS templates)

-- Enable pgcrypto for gen_random_uuid
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- profiles (users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  avatar_url text,
  timezone text,
  created_at timestamptz DEFAULT now()
);

-- trips
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  start_date date,
  end_date date,
  default_currency text DEFAULT 'USD',
  ai_enabled boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- trip_members
CREATE TABLE IF NOT EXISTS trip_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES profiles(id),
  name text,
  email text,
  role text DEFAULT 'member',
  mbti varchar(4),
  joined boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(trip_id, COALESCE(profile_id::text, email))
);

-- schedule tables
CREATE TABLE IF NOT EXISTS schedule_days (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  date date,
  day_index integer
);

CREATE TABLE IF NOT EXISTS schedule_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_day_id uuid REFERENCES schedule_days(id) ON DELETE CASCADE,
  title text,
  description text,
  start_time timestamptz,
  end_time timestamptz,
  lat double precision,
  lng double precision,
  place_id text,
  ai_generated boolean DEFAULT false,
  created_by uuid REFERENCES profiles(id)
);

-- expenses
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  payer_id uuid,
  amount numeric,
  currency text,
  description text,
  split_method text DEFAULT 'equal',
  participants jsonb,
  created_at timestamptz DEFAULT now()
);

-- goals (saved places)
CREATE TABLE IF NOT EXISTS goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  name text,
  type text,
  lat double precision,
  lng double precision,
  address text,
  external_id text,
  notes text,
  saved_by uuid,
  created_at timestamptz DEFAULT now()
);

-- routes & ai_jobs
CREATE TABLE IF NOT EXISTS routes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  geojson jsonb,
  distance_m numeric,
  duration_s integer,
  suggested_by_ai boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  user_id uuid,
  job_type text,
  input jsonb,
  status text DEFAULT 'pending',
  result jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Example: basic RLS policy templates (enable RLS per table and add sample policies)

-- Enable RLS on trips
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Example policy: allow read for trip members
-- (replace with proper function if desired)
CREATE POLICY "select_trips_if_member" ON trips
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM trip_members WHERE trip_members.trip_id = trips.id AND trip_members.profile_id = current_setting('request.jwt.claims.sub')::uuid
    )
  );

-- Similarly enable RLS on trip_members and other tables
ALTER TABLE trip_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "select_trip_members_if_member" ON trip_members
  FOR SELECT USING (
    trip_id IN (
      SELECT trip_id FROM trip_members WHERE profile_id = current_setting('request.jwt.claims.sub')::uuid
    )
  );

-- Notes:
-- - Replace current_setting('request.jwt.claims.sub') method depending on Supabase auth integration.
-- - Add insert/update/delete policies as needed, and test in a dev project.

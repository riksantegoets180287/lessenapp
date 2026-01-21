/*
  # Lesmateriaal Database Schema

  1. Nieuwe Tabellen
    - `topics` - Onderwerpen/hoofdcategorieën
      - `id` (text, primary key)
      - `title` (text) - Titel van het onderwerp
      - `icon_kind` (text) - Type icon: 'lucide' of 'image'
      - `icon_name` (text) - Naam van Lucide icon
      - `icon_data_url` (text) - Base64 image data
      - `is_enabled` (boolean) - Of het onderwerp zichtbaar is
      - `date_available` (text) - Datum wanneer beschikbaar
      - `order` (integer) - Volgorde van weergave
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `lessons` - Lessen binnen een onderwerp
      - `id` (text, primary key)
      - `topic_id` (text, foreign key)
      - `title` (text)
      - `icon_kind` (text)
      - `icon_name` (text)
      - `icon_data_url` (text)
      - `learning_goals` (text)
      - `start_url` (text)
      - `info_url` (text)
      - `is_enabled` (boolean)
      - `date_available` (text)
      - `order` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `parts` - Onderdelen binnen een les
      - `id` (text, primary key)
      - `lesson_id` (text, foreign key)
      - `title` (text)
      - `description` (text)
      - `icon_kind` (text)
      - `icon_name` (text)
      - `icon_data_url` (text)
      - `learning_goals` (text)
      - `start_url` (text)
      - `info_url` (text)
      - `is_enabled` (boolean)
      - `date_available` (text)
      - `order` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `stats` - Bezoekersstatistieken
      - `id` (integer, primary key)
      - `total_visits` (integer) - Totaal aantal pageviews
      - `unique_visitors` (integer) - Unieke bezoekers per sessie
      - `updated_at` (timestamptz)

    - `clicks` - Klikstatistieken per item
      - `id` (uuid, primary key)
      - `item_type` (text) - 'topics', 'lessons', of 'parts'
      - `item_id` (text) - ID van het item
      - `click_count` (integer) - Aantal klikken
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS op alle tabellen
    - Public read access voor content en stats (iedereen moet kunnen lezen)
    - Restricted write access (alleen via service role of admin)
*/

-- Topics table
CREATE TABLE IF NOT EXISTS topics (
  id text PRIMARY KEY,
  title text NOT NULL,
  icon_kind text DEFAULT 'lucide',
  icon_name text,
  icon_data_url text,
  is_enabled boolean DEFAULT false,
  date_available text,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id text PRIMARY KEY,
  topic_id text NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title text NOT NULL,
  icon_kind text DEFAULT 'lucide',
  icon_name text,
  icon_data_url text,
  learning_goals text NOT NULL DEFAULT '',
  start_url text NOT NULL DEFAULT '',
  info_url text,
  is_enabled boolean DEFAULT false,
  date_available text,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Parts table
CREATE TABLE IF NOT EXISTS parts (
  id text PRIMARY KEY,
  lesson_id text NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  icon_kind text DEFAULT 'lucide',
  icon_name text,
  icon_data_url text,
  learning_goals text NOT NULL DEFAULT '',
  start_url text NOT NULL,
  info_url text,
  is_enabled boolean DEFAULT false,
  date_available text,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Stats table (single row)
CREATE TABLE IF NOT EXISTS stats (
  id integer PRIMARY KEY DEFAULT 1,
  total_visits integer DEFAULT 0,
  unique_visitors integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);

-- Initialize stats with single row
INSERT INTO stats (id, total_visits, unique_visitors)
VALUES (1, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Clicks table
CREATE TABLE IF NOT EXISTS clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_type text NOT NULL,
  item_id text NOT NULL,
  click_count integer DEFAULT 0,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(item_type, item_id)
);

-- Enable RLS
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can read)
CREATE POLICY "Public can read topics"
  ON topics FOR SELECT
  USING (true);

CREATE POLICY "Public can read lessons"
  ON lessons FOR SELECT
  USING (true);

CREATE POLICY "Public can read parts"
  ON parts FOR SELECT
  USING (true);

CREATE POLICY "Public can read stats"
  ON stats FOR SELECT
  USING (true);

CREATE POLICY "Public can read clicks"
  ON clicks FOR SELECT
  USING (true);

-- Public can update stats (for visit tracking)
CREATE POLICY "Public can update stats"
  ON stats FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Public can insert/update clicks (for click tracking)
CREATE POLICY "Public can insert clicks"
  ON clicks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can update clicks"
  ON clicks FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lessons_topic_id ON lessons(topic_id);
CREATE INDEX IF NOT EXISTS idx_parts_lesson_id ON parts(lesson_id);
CREATE INDEX IF NOT EXISTS idx_clicks_lookup ON clicks(item_type, item_id);

-- Insert demo data
INSERT INTO topics (id, title, icon_kind, icon_name, is_enabled, "order")
VALUES 
  ('t1', 'Basisvaardigheden', 'lucide', 'BookOpen', true, 1),
  ('t2', 'Digitale Veiligheid', 'lucide', 'Shield', false, 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO lessons (id, topic_id, title, icon_kind, icon_name, learning_goals, start_url, info_url, is_enabled, "order")
VALUES 
  ('l1', 't1', 'Word Documenten', 'lucide', 'NotebookText', 'Leer hoe je een brief schrijft en opmaakt in Word.', 'https://office.com', 'https://support.microsoft.com/word', true, 1)
ON CONFLICT (id) DO NOTHING;

INSERT INTO parts (id, lesson_id, title, description, icon_kind, icon_name, learning_goals, start_url, is_enabled, "order")
VALUES 
  ('p1', 'l1', 'Brief Indeling', 'De standaard opbouw van een zakelijke brief.', 'lucide', 'ListChecks', 'Een zakelijke brief bestaat uit: Afzender, Datum, Geadresseerde, Onderwerp, Aanhef, Kern, Slot, Ondertekening.', 'https://support.microsoft.com', true, 1),
  ('p2', 'l1', 'Opmaak Oefening', 'Oefen met vette tekst en koppen.', 'lucide', 'PlayCircle', 'In dit onderdeel leer je koppen (H1, H2) en dikgedrukte tekst gebruiken.', 'https://google.com', true, 2)
ON CONFLICT (id) DO NOTHING;
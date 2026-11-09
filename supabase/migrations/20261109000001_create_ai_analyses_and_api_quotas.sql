-- ============================================================================
-- Migration: Create ai_analyses and api_quotas tables
-- Purpose: Support AI-powered album analysis via Gemini API
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. ai_analyses — cached AI-generated album analyses
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_analyses (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  album_id        uuid        NOT NULL UNIQUE REFERENCES albums(id) ON DELETE CASCADE,
  summary         text        NOT NULL,           -- 2-3 sentence album summary
  themes          text[]      NOT NULL DEFAULT '{}', -- key thematic elements
  sound_description text      NOT NULL DEFAULT '', -- what the album sounds like
  influences      text        NOT NULL DEFAULT '', -- musical influences and context
  significance    text        NOT NULL DEFAULT '', -- why the album matters
  generated_at    timestamptz NOT NULL DEFAULT now(),
  model_version   text        NOT NULL DEFAULT '', -- e.g. 'gemini-2.0-flash'
  token_count     integer     DEFAULT 0,           -- track API usage
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookups by album_id (already UNIQUE, but explicit for clarity)
CREATE INDEX IF NOT EXISTS idx_ai_analyses_album_id ON ai_analyses(album_id);

-- Index for monitoring: find recently generated analyses
CREATE INDEX IF NOT EXISTS idx_ai_analyses_generated_at ON ai_analyses(generated_at DESC);

-- Auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION update_ai_analyses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ai_analyses_updated_at
  BEFORE UPDATE ON ai_analyses
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_analyses_updated_at();

COMMENT ON TABLE ai_analyses IS 'Cached AI-generated album analyses from Gemini API';
COMMENT ON COLUMN ai_analyses.summary IS 'Concise 2-3 sentence album summary';
COMMENT ON COLUMN ai_analyses.themes IS 'Array of key thematic elements identified in the album';
COMMENT ON COLUMN ai_analyses.sound_description IS 'Description of the album sonic character';
COMMENT ON COLUMN ai_analyses.influences IS 'Musical influences and cultural context';
COMMENT ON COLUMN ai_analyses.significance IS 'Why this album matters culturally or musically';
COMMENT ON COLUMN ai_analyses.model_version IS 'Gemini model version that generated this analysis';
COMMENT ON COLUMN ai_analyses.token_count IS 'Total token count used for generation (for cost tracking)';

-- ---------------------------------------------------------------------------
-- 2. api_quotas — rate-limit / quota tracking for external API calls
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS api_quotas (
  id            text        PRIMARY KEY,          -- e.g. 'gemini_daily'
  used          integer     NOT NULL DEFAULT 0,
  max_allowed   integer     NOT NULL DEFAULT 100,
  reset_at      timestamptz NOT NULL DEFAULT (now() + interval '1 day'),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION update_api_quotas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_api_quotas_updated_at
  BEFORE UPDATE ON api_quotas
  FOR EACH ROW
  EXECUTE FUNCTION update_api_quotas_updated_at();

-- Seed the Gemini daily quota row
INSERT INTO api_quotas (id, used, max_allowed, reset_at)
VALUES ('gemini_daily', 0, 100, now() + interval '1 day')
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE api_quotas IS 'Tracks usage quotas for external API services';
COMMENT ON COLUMN api_quotas.id IS 'Quota identifier, e.g. gemini_daily';
COMMENT ON COLUMN api_quotas.used IS 'Number of requests used in current period';
COMMENT ON COLUMN api_quotas.max_allowed IS 'Maximum requests allowed per period';
COMMENT ON COLUMN api_quotas.reset_at IS 'When the quota counter resets';

-- ---------------------------------------------------------------------------
-- 3. Row Level Security
-- ---------------------------------------------------------------------------

-- ai_analyses: anyone can read, only service_role can write
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ai_analyses_select_authenticated"
  ON ai_analyses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "ai_analyses_select_anon"
  ON ai_analyses FOR SELECT
  TO anon
  USING (true);

-- api_quotas: only service_role can read/write (Edge Functions use service_role key)
ALTER TABLE api_quotas ENABLE ROW LEVEL SECURITY;

-- No policies for anon/authenticated = only service_role (which bypasses RLS) can access
COMMENT ON POLICY "ai_analyses_select_authenticated" ON ai_analyses
  IS 'Authenticated users can read AI analyses';
COMMENT ON POLICY "ai_analyses_select_anon" ON ai_analyses
  IS 'Anonymous users can read AI analyses (for public album pages)';

-- ============================================================================
-- SONORA — Seed Data
-- Canonical genre list with URL-friendly slugs
-- ============================================================================

INSERT INTO public.genres (id, name, slug, description) VALUES
  (gen_random_uuid(), 'Rock',         'rock',         'Guitar-driven music spanning classic rock, alternative, and indie rock.'),
  (gen_random_uuid(), 'Hip Hop',      'hip-hop',      'Rhythmic vocal delivery over beats, encompassing rap and trap.'),
  (gen_random_uuid(), 'Jazz',         'jazz',         'Improvisation-rich music from swing and bebop to modern jazz fusion.'),
  (gen_random_uuid(), 'Electronic',   'electronic',   'Electronically produced music including house, techno, and IDM.'),
  (gen_random_uuid(), 'Pop',          'pop',          'Mainstream popular music with catchy melodies and broad appeal.'),
  (gen_random_uuid(), 'R&B',          'rnb',          'Rhythm and blues — soulful vocals over smooth grooves.'),
  (gen_random_uuid(), 'Classical',    'classical',    'Western art music from baroque and romantic to contemporary classical.'),
  (gen_random_uuid(), 'Metal',        'metal',        'Heavy, amplified music spanning thrash, doom, black, and progressive metal.'),
  (gen_random_uuid(), 'Folk',         'folk',         'Acoustic, tradition-rooted music with storytelling at its core.'),
  (gen_random_uuid(), 'Indie',        'indie',        'Independent music with a DIY ethos, crossing genres and conventions.'),
  (gen_random_uuid(), 'Soul',         'soul',         'Emotionally expressive vocal music rooted in gospel and R&B.'),
  (gen_random_uuid(), 'Punk',         'punk',         'Fast, raw, and rebellious — from hardcore to post-punk.'),
  (gen_random_uuid(), 'Country',      'country',      'American roots music blending folk, blues, and western traditions.'),
  (gen_random_uuid(), 'Blues',        'blues',        'Twelve-bar structures and expressive guitar work from Delta to Chicago.'),
  (gen_random_uuid(), 'Ambient',      'ambient',      'Atmospheric, texture-focused music designed for immersive listening.'),
  (gen_random_uuid(), 'Experimental', 'experimental', 'Boundary-pushing music that defies conventional genre classification.');

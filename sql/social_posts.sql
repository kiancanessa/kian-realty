-- Run manually in the Neon SQL editor (this project has no migrations folder).
-- Adds the "Redes sociales" module: scheduled Facebook/Instagram posts.

CREATE TABLE social_posts (
  id SERIAL PRIMARY KEY,
  post_type TEXT NOT NULL CHECK (post_type IN ('feed','story')),
  caption TEXT NOT NULL DEFAULT '',
  media_urls JSONB NOT NULL DEFAULT '[]',
  media_type TEXT NOT NULL DEFAULT 'image' CHECK (media_type IN ('image','video')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending','publishing','done','failed')),
  publish_as_news BOOLEAN NOT NULL DEFAULT false,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE social_post_targets (
  id SERIAL PRIMARY KEY,
  post_id INTEGER NOT NULL REFERENCES social_posts(id) ON DELETE CASCADE,
  network TEXT NOT NULL CHECK (network IN ('facebook','instagram')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','publishing','done','failed')),
  remote_id TEXT,
  error_message TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  published_at TIMESTAMPTZ,
  UNIQUE (post_id, network)
);

CREATE INDEX social_post_targets_post_id_idx ON social_post_targets(post_id);
CREATE INDEX social_posts_scheduled_at_idx ON social_posts(scheduled_at) WHERE status = 'pending';

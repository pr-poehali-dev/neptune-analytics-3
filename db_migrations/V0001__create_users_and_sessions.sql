CREATE TABLE t_p66541891_neptune_analytics_3.users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p66541891_neptune_analytics_3.sessions (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES t_p66541891_neptune_analytics_3.users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

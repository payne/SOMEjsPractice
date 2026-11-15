-- One row per usage event. uid is a random ID made by the browser; no IP
-- addresses or other personal data are stored.
CREATE TABLE events (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  received_at TEXT NOT NULL,              -- server time (ISO 8601, UTC)
  client_at   TEXT,                       -- when the browser recorded it (may be earlier if offline)
  uid         TEXT NOT NULL,              -- anonymous browser ID
  event       TEXT NOT NULL,              -- e.g. app_open, question_view, download_zip
  set_id      TEXT,
  question_id TEXT,
  data        TEXT,                       -- small JSON object with event details
  app_version TEXT,
  country     TEXT                        -- two-letter country code from Cloudflare
);

CREATE INDEX events_uid ON events (uid);
CREATE INDEX events_event ON events (event);
CREATE INDEX events_client_at ON events (client_at);
CREATE INDEX events_question ON events (set_id, question_id);

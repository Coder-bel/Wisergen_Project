-- ============================================================
-- Portfolio projects + News feed.
-- mysql -u wiseruser -p wisergen_market < portfolio_news.sql
-- ============================================================

-- Portfolio projects (software / web apps)
CREATE TABLE IF NOT EXISTS projects (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  summary       VARCHAR(500),               -- short tagline for cards
  description   TEXT,                        -- full description
  tech_stack    VARCHAR(300),                -- e.g. "React, PHP, MySQL"
  image_url     VARCHAR(500),
  image_url2    VARCHAR(500),
  image_url3    VARCHAR(500),
  live_url      VARCHAR(500),                -- optional link to live demo
  price         DECIMAL(12,2) NULL,          -- source-code price (NULL = not for sale)
  zip_path      VARCHAR(500),                -- server path to the source zip (private)
  status        VARCHAR(20) NOT NULL DEFAULT 'published',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Project inquiries from the public
CREATE TABLE IF NOT EXISTS project_inquiries (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  project_id  INT,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  message     TEXT,
  status      VARCHAR(20) NOT NULL DEFAULT 'new',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

-- News feed posts
CREATE TABLE IF NOT EXISTS news (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  summary     VARCHAR(500),
  body        TEXT,
  image_url   VARCHAR(500),
  source_url  VARCHAR(500),                  -- optional link to original article
  status      VARCHAR(20) NOT NULL DEFAULT 'published',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Records of paid source-code purchases (used to grant downloads)
CREATE TABLE IF NOT EXISTS purchases (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  project_id   INT,
  email        VARCHAR(255) NOT NULL,
  reference    VARCHAR(120) UNIQUE NOT NULL,  -- Paystack transaction reference
  amount       DECIMAL(12,2),
  token        VARCHAR(64) UNIQUE,            -- one-time download token
  downloaded   TINYINT(1) NOT NULL DEFAULT 0,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL
);

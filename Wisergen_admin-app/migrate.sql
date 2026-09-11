-- ============================================================
-- Migration: 3 images per device + condition on requests.
-- MariaDB supports IF NOT EXISTS, so this is safe to run once.
-- mysql -u wiseruser -p wisergen_market < migrate.sql
-- ============================================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url2 VARCHAR(500) NULL AFTER image_url;
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url3 VARCHAR(500) NULL AFTER image_url2;

ALTER TABLE requests ADD COLUMN IF NOT EXISTS condition_pref VARCHAR(20) NULL AFTER info;

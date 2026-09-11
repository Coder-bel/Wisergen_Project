# Wisergen Project

Monorepo containing both applications:

- Wisergen/  ->  React + Vite + TypeScript frontend
- Wisergen_admin-app/  ->  PHP admin panel

## Setup

### Frontend (Wisergen/)
    cd Wisergen
    npm install
    cp .env.example .env
    npm run dev

### Admin (Wisergen_admin-app/)
    1. Copy private/config.example.php to private/config.php and fill in DB credentials.
    2. Import the SQL files (migrate.sql, portfolio_news.sql).
    3. Point your web server at public/.

## Notes
- .env files and private/config.php are gitignored - never commit secrets.
- User uploads in Wisergen_admin-app/public/uploads/ are gitignored.

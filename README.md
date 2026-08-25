# Omni Trackers

Omni Trackers is a full-stack web app for browsing, filtering, and building a personal collection of comic book omnibuses (with plans to expand to all collected editions). Every entry is backed by real cover art and structured data, sourced by admin tooling that pulls from Marvel's public API and scrapes DC storefronts.

**Live Website:** [omnitrackers.com](https://omnitrackers.com)

## Features

- Browse and filter the full comics catalog by character and publisher
- Staff-only admin dashboard to add books, characters, and publishers manually, or bulk-import them via the Marvel API and DC storefront scrapers (Panel Bound, Walts), with pagination and response caching
- Responsive layout with a collapsible sidebar on desktop and a slide-in drawer on mobile for filters/admin navigation
- User dashboard for managing profile details, with account deletion support
- Email/password authentication with session-based auth, CSRF protection, and a full forgot-password / reset-password flow (email delivery via SMTP)

## Tech Stack

**Backend:** Django 5.2, Django REST Framework, PostgreSQL, Gunicorn
**Frontend:** React + TypeScript, Redux, React Router, Tailwind CSS, Material UI
**Infra:** Docker Compose (separate dev/prod configs), nginx-proxy + Let's Encrypt for TLS, deployed on AWS EC2/RDS

## Getting Started (local dev)

### Prerequisites

- Docker & Docker Compose
- Node.js 18+ and npm

### 1. Backend (Django + Postgres)

Create a `.env.dev` file in the project root:

```
DEBUG=1
SECRET_KEY=<any-random-string>
DJANGO_ALLOWED_HOSTS=localhost 127.0.0.1 [::1]
SQL_ENGINE=django.db.backends.postgresql
SQL_DATABASE=project_alpha_dev
SQL_USER=project_alpha
SQL_PASSWORD=project_alpha
SQL_HOST=db
SQL_PORT=5432
DATABASE=postgres
```

Optional — only needed to test the password-reset email flow; emails are logged to the console otherwise:

```
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=<your-email>
EMAIL_HOST_PASSWORD=<smtp-app-password>
EMAIL_USE_TLS=1
DEFAULT_FROM_EMAIL=<your-email>
```

Then:

```
docker compose up --build
docker compose exec web python manage.py migrate
docker compose exec web python manage.py createsuperuser
```

### 2. Frontend (React)

The frontend is built separately with webpack — it isn't part of the Docker image.

```
cd app/frontend
npm install
npm run dev   # watches and rebuilds on change
```

The app is served by Django at [http://localhost:8000](http://localhost:8000).

## Deploying

The app is deployed on an EC2 instance via `docker-compose.prod.yml`. Instead of running `docker-compose -f docker-compose.prod.yml up -d --build` directly, use:

```
./deploy.sh
```

This prunes unused Docker images, stopped containers, and build cache *before* building, so disk usage doesn't creep up across repeated deploys, then builds and starts the containers. It never touches named volumes, so the Postgres data and uploaded media are never at risk.

## Project Structure

- `app/mainsite/` — Django REST Framework API (auth, comics, data collection/scraping)
- `app/frontend/` — React/TypeScript SPA, served by Django's `frontend` app
- `app/project_alpha/` — Django project settings and root URL configuration

# Django Backend Setup for Athlink Platform

## Why Django?

- **Built-in Admin Panel** - Perfect for managing talents, teams, events
- **Django REST Framework** - Excellent API development
- **ORM** - Powerful database abstraction
- **Authentication** - Built-in user management
- **Scalability** - Handles high traffic well
- **Ecosystem** - Rich third-party packages

## Project Structure

```
athlink_backend/
├── manage.py
├── requirements.txt
├── athlink/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── apps/
│   ├── users/
│   ├── talents/
│   ├── teams/
│   ├── events/
│   ├── sponsors/
│   └── media/
├── api/
│   ├── v1/
│   │   ├── serializers.py
│   │   ├── views.py
│   │   └── urls.py
└── static/
```

## Installation Steps

### 1. Create Virtual Environment

```bash
python -m venv athlink_env
# Windows
athlink_env\Scripts\activate
# macOS/Linux
source athlink_env/bin/activate
```

### 2. Install Dependencies

```bash
pip install django djangorestframework
pip install django-cors-headers
pip install pillow  # For image handling
pip install psycopg2-binary  # For PostgreSQL
pip install celery redis  # For background tasks
pip install django-filter  # For API filtering
```

### 3. Create Django Project

```bash
django-admin startproject athlink_backend
cd athlink_backend
python manage.py startapp users
python manage.py startapp talents
python manage.py startapp teams
python manage.py startapp events
python manage.py startapp sponsors
python manage.py startapp media
```

## API Endpoints Structure

```
/api/v1/
├── auth/
│   ├── login/
│   ├── logout/
│   ├── register/
│   └── refresh/
├── talents/
│   ├── /                    # GET (list), POST (create)
│   ├── {id}/               # GET, PUT, PATCH, DELETE
│   ├── {id}/sponsors/      # GET, POST
│   ├── {id}/competitions/  # GET, POST
│   └── search/            # GET ?q=query&sport=&location=
├── teams/
│   ├── /                    # GET (list), POST (create)
│   ├── {id}/               # GET, PUT, PATCH, DELETE
│   ├── {id}/players/       # GET, POST
│   ├── {id}/games/         # GET, POST
│   └── {id}/sponsors/      # GET, POST
├── events/
│   ├── /                    # GET (list), POST (create)
│   ├── {id}/               # GET, PUT, PATCH, DELETE
│   ├── {id}/participants/  # GET, POST
│   └── {id}/sponsors/      # GET, POST
└── media/
    ├── upload/             # POST (file upload)
    └── {id}/              # GET (file download)
```

## Next.js Integration

Your Next.js frontend will make API calls to Django:

```javascript
// Replace mock data calls with real API calls
const API_BASE = "http://localhost:8000/api/v1";

export async function getTeamData(id) {
  const response = await fetch(`${API_BASE}/teams/${id}/`);
  return response.json();
}
```

## Development Workflow

1. **Django Backend**: `python manage.py runserver` (port 8000)
2. **Next.js Frontend**: `npm run dev` (port 3000)
3. **CORS**: Django serves API, Next.js consumes it

## Deployment Options

- **Backend**: Railway, Heroku, DigitalOcean, AWS
- **Database**: PostgreSQL on Neon, Supabase, or AWS RDS
- **Media**: AWS S3, Cloudinary
- **Frontend**: Vercel (existing Next.js setup)

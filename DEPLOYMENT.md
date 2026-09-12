# REALM — Life RPG Render Deployment Guide

This project is fully production-ready for deployment on **Render** (https://render.com).

## Option 1: 1-Click Render Blueprint Deployment (Recommended)

1. Push this repository to **GitHub** or **GitLab**.
2. Log into your **[Render Dashboard](https://dashboard.render.com)**.
3. Click **New +** -> **Blueprint**.
4. Connect your GitHub repository containing this project.
5. Render will automatically detect `render.yaml` and configure the service:
   - **Build Command**: `npm install && npm run build && pip install -r backend/requirements.txt`
   - **Start Command**: `gunicorn --bind 0.0.0.0:$PORT 'backend.app:create_app()'`
   - **Environment Variables**: Auto-populated from `render.yaml` (`MONGO_URI`, `JWT_SECRET`, `FLASK_ENV=production`).
6. Click **Apply**. Render will build the React Vite static frontend and launch the Flask + PyMongo backend service.

---

## Option 2: Manual Web Service Setup on Render

If you prefer setting up the web service manually on Render:

1. Click **New +** -> **Web Service**.
2. Select your repository.
3. Configure the following settings:
   - **Name**: `realm-life-rpg`
   - **Environment**: `Python 3`
   - **Region**: Select your closest region (e.g. Frankfurt, Oregon, Singapore).
   - **Branch**: `main` (or your primary branch).
   - **Build Command**: 
     ```bash
     npm install && npm run build && pip install -r backend/requirements.txt
     ```
   - **Start Command**:
     ```bash
     gunicorn --bind 0.0.0.0:$PORT "backend.app:create_app()"
     ```

4. **Environment Variables**:
   Add the following Environment Variables in the Render settings panel:

   | Key | Value |
   | :--- | :--- |
   | `MONGO_URI` | `mongodb+srv://kuriankurian405_db_user:KpqwSMq9uHFXDAMA@cluster0.0yqlygw.mongodb.net/raft_booking?appName=Cluster0` |
   | `MONGO_DB_NAME` | `raft_booking` |
   | `JWT_SECRET` | `f7441bcb35152cab40bef97cd45a1721ad293b0c6c2f827c490af13057c646b4` |
   | `FLASK_ENV` | `production` |
   | `PORT` | `10000` |

5. Click **Create Web Service**.

---

## Architecture Summary

- **Single-Service Unified Hosting**: Flask serves the REST API on `/api/*` and automatically serves the compiled Vite React frontend (`dist/index.html`) on all client routes.
- **MongoDB Atlas Integration**: PyMongo connects directly to your MongoDB Atlas cluster (`cluster0.0yqlygw.mongodb.net`).
- **Production WSGI Server**: Uses `gunicorn` for high-concurrency production serving.

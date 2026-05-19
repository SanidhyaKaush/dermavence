# Deployment Guide — Dermavence Pharma Skincare App

This guide explains how to deploy the **frontend to Netlify** and the **backend/database to Render or Railway**.

---

## 1. Prepare Backend for Deployment (Render or Railway)

The Django backend is already configured to automatically read secrets, database connections, and environment hosts from environment variables when run in production.

### Requirements:
We have updated `requirements.txt` to include production packages (`gunicorn`, `whitenoise`, and `dj-database-url`).

### Step A: Set up a Database (MySQL)
You need a cloud-hosted MySQL database. You can provision one easily on:
- **Railway** (Click "Add to project" -> "MySQL")
- **Aiven.io** (Free/cheap cloud MySQL database)
- **Render** (Offers PostgreSQL out of the box, or you can connect external MySQL databases)

Get your **Database Connection String** which looks like:
`mysql://db_username:db_password@db_host:db_port/db_name`

### Step B: Deploy Django Backend

#### Option 1: On Render
1. Create a new account on [Render](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following settings:
   - **Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt && python manage.py migrate`
   - **Start Command**: `gunicorn backend.wsgi:application`
5. In the **Environment Variables** section, add:
   - `DATABASE_URL`: *(Your database connection string from Step A)*
   - `DEBUG`: `False`
   - `SECRET_KEY`: *(Choose a long secure random string)*
   - `ALLOWED_HOSTS`: `your-render-app-url.onrender.com`

#### Option 2: On Railway
1. Create a new account on [Railway](https://railway.app/).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Choose your repository.
4. Railway will auto-detect Python. Go to the service **Variables** tab and add:
   - `DATABASE_URL`: `mysql://${{MYSQLUSER}}:${{MYSQLPASSWORD}}@${{MYSQLHOST}}:${{MYSQLPORT}}/${{MYSQLDATABASE}}` *(If using Railway's built-in MySQL)* or your custom database URL.
   - `DEBUG`: `False`
   - `SECRET_KEY`: *(Choose a secure random string)*
   - `PORT`: `8000`

---

## 2. Deploy Frontend to Netlify

The frontend is a React + Vite SPA.

### Step A: Configure API Endpoint
We configured the frontend to read its API base URL from a `VITE_API_URL` environment variable.

1. Go to [Netlify](https://www.netlify.com/) and log in.
2. Click **Add new site** -> **Import an existing project** -> Choose **GitHub**.
3. Connect your repository and select the **frontend** directory as the base directory.
4. Set the build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
5. Under **Environment variables**, click **Add variable**:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-app.onrender.com` *(Paste your live Django backend URL from Render/Railway here)*
6. Click **Deploy**.

*Note: The `_redirects` file inside `frontend/public/` handles routing fallbacks so that reload operations on routes like `/cart` or `/wishlist` work seamlessly.*

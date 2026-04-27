# Deployment

This project is prepared for a single-service deployment.

## What the server does in production
- Serves the built Vite frontend from `dist/`
- Keeps API routes under `/api/*`
- Falls back to `index.html` for SPA routes like `/about`, `/order`, `/profile`

## Build and start
- Build: `npm run build`
- Start: `npm start`

## Environment variables
Set these in your hosting provider:
- `MONGODB_URI`
- `MONGODB_DB_NAME` (optional, defaults to `CleanProfi`)
- `JWT_SECRET`
- `CLIENT_ORIGIN` (your public site URL, for example `https://your-domain.com`)
- `NODE_ENV=production`
- `PORT` (if your hosting platform requires it)

## MongoDB Atlas
- Allow network access from your hosting provider
- Use a user with `readWrite` access to the target database
- You can still connect to the same cluster with MongoDB Compass if your IP is allowed

## Recommended hosting flow
- Deploy the repo as one service
- Install dependencies
- Build the app
- Start with `npm start`

## Notes
- `CLIENT_ORIGIN` must match the real public domain of the site
- If your host provides a build step and a start step, use them instead of a separate frontend deployment

# Hostinger Deployment

## Frontend

Deploy this repository as a static Vite site. Configure the build command as `npm ci && npm run build`, then publish the `dist` directory. Set `VITE_API_URL` to the backend origin with `/api` before building, for example `https://api.example.com/api`. Add the production Google OAuth client ID as `VITE_GOOGLE_CLIENT_ID` if Google sign-in is enabled.

Configure the static host to rewrite application routes to `index.html` so React Router routes such as `/subscriptions` work on direct visits.

## Backend and payments

The backend is a separate Node.js service and repository. Configure its `PORT`, `NODE_ENV=production`, strong `JWT_SECRET`, `CORS_ORIGINS`, OAuth identifiers, and reachable MySQL `DB_*` values in Hostinger's environment settings. Never commit `.env` files or paste provider secrets into chat.

Subscription mobile-money requests intentionally fail closed until real MTN/Orange payment initiation and server-side callback verification are implemented and merchant credentials are configured. Do not enable customer payments or mark orders paid based only on frontend input. Obtain approved merchant access and provider callback URLs before launch.
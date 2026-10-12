import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
//
// Deliberately NO dev proxy.
//
// `src/config.js` sets `axios.defaults.baseURL` to the backend origin, so every
// API call already goes straight to http://localhost:8080 and never passes
// through Vite. A proxy for /admin/* was therefore doing nothing for API
// traffic — but it did intercept page refreshes, because the SPA routes
// /admin/orders and /admin/users share their paths with the backend endpoints.
// Clicking a link is handled by React Router with no HTTP request, but F5 is a
// real document request: the proxy forwarded it to Spring, which has no page
// there, and the browser showed Spring's Whitelabel error page instead of the
// app. Without the proxy, Vite serves index.html for unknown paths and the
// router takes over, so deep links and refreshes work.
export default defineConfig({
  plugins: [react()],
})

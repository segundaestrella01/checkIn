# Daily Mood Check-In

A Progressive Web App (PWA) that allows users to track their daily mood states with a simple, intuitive interface.

## Purpose

The Daily Mood Check-In app provides a straightforward way for users to record their prevalent mood at the end of each day. This self-reflection practice can help with:

- Mental health awareness
- Mood pattern recognition
- Emotional self-awareness
- Building a personal mood history

## Features

- Select from seven mood states: angry, tired, stressed, anxious, calm, energetic, and happy
- Each mood is represented by a descriptive emoji for quick visual recognition
- PWA functionality allows for installation on mobile devices and offline usage
- Local storage saves mood history directly on the user's device
- Simple, responsive interface that works well on both desktop and mobile devices

## Tech Stack

- **Frontend Framework**: [Svelte](https://svelte.dev) - A lightweight, component-based JavaScript framework
- **Build Tool**: [Rollup](https://rollupjs.org) - Module bundler for JavaScript
- **PWA Features**: Service Workers using [Workbox](https://developers.google.com/web/tools/workbox) for offline capabilities
- **Server**: [sirv](https://github.com/lukeed/sirv) for static file serving
- **CSS**: Native CSS with responsive design patterns

## Available Commands

```bash
# Install dependencies
npm install

# Start development server with hot-reloading
npm run dev

# Build optimized production version
npm run build

# Serve the production build
npm run start

# Serve as a SPA (useful for client-side routing)
sirv public --single
```

## Development

The application structure follows Svelte conventions:

- `src/` - Contains the application source code
  - `components/` - Reusable Svelte components
  - `App.svelte` - Main application component
  - `main.js` - Application entry point
- `public/` - Static assets and production build destination
  - `service-worker.js` - PWA offline functionality
  - `manifest.json` - PWA installation configuration
  - `icons/` - App icons for various device sizes

## Customization

The mood options can be easily customized by modifying the `moods` array in the `src/App.svelte` file.

## Deployment

After building the app with `npm run build`, the contents of the `public` directory can be deployed to any static file hosting service like Vercel, Netlify, or GitHub Pages.

## Browser Support

The app supports all modern browsers with PWA capabilities. For the best experience, use the latest versions of Chrome, Firefox, Safari, or Edge.

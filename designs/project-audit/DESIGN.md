# Project Audit: Package Updates & Local Dev Improvements

## Overview

This project is a full-stack Spotify playlist generator (React frontend, Express/GraphQL backend, shared utilities package). Many dependencies are outdated and some are deprecated. The local development experience is unnecessarily complicated due to self-signed HTTPS certificates that were previously required by Spotify's OAuth callback URL policy.

## Problems

### 1. Deprecated Packages

- **`express-graphql`** (v0.12.0): Archived March 2023. No longer maintained.
- **`body-parser`**: Redundant since Express 4.16.0 (built-in `express.json()`).
- **`file-loader`**: Deprecated in webpack 5 (replaced by built-in Asset Modules).
- **`@sentry/node` and `@sentry/react`** (v7): Three major versions behind (current: v10). The v7-to-v8 migration is the largest jump (OpenTelemetry rewrite, new integration API).

### 2. Outdated Packages

- **React 18** -> React 19 is stable (released Dec 2024).
- **MUI 5** -> MUI 7 is current.
- **TypeScript ~4.9** (backend) -> 5.x is current.
- **Various @types packages** are outdated.
- **webpack-dev-server 4** -> 5 is current.

### 3. Local Development Pain: Spotify Callback URLs

The current local dev setup requires:
- Self-signed HTTPS certificates (`localhost.pem`, `localhost-key.pem`) for both frontend webpack-dev-server and backend Express.
- `https://127.0.0.1:8000/spotify_redirect` as the Spotify OAuth callback.
- `https://localhost:3000` for the frontend.
- Browser certificate trust warnings.

**As of November 2025**, Spotify changed their policy:
- `http://127.0.0.1:PORT` is allowed (no HTTPS needed for loopback).
- `localhost` is **banned** entirely.
- HTTPS is only required for non-loopback URLs.

This means local dev can use plain HTTP, eliminating the need for self-signed certificates.

### 4. Miscellaneous Issues

- Double slash in redirect URI: `https://127.0.0.1:8000//spotify_redirect` (config.ts line 19).
- Double slash in API endpoint: `https://127.0.0.1:8000//graphql` (webpack.js line 9).
- `ngrok.yml` has a hardcoded auth token that should be in .env or removed.
- Frontend webpack config uses deprecated `https` option (should be `server` in webpack-dev-server 5).

## Solution

### Milestone 1: Remove Self-Signed Certs & Fix Local Dev (Spotify Callback)

Switch local development from HTTPS with self-signed certs to plain HTTP for the backend and frontend. Update Spotify redirect URI configuration. This is a cross-cutting change that touches backend config, backend server setup, frontend webpack config, and frontend API endpoints.

**Changes:**
- Backend `config.ts`: Change local redirect URI from `https://127.0.0.1:8000//spotify_redirect` to `http://127.0.0.1:8000/spotify_redirect` (also fixes double slash).
- Backend `index.ts`: Remove HTTPS server creation for dev; use plain HTTP. Remove `fs`/`https`/`path` imports for cert loading. Update CORS to allow `http://127.0.0.1:3000`.
- Frontend `webpack.js`: Remove `https` config from devServer. Fix double slash in API endpoint. Change frontend URL to `http://127.0.0.1:3000`. Change API endpoint to `http://127.0.0.1:8000/graphql`.
- Update Spotify Developer Dashboard redirect URI (manual step, documented).

### Milestone 2: Replace Deprecated Packages

Replace packages that are deprecated/archived and have straightforward replacements.

**Changes:**
- Replace `express-graphql` with `graphql-http`. This is the official successor maintained by the GraphQL Foundation with a migration guide for express-graphql users.
- Remove `body-parser`, use `express.json()` built into Express.
- Replace `file-loader` with webpack 5 Asset Modules (`type: 'asset/resource'`).

### Milestone 3: Update Sentry to v10

Sentry v7 -> v10 is a large migration (3 major versions). The v7-to-v8 jump is the biggest (OpenTelemetry, new API).

**Changes (backend):**
- Update `@sentry/node` from v7 to v10.
- Replace class-based integrations with function-based: `new Sentry.Integrations.Http()` -> `httpIntegration()`.
- Replace `Sentry.Handlers.requestHandler()` / `tracingHandler()` / `errorHandler()` with new `setupExpressErrorHandler()` API.
- Update initialization pattern.

**Changes (frontend):**
- Update `@sentry/react` from v7 to v10.
- Update any ErrorBoundary usage if present.

### Milestone 4: Update MUI 5 to MUI 7

Update Material UI from v5 to v7. MUI provides codemods for automated migration.

**Changes:**
- Update `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`.
- Fix any deep import paths (only one level allowed in v7).
- Apply codemods for Grid and other component API changes.

### Milestone 5: Update React 18 to React 19

Update React and React DOM from v18 to v19.

**Changes:**
- Update `react`, `react-dom`, and their type packages.
- Update `react-router` and `react-router-dom` to latest v6 or v7.
- Remove deprecated type packages (`@types/react-router-dom` is no longer needed with modern react-router).
- Fix any breaking changes in the React 19 upgrade.

### Milestone 6: Update Remaining Dependencies

Catch-all for updating the remaining outdated but non-breaking packages.

**Changes:**
- Update TypeScript to v5 across all packages (backend, frontend, utilities).
- Update webpack, webpack-cli, webpack-dev-server to latest v5.
- Update ESLint and related plugins.
- Update remaining @types packages.
- Update minor/patch versions of all other dependencies.

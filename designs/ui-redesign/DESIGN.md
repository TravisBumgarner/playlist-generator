# UI Redesign — Inspired by Photo Palettes

## Overview

Redesign the Manifest Playlists frontend to adopt the clean, minimalist, brutalist-inspired aesthetic from the Photo Palettes project. The current UI uses MUI defaults with dark-only mode and a hamburger-drawer navigation pattern. The redesign replaces this with a structured design system, light/dark mode support, sharp edges, and a cleaner layout.

## Design Principles (from Photo Palettes)

- **Grayscale palette** — all UI chrome is grayscale; color comes only from content (album art)
- **Zero border-radius** — sharp, brutalist corners on all components
- **Satoshi font** — clean, modern variable font replacing system Roboto
- **Token-based spacing** — consistent spacing scale (4/10/20/36/48px)
- **Light + dark mode** — respects `prefers-color-scheme`, not hardcoded dark
- **No box-shadow** — flat, shadow-free buttons and cards
- **Bold typography** — weight 900 for headings and primary actions, 600 for secondary

## Changes

### 1. Design Tokens (`frontend/src/styles/styleConsts.ts`) — NEW FILE

Create a centralized design token file matching the Photo Palettes pattern:

```ts
export const PALETTE = {
  grayscale: {
    0: 'hsl(0 0% 100%)',
    50: 'hsl(0 0% 95%)',
    100: 'hsl(0 0% 90%)',
    200: 'hsl(0 0% 80%)',
    300: 'hsl(0 0% 70%)',
    400: 'hsl(0 0% 60%)',
    500: 'hsl(0 0% 50%)',
    600: 'hsl(0 0% 40%)',
    700: 'hsl(0 0% 30%)',
    800: 'hsl(0 0% 20%)',
    850: 'hsl(0 0% 15%)',
    900: 'hsl(0 0% 10%)',
    1000: 'hsl(0 0% 0%)',
  },
}

export const BORDER_RADIUS = { ZERO: { PX: '0px', INT: 0 } }

export const FONT_SIZES = {
  SMALL: { PX: '12px', INT: 12 },
  MEDIUM: { PX: '16px', INT: 16 },
  LARGE: { PX: '24px', INT: 24 },
  HUGE: { PX: '32px', INT: 32 },
}

export const SPACING = {
  TINY: { PX: '4px', INT: 4 },
  SMALL: { PX: '10px', INT: 10 },
  MEDIUM: { PX: '20px', INT: 20 },
  LARGE: { PX: '36px', INT: 36 },
  HUGE: { PX: '48px', INT: 48 },
} as const

export const LIGHT_BUTTON_STYLES = {
  color: PALETTE.grayscale[50],
  background: PALETTE.grayscale[800],
  hoverBackground: PALETTE.grayscale[800],
}

export const DARK_BUTTON_STYLES = {
  color: PALETTE.grayscale[900],
  background: PALETTE.grayscale[200],
  hoverBackground: PALETTE.grayscale[100],
}

export const subtleBackground = (
  theme: 'dark' | 'light',
  subtleness: 'very' | 'slightly' = 'very'
) => {
  if (subtleness === 'slightly') {
    return theme === 'dark'
      ? `color-mix(in hsl, ${PALETTE.grayscale[500]}, ${PALETTE.grayscale[900]} 90%)`
      : `color-mix(in hsl, ${PALETTE.grayscale[100]}, ${PALETTE.grayscale[50]} 50%)`
  }
  return theme === 'dark'
    ? `color-mix(in hsl, ${PALETTE.grayscale[800]}, ${PALETTE.grayscale[900]} 80%)`
    : `color-mix(in hsl, ${PALETTE.grayscale[100]}, ${PALETTE.grayscale[50]} 80%)`
}
```

### 2. Theme Rewrite (`frontend/src/theme.tsx`)

Replace the current minimal dark-only theme with a full Photo Palettes–style theme that:

- Supports both light and dark mode via `useMediaQuery('(prefers-color-scheme: dark)')`
- Uses the `PALETTE`, `BORDER_RADIUS`, `FONT_SIZES`, `SPACING` tokens
- Sets `borderRadius: 0` on all MUI components (Button, TextField, OutlinedInput, IconButton, Tooltip, Switch, Card, Dialog, etc.)
- Sets `boxShadow: 'none'` on buttons
- Sets `textTransform: 'none'` on buttons
- Configures typography with Satoshi font family, fallback to Roboto
- Sets h1 (32px/900), h2 (24px/900), h3 (16px/900), body1 (16px), body2 (12px)
- Configures mode-specific palette colors (background, paper, text, divider, buttons) using `PALETTE.grayscale`
- Exports an `AppThemeProvider` component that wraps children in `ThemeProvider` + `CssBaseline`
- Removes the `pageWrapperCSS` export (replaced by a `PageWrapper` component)
- Preserves the `LinkBehavior` integration for React Router links

### 3. Satoshi Font (`frontend/public/fonts/`)

Copy the Satoshi variable font files from Photo Palettes into `frontend/public/fonts/`:
- `Satoshi-Variable.ttf`
- `Satoshi-Variable.woff`
- `Satoshi-Variable.woff2`

Add `@font-face` declaration in `index.html` or a CSS file:
```css
@font-face {
  font-family: 'Satoshi';
  src: url('/fonts/Satoshi-Variable.woff2') format('woff2'),
       url('/fonts/Satoshi-Variable.woff') format('woff'),
       url('/fonts/Satoshi-Variable.ttf') format('truetype');
  font-weight: 100 900;
  font-display: swap;
}
```

Remove the `@fontsource/roboto` import if present (Roboto stays as fallback in the theme font stack, loaded from the system or CDN).

### 4. PageWrapper Component (`frontend/src/styles/shared/PageWrapper.tsx`) — NEW FILE

Create a reusable page layout component (matching Photo Palettes):

```tsx
const PageWrapper = ({
  children,
  width = 'medium',
}: {
  children: React.ReactNode
  width?: 'small' | 'medium' | 'full'
}) => {
  // small = 400px, medium = 600px, full = 100%
  // maxWidth: 95%, centered with margin auto
  // display: flex, flexDirection: column
}
```

All pages migrate from `<Container css={pageWrapperCSS}>` to `<PageWrapper width="medium">`.

### 5. Header Redesign (`frontend/src/components/Header.tsx`)

Replace the MUI AppBar with a simpler flex row layout (matching Photo Palettes header):

- **Left:** App logo/favicon (clickable link to home). No hamburger menu icon.
- **Right:** Row of items:
  - Link to changelog or about (text link)
  - If logged out: "Login" button (styled like photo-palettes create button — bold, filled)
  - If logged in: User avatar + "Logout" text button
- Remove AppBar, Toolbar — use a plain `<Box>` with flexbox
- Padding: `SPACING.SMALL` vertical, content constrained to page width
- Bottom margin: `SPACING.MEDIUM`

### 6. Remove Drawer Navigation (`frontend/src/components/Navigation.tsx`)

Delete the drawer-based navigation entirely. Navigation moves to:
- **Home page** — algorithm list (already exists)
- **Header** — simple text links
- Remove the `isMenuOpen` / `TOGGLE_MENU` state from the global context

### 7. Footer Simplification (`frontend/src/components/Footer.tsx`)

Simplify the footer:
- Remove the three-column layout hack
- Use a simple flex row with `justifyContent: space-between`
- Left: App name or copyright text
- Right: "Powered by Spotify" with logo
- Add subtle background using `subtleBackground()` utility
- Keep the Alert component rendered above the footer (or in a fixed position)

### 8. Home Page (`frontend/src/pages/Home.tsx`)

Restyle the algorithm list:
- Use `PageWrapper` instead of Container + pageWrapperCSS
- Display algorithms as a grid of cards (2 columns on desktop, 1 on mobile) instead of a MUI List
- Each card: algorithm title (h3, bold) + description (body2)
- Cards have `subtleBackground` and zero border-radius
- Clickable — navigates to the algorithm page
- Add "Want more? Request a playlist generator!" as a text link at the bottom

### 9. Landing Page (`frontend/src/pages/LandingPage.tsx`)

Restyle to match the cleaner aesthetic:
- Use `PageWrapper`
- Keep the same content structure but with new typography tokens
- Login button uses the new theme button styles (zero radius, bold, no shadow)
- Algorithm grid uses the same card style as Home page

### 10. Algorithm Pages (`frontend/src/pages/algorithms/AlgorithmWrapper.tsx`)

- Use `PageWrapper` instead of Container + pageWrapperCSS
- Buttons adopt the new theme styles automatically
- No other structural changes needed — MUI component overrides handle the visual update

### 11. Playlist Component (`frontend/src/sharedComponents/Playlist.tsx`)

- Card border uses theme divider color instead of hardcoded `#363636`
- Zero border-radius on the card (handled by theme)
- No other structural changes — the theme overrides handle buttons, text fields, etc.

### 12. Search Autocomplete (`frontend/src/sharedComponents/Search.tsx`)

- Group header styling uses `subtleBackground` and theme text colors instead of hardcoded colors
- Zero border-radius on the autocomplete dropdown (handled by theme)

### 13. Login Modal (`frontend/src/sharedComponents/Login.tsx`)

- Dialog gets zero border-radius (handled by theme)
- Button gets new theme styles automatically

### 14. Loading Component (`frontend/src/sharedComponents/Loading.tsx`)

- Replace the rotating MUI icon with a Framer Motion–style spinning square (matching Photo Palettes)
- Or keep the current icon but ensure it uses theme-aware colors

### 15. Alert Component (`frontend/src/components/Alert.tsx`)

- Zero border-radius on the MUI Alert (handled by theme override on MuiAlert / MuiPaper)
- Ensure it works in both light and dark mode

### 16. Remove Unused CSS Reset from `index.html`

The massive inline CSS reset in `index.html` is largely redundant with MUI's `CssBaseline`. Remove it and let CssBaseline handle the reset. Keep only the `@font-face` declaration if adding the font inline.

## Files Summary

| File | Action |
|------|--------|
| `frontend/src/styles/styleConsts.ts` | Create (new) |
| `frontend/src/styles/shared/PageWrapper.tsx` | Create (new) |
| `frontend/src/theme.tsx` | Rewrite |
| `frontend/public/fonts/Satoshi-Variable.*` | Copy from photo-palettes |
| `frontend/index.html` | Simplify (remove CSS reset, add font-face) |
| `frontend/src/components/Header.tsx` | Rewrite |
| `frontend/src/components/Navigation.tsx` | Delete |
| `frontend/src/components/Footer.tsx` | Simplify |
| `frontend/src/pages/Home.tsx` | Restyle |
| `frontend/src/pages/LandingPage.tsx` | Restyle |
| `frontend/src/pages/algorithms/AlgorithmWrapper.tsx` | Minor (use PageWrapper) |
| `frontend/src/sharedComponents/Playlist.tsx` | Minor (theme-aware border) |
| `frontend/src/sharedComponents/Search.tsx` | Minor (theme-aware group header) |
| `frontend/src/sharedComponents/Loading.tsx` | Optional restyle |
| `frontend/src/sharedComponents/Login.tsx` | No changes (theme handles it) |
| `frontend/src/components/Alert.tsx` | No changes (theme handles it) |
| `frontend/src/Context.tsx` | Remove menu state |
| `frontend/src/App.tsx` | Remove Navigation import, update theme provider |

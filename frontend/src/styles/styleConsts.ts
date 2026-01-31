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

export const BORDER_RADIUS = {
  ZERO: {
    PX: '0px',
    INT: 0,
  },
}

export const FONT_SIZES = {
  SMALL: {
    PX: '12px',
    INT: 12,
  },
  MEDIUM: {
    PX: '16px',
    INT: 16,
  },
  LARGE: {
    PX: '24px',
    INT: 24,
  },
  HUGE: {
    PX: '32px',
    INT: 32,
  },
}

export const SPACING = {
  TINY: {
    PX: '4px',
    INT: 4,
  },
  SMALL: {
    PX: '10px',
    INT: 10,
  },
  MEDIUM: {
    PX: '20px',
    INT: 20,
  },
  LARGE: {
    PX: '36px',
    INT: 36,
  },
  HUGE: {
    PX: '48px',
    INT: 48,
  },
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

export const subtleBackground = (theme: 'dark' | 'light', subtleness: 'very' | 'slightly' = 'very') => {
  if (subtleness === 'slightly') {
    return theme === 'dark'
      ? `color-mix(in hsl, ${PALETTE.grayscale[500]}, ${PALETTE.grayscale[900]} 90%)`
      : `color-mix(in hsl, ${PALETTE.grayscale[100]}, ${PALETTE.grayscale[50]} 50%)`
  }

  return theme === 'dark'
    ? `color-mix(in hsl, ${PALETTE.grayscale[800]}, ${PALETTE.grayscale[900]} 80%)`
    : `color-mix(in hsl, ${PALETTE.grayscale[100]}, ${PALETTE.grayscale[50]} 80%)`
}

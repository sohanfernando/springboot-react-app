/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // legacy tokens (still used by the admin side — do not remove)
        darkBackground: '#101010',
        overlayDark: '#1f1f211a',

        // Velora palette. Greyscale only; `destructive` is the single hue.
        ink: '#000000',
        void: '#080808',
        carbon: '#111111',
        secondary: '#ededed',
        muted: '#f5f5f5',
        line: '#dadada',
        subtle: '#6b6b6b',
        destructive: '#dc2626',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'Georgia', 'serif'],
        inter: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        label: '0.2em',
        button: '0.25em',
        wordmark: '0.35em',
        eyebrow: '0.5em',
      },
      transitionDuration: {
        400: '400ms',
      },
      transitionTimingFunction: {
        // the one overlay curve Velora uses everywhere
        overlay: 'cubic-bezier(0.76, 0, 0.24, 1)',
        // CSS equivalents of the GSAP eases
        power3: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
        power4: 'cubic-bezier(0.165, 0.84, 0.44, 1)',
      },
      maxWidth: {
        'screen-2xl': '1536px',
      },
    },
  },
  plugins: [],
}

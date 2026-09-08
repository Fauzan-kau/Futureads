/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Content face. DM Sans over Inter: it shares Space Grotesk's geometric
        // skeleton, so body copy supports the titles instead of sitting beside
        // them in a second voice. Inter stays as the first fallback — it is the
        // closest metric match, so a blocked webfont degrades without reflow.
        sans: ['DM Sans', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        // Titles only. Space Grotesk tops out at 700, which matches the
        // heaviest weight Heading.jsx asks for — no synthesised bold.
        display: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        // letterSpacing lives on the token, so Heading.jsx must not add its own
        // tracking-* class or it silently wins over every value below.
        'display': ['clamp(2.75rem, 7vw, 5.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'headline': ['clamp(1.875rem, 4vw, 3.25rem)', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'title': ['clamp(1.375rem, 2.5vw, 2rem)', { lineHeight: '1.15', letterSpacing: '-0.015em' }],
        'subtitle': ['clamp(1.25rem, 1.6vw, 1.5rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        // Content sizes carry letterSpacing and line-height on the token for the
        // same reason the display sizes do — set once here, never as a utility
        // that would silently outrank the token. DM Sans sets slightly wider
        // than Inter at the same size, so a touch of negative tracking restores
        // an even colour, and the longer line-heights give a 65-75 character
        // measure the leading it actually needs.
        'body-lg': ['1.1875rem', { lineHeight: '1.65', letterSpacing: '-0.011em' }],
        'body': ['1.0625rem', { lineHeight: '1.7', letterSpacing: '-0.006em' }],
        'caption': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.001em' }],
      },
      spacing: {
        'section': 'clamp(3rem, 7vh, 4.5rem)',
      },
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        gray: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
      },
    },
  },
  plugins: [],
}

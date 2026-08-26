/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Lotus blue — the primary accent
        lotus: {
          50: '#F0F6FC',
          100: '#DFEBF7',
          200: '#BFD7EE',
          300: '#93BBE0',
          400: '#6499CD',
          500: '#3F7CB8',
          600: '#2E6BAA',
          700: '#255689',
          800: '#1F4568',
          900: '#1B3A57',
        },
        // Warm cream neutrals — light-mode surfaces
        cream: {
          50: '#FDFCF9',
          100: '#FAF7F0',
          200: '#F2EDE2',
          300: '#E5DECF',
          400: '#D5C9B0',
          500: '#C0AE8D',
        },
        // Deep navy — dark-mode surfaces
        night: {
          700: '#16283E',
          800: '#12202F',
          850: '#0F1D2E',
          900: '#0B1522',
        },
        // Soft lotus-petal pink, used sparingly in artwork
        petal: {
          light: '#EFD3D8',
          DEFAULT: '#E2AEB8',
          deep: '#C98B98',
        },
        gold: {
          light: '#E3D3AC',
          DEFAULT: '#C6A75E',
          deep: '#A78A45',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 4px 24px -6px rgba(27, 58, 87, 0.08), 0 2px 8px -4px rgba(27, 58, 87, 0.05)',
        lift: '0 16px 40px -12px rgba(27, 58, 87, 0.16)',
        island: '0 8px 32px -8px rgba(27, 58, 87, 0.18), 0 2px 8px -2px rgba(27, 58, 87, 0.08)',
      },
      maxWidth: {
        content: '72rem',
      },
    },
  },
  plugins: [],
}

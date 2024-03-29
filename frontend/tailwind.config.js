/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      '-2xl': { max: '1536px' },
      // => @media (max-width: 1536px) { ... }

      '-xl': { max: '1280px' },
      // => @media (max-width: 1280px) { ... }

      '-lg': { max: '1024px' },
      // => @media (max-width: 1024px) { ... }

      '-md': { max: '768px' },
      // => @media (max-width: 768px) { ... }

      '-sm': { max: '640px' },
      // => @media (max-width: 640px) { ... }

      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    },
    extend: {},
  },
  plugins: [ require('@tailwindcss/forms'), require('tailwind-scrollbar') ],
}


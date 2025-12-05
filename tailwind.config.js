/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        accent: "#0d9488",
        background: "#f9fafb",
        text: "#1e293b",
      },
      keyframes: {
        fadein: {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      },
      animation: {
        'fade-in': 'fadein 400ms ease-out both'
      }
    },
  },
  plugins: [],
}


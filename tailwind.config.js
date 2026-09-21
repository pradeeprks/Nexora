/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexora: {
          bg: "#090a0f",
          card: "rgba(18, 21, 32, 0.75)",
          cardHover: "rgba(26, 31, 48, 0.85)",
          border: "#1e2436",
          borderBright: "rgba(255, 42, 95, 0.3)",
          red: "#ff2a5f",
          redBright: "#ff003c",
          redGlow: "rgba(255, 42, 95, 0.25)",
          cyan: "#00f0ff",
          amber: "#ffb703",
          green: "#00e676",
          darkText: "#8c96ab"
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'neon-red': '0 0 20px rgba(255, 42, 95, 0.35)',
        'neon-red-lg': '0 0 35px rgba(255, 42, 95, 0.5)',
        'neon-cyan': '0 0 20px rgba(0, 240, 255, 0.35)',
        'neon-green': '0 0 20px rgba(0, 230, 118, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-red': 'glowRed 2s ease-in-out infinite alternate',
        'scanline': 'scanline 8s linear infinite',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        glowRed: {
          '0%': { boxShadow: '0 0 10px rgba(255, 42, 95, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(255, 42, 95, 0.6)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      }
    },
  },
  plugins: [],
}

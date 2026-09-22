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
        cyber: {
          950: '#030712',
          900: '#060c18',
          850: '#0a1222',
          800: '#0f172a',
          750: '#152037',
          700: '#1e293b',
          600: '#334155',
          500: '#475569',
          400: '#64748b',
          300: '#94a3b8',
          200: '#cbd5e1',
          100: '#f1f5f9',
          50: '#f8fafc',
        },
        soc: {
          critical: '#ef4444',
          high: '#f97316',
          medium: '#eab308',
          low: '#06b6d4',
          info: '#3b82f6',
          success: '#10b981',
        },
        radar: {
          cyan: '#00f2ff',
          blue: '#0066ff',
          purple: '#8a2be2',
          magenta: '#ff007f',
          green: '#00ff88',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 20px -3px rgba(0, 242, 255, 0.35)',
        'glow-red': '0 0 20px -3px rgba(239, 68, 68, 0.4)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'glow-purple': '0 0 20px -3px rgba(138, 43, 226, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      }
    },
  },
  plugins: [],
}

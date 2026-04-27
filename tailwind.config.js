/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B1120",
        surface: "#151E32",
        "surface-light": "#1E293B",
        primary: "#0EA5E9",
        "primary-dark": "#0284C7",
        success: "#10B981",
        warning: "#F59E0B",
        text: "#F1F5F9",
        "text-secondary": "#94A3B8",
        "text-muted": "#64748B",
      },
    },
  },
  plugins: [],
}
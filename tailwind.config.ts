import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#F8F2E4",
          50: "#FFFDFA",
          100: "#FBF6EA",
          200: "#F8F2E4",
          300: "#EFE4CC",
          400: "#E4D5B0",
        },
        wine: {
          DEFAULT: "#6E1423",
          50: "#F6E9EB",
          400: "#8C1C33",
          500: "#6E1423",
          600: "#4E0E19",
          900: "#2E0810",
        },
        gold: {
          DEFAULT: "#B8912F",
          100: "#F3E6C4",
          300: "#E4C874",
          500: "#B8912F",
          600: "#8C6D1F",
          900: "#5A4614",
        },
        ink: "#2B2320",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Georgia", "serif"],
        label: ["var(--font-cinzel)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 20px 60px -20px rgba(43, 35, 32, 0.35)",
        gold: "0 0 0 1px rgba(184,145,47,0.35), 0 20px 50px -20px rgba(184,145,47,0.4)",
      },
      backgroundImage: {
        "gold-foil": "linear-gradient(135deg, #E4C874 0%, #B8912F 45%, #8C6D1F 55%, #E4C874 100%)",
      },
      keyframes: {
        "stamp-in": {
          "0%": { opacity: "0", transform: "scale(2.2) rotate(-18deg)" },
          "60%": { opacity: "1", transform: "scale(0.94) rotate(-12deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(-12deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "stamp-in": "stamp-in 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        shimmer: "shimmer 3s linear infinite",
        float: "float 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;

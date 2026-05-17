import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#08080C",
          surface: "#0F0F16",
          elevated: "#16161F",
          overlay: "rgba(8, 8, 12, 0.85)",
        },
        border: {
          DEFAULT: "#1C1C2A",
          subtle: "#13131D",
          strong: "#2A2A3D",
        },
        foreground: {
          DEFAULT: "#FAFAFA",
          muted: "#A8A8B0",
          subtle: "#6E6E78",
          inverse: "#08080C",
        },
        gold: {
          50: "#FBEEE9",
          100: "#F7DDD0",
          200: "#F0B8A0",
          300: "#E59F7D",
          400: "#D97757",
          500: "#C25E40",
          600: "#A04B32",
          700: "#7D3A27",
          800: "#5F2C1E",
          900: "#421F15",
          DEFAULT: "#D97757",
        },
        brand: {
          50: "#FBEEE9",
          100: "#F7DDD0",
          200: "#F0B8A0",
          300: "#E59F7D",
          400: "#D97757",
          500: "#C25E40",
          600: "#A04B32",
          700: "#7D3A27",
          800: "#5F2C1E",
          900: "#421F15",
          DEFAULT: "#D97757",
        },
        cream: {
          DEFAULT: "#F0EBE0",
          50: "#FBF8F2",
          100: "#F5EFE3",
          200: "#EDE2CC",
        },
        accent: {
          DEFAULT: "#D97757",
          hover: "#E59F7D",
          muted: "rgba(217, 119, 87, 0.15)",
          glow: "rgba(217, 119, 87, 0.35)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "var(--font-arabic)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-inter)", "var(--font-arabic)", "Georgia", "serif"],
      },
      fontSize: {
        "display-2xl": ["clamp(3.5rem, 11vw, 9.5rem)", { lineHeight: "0.95", letterSpacing: "-0.045em", fontWeight: "700" }],
        "display-xl": ["clamp(3rem, 8vw, 7rem)", { lineHeight: "1", letterSpacing: "-0.035em", fontWeight: "700" }],
        "display-lg": ["clamp(2.25rem, 5.5vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.025em", fontWeight: "700" }],
        "display-md": ["clamp(1.875rem, 4vw, 3rem)", { lineHeight: "1.1", letterSpacing: "-0.015em", fontWeight: "700" }],
        "display-sm": ["clamp(1.5rem, 3vw, 2.25rem)", { lineHeight: "1.15", letterSpacing: "-0.01em", fontWeight: "600" }],
        "label": ["0.7rem", { lineHeight: "1", letterSpacing: "0.25em", fontWeight: "600" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        "gold-glow": "0 0 40px rgba(217, 119, 87, 0.3)",
        "gold-glow-lg": "0 0 80px rgba(217, 119, 87, 0.45)",
        "gold-glow-xl": "0 0 120px rgba(217, 119, 87, 0.55)",
        "brand-glow": "0 0 40px rgba(217, 119, 87, 0.3)",
        "brand-glow-lg": "0 0 80px rgba(217, 119, 87, 0.45)",
        "card": "0 1px 0 0 rgba(255, 255, 255, 0.04) inset, 0 0 0 1px rgba(255, 255, 255, 0.04), 0 8px 24px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 1px 0 0 rgba(217, 119, 87, 0.15) inset, 0 0 0 1px rgba(217, 119, 87, 0.25), 0 12px 40px rgba(0, 0, 0, 0.5)",
        "premium": "0 30px 60px -15px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "grid-pattern-gold":
          "linear-gradient(to right, rgba(217,119,87,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(217,119,87,0.07) 1px, transparent 1px)",
        "radial-gold":
          "radial-gradient(circle at 50% 0%, rgba(217, 119, 87, 0.22), transparent 60%)",
        "radial-gold-strong":
          "radial-gradient(ellipse at 50% 30%, rgba(217, 119, 87, 0.38), transparent 55%)",
        "gradient-gold":
          "linear-gradient(135deg, #D97757 0%, #E59F7D 50%, #C25E40 100%)",
        "gradient-gold-text":
          "linear-gradient(180deg, #F0B8A0 0%, #D97757 50%, #A04B32 100%)",
        "noise":
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-up": "fadeUp 0.7s ease-out forwards",
        "shimmer": "shimmer 3s linear infinite",
        "shimmer-fast": "shimmer 1.5s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "float-slow": "float 10s ease-in-out infinite",
        "marquee": "marquee 40s linear infinite",
        "marquee-reverse": "marquee 40s linear infinite reverse",
        "scroll-x": "scroll-x 30s linear infinite",
        "spotlight": "spotlight 8s ease-in-out infinite",
        "pulse-gold": "pulseGold 3s ease-in-out infinite",
        "rotate-slow": "rotate 20s linear infinite",
        "gradient-x": "gradient-x 8s ease infinite",
        "scale-in": "scaleIn 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scroll-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
        spotlight: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: "0.6" },
          "50%": { transform: "translate(40px, -30px) scale(1.15)", opacity: "0.9" },
        },
        pulseGold: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.8", transform: "scale(1.05)" },
        },
        rotate: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
        "premium": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;

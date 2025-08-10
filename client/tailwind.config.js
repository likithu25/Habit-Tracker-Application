module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "neon-pink": "#ff4ecb",
        "neon-blue": "#4ecbff",
        "neon-green": "#4effa1",
        "neon-purple": "#a64eff",
      },
      boxShadow: {
        neon: "0 0 6px rgba(0, 255, 255, 0.6), 0 0 12px rgba(0, 255, 255, 0.4)",
      },
      animation: {
        "gradient-glow": "glow 8s ease infinite",
      },
      keyframes: {
        glow: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      fontFamily: {
        helvetica: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

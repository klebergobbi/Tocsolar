/**
 * Preset Tailwind compartilhado — tokens da marca TOCSOLAR.
 * Apps estendem via `presets: [require("@tocsolar/config/tailwind/preset.js")]`.
 * O `content` fica a cargo de cada app.
 */
/** @type {Omit<import("tailwindcss").Config, "content">} */
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          // <<CONFIRMAR hex exato da marca>>
          orange: "#F59E0B",
          black: "#1A1A1A",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

const preset = require("@tocsolar/config/tailwind/preset.js");

/** @type {import("tailwindcss").Config} */
module.exports = {
  presets: [preset],
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx,mdx}",
  ],
};

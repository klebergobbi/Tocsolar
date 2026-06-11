/**
 * Preset ESLint compartilhado para apps Next.js do monorepo TOCSOLAR.
 * Consome `eslint-config-next` (deve estar instalado no app que estende este preset).
 */
/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },
};

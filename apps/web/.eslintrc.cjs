/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  // require.resolve evita a convenção de nomes do ESLint (que procuraria
  // "@tocsolar/eslint-config") e aponta direto para o arquivo do preset.
  extends: [require.resolve("@tocsolar/config/eslint/next")],
};

import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { files: ["**/*.{js,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
  { files: ["**/*.{js,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
  tseslint.configs.recommended,

  {
    rules: {
      // Avertir sur l'utilisation de console, mais permettre console.warn et console.error
      "no-console": ["warn", { "allow": ["warn", "error"] }],

      // Exiger l'utilisation de l'égalité stricte, mais avec des exceptions intelligentes
      "eqeqeq": ["error", "smart"],

      // Exiger des points-virgules à la fin des instructions
      "semi": ["error", "always"],

      // Avertir sur les variables inutilisées, mais ignorer celles commençant par un "_"
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],

      // Désactiver la règle sur les alias de "this" dans le code TypeScript
      "@typescript-eslint/no-this-alias": "off",

      // Désactiver l'erreur sur certaines variables non définies dans un environnement spécifique
      "no-undef": ["error", { "typeof": true }]
    }
  }
]);

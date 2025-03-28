import globals from "globals";
import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      js,
      "@typescript-eslint": tseslint,
    },
    rules: {
      "no-console": "warn", // Avertit sur les console.log
      "eqeqeq": ["error", "always"], // Force l'utilisation de ===
      "curly": ["error", "all"], // Toujours utiliser des accolades

      // Code Style
      "indent": ["error", 2], // Indentation à 2 espaces
      "quotes": ["error", "double"], // Force l'utilisation des doubles guillemets
      "semi": ["error", "always"], // Obligatoire d'ajouter un point-virgule

      // TypeScript-Specific Rules
      "@typescript-eslint/no-unused-vars": ["error"], // Erreur si une variable est déclarée mais non utilisée
      "@typescript-eslint/explicit-function-return-type": "warn", // Avertit si une fonction n'a pas de type de retour explicite
    },
  },
  {
    // Disable the rule for cache files or problematic directories
    files: ["**/.angular/**/*", "**/node_modules/**/*"],
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off", // Turn off for cache files
    },
  },
];

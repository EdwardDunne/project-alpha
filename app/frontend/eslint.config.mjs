import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import tseslint from "typescript-eslint";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"] },
  { files: ["**/*.{js,mjs,cjs,jsx,ts,tsx}"], languageOptions: { globals: globals.browser } },
  { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"] },
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist/**", ".next/**", "next-env.d.ts", "playwright-report/**", "playwright-report-api/**", ".migration-private/**", "test-results/**"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: { "react-hooks/rules-of-hooks": "error" },
  },
  {
    files: ["src/app/**/*.{ts,tsx}", "src/features/game/**/*.{ts,tsx}"],
    rules: { "react-hooks/exhaustive-deps": "error" },
  },
  // Existing visual/utility code has broad third-party types. Tighten as it is refactored.
  {
    files: ["src/components/background/**", "src/components/blocks/**", "src/components/podium/**", "src/features/onboarding/hooks/share-results-button-hook.ts", "src/utils/misc/**"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },
);

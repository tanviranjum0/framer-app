import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

/**
 * The previous config imported `eslint-config-next/core-web-vitals.js`, which
 * is not an exported subpath in eslint-config-next 16 — so the lint step
 * crashed before reading a single file.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  {
    rules: {
      // Unused values are a real signal here, but allow the `_` convention
      // for intentionally ignored params (Motion's drag callbacks hand over
      // an event this code never reads).
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrors: "none",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;

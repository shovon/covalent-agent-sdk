import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/*.config.js", "**/dist"],
}, ...compat.extends(
    "eslint:recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended",
), {
    rules: {
        semi: "error",
        "no-multiple-empty-lines": "error",
        indent: "off",
        "no-unsafe-optional-chaining": "warn",
        "prettier/prettier": "error",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/no-explicit-any": "warn",
    },
}];
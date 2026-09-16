import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const config = [
  { ignores: [".next/**", "node_modules/**", "starters/**", "drafts/**", "shot.tmp.mjs"] },
  {
    rules: {
      // `const { secret: _secret, ...rest } = obj` is how we drop a field before
      // storing or logging it. The underscore marks the omission as deliberate.
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" },
      ],
    },
  },
  ...(Array.isArray(nextCoreWebVitals) ? nextCoreWebVitals : [nextCoreWebVitals]),
  ...(Array.isArray(nextTypeScript) ? nextTypeScript : [nextTypeScript]),
];

export default config;

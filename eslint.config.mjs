import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import prettier from 'eslint-plugin-prettier';
import _import from 'eslint-plugin-import';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...fixupConfigRules(
    compat.extends(
      'plugin:react-hooks/recommended',
      'plugin:react/jsx-runtime',
      'plugin:prettier/recommended',
      'plugin:@typescript-eslint/recommended',
    ),
  ),
  {
    plugins: {
      prettier: fixupPluginRules(prettier),
      import: fixupPluginRules(_import),
    },

    settings: {
      react: {
        version: 'detect',
      },
    },

    rules: {
      'import/order': [
        'error',
        {
          groups: [
            ['external', 'builtin'],
            ['parent', 'internal'],
            ['index', 'sibling'],
          ],
          'newlines-between': 'always',
        },
      ],

      '@typescript-eslint/consistent-type-imports': 'warn',
    },
  },
];

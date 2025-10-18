import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js ve TypeScript için temel ESLint kuralları
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Proje genel kuralların
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
    rules: {
      // ⚙️ TypeScript özel kurallarını yumuşatıyoruz
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',

      // 🔧 Gereksiz detayları kapatıyoruz
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
    },
  },
];

export default eslintConfig;

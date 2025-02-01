import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	{
		rules: {
			'@next/next/no-img-element': 'off',
			'import/first': 'error',
			'import/newline-after-import': 'warn',
			'import/no-self-import': 'error',
			'curly': ['warn', 'multi-line'],
			'no-alert': 'error',
			'no-var': 'error',
			'prefer-const': 'warn',
			'react/hook-use-state': 'warn',
			'camelcase': [
				'error',
				{ allow: ['^UNSAFE_'], ignoreDestructuring: false, properties: 'never' },
			],
			'new-cap': ['error', { capIsNew: false }],
			'import/order': [
				'warn',
				{
					'groups': [
						'builtin', // Node.js built-in modules
						'external', // Packages
						'internal', // Aliased modules
						'parent', // Relative parent
						'sibling', // Relative sibling
						'index', // Relative index
					],
					'newlines-between': 'never',
				},
			],
		},
	},
];

export default eslintConfig;

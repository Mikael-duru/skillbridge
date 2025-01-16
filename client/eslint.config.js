import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
	{ ignores: ["dist"] },
	{
		files: ["**/*.{js,jsx}"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: {
				ecmaVersion: "latest",
				ecmaFeatures: { jsx: true },
				sourceType: "module",
			},
		},
		settings: { react: { version: "18.3" } },
		plugins: {
			react,
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
		},
		rules: {
			...js.configs.recommended.rules,
			...react.configs.recommended.rules,
			...react.configs["jsx-runtime"].rules,
			...reactHooks.configs.recommended.rules,

			// Customized Rules
			"no-unused-vars": "warn", // Warn for unused variables
			"prefer-const": "warn", // Suggest using const
			"react-hooks/exhaustive-deps": "off", // Disable exhaustive-deps warnings
			"react/jsx-no-target-blank": "off", // Disable 'no target blank' rule
			"react/prop-types": "off", // Disable prop-types requirement

			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
		},
	},
];

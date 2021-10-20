module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	root: true,
	extends: [
		"universe",
		"universe/shared/typescript-analysis",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
		"eslint:recommended",
		"prettier",
		"prettier/react",
		"prettier/@typescript-eslint",
		"plugin:prettier/recommended",
	],
	plugins: ["@typescript-eslint", "react", "prettier"],
	overrides: [
		{
			files: ["*.ts", "*.tsx", "*.d.ts"],
			parserOptions: {
				project: ["./tsconfig.json"],
			},
		},
	],
	parser: "@typescript-eslint/parser",
};

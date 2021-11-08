module.exports = {
	env: {
		browser: true,
		es6: true,
	},
	root: true,
	extends: [
		"universe",
		"universe/shared/typescript-analysis",
		"prettier",
		"prettier/react",
		"plugin:prettier/recommended",
		"prettier/@typescript-eslint",
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
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

## Configuration
- install [Node.js](https://nodejs.org/en/download/)
- install Expo Cli using `npm install -g expo-cli` command
- in client project root - install dependencies using `yarn install` command - this should be done every time some dependecies change
- install [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) from Visual Studio Code marketplace
- install [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Client API and models code generation
Client code generator uses npm version of [OpenAPI Generator](https://github.com/OpenAPITools/openapi-generator). Configuration file - `openapitools.json`.

To generate client code run server and type `yarn generate-api`. Files will be saved in `./generated/` directory (according to configuration). **Do not edit these generated files**.

## Run
To run project use `yarn start` command

## Automatic code fixes
To automatically fix code issues and formatting, you may use `Ctrl + Shift + P` keyboard shortcut and choose `ESLint: Fix all auto-fixable Problems`
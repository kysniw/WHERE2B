## Configuration
- install [Node.js](https://nodejs.org/en/download/)
- install Expo Cli using `npm install -g expo-cli` command
- in client project root - install dependencies using `yarn install` command - this should be done every time some dependecies change (check if `package.json` file has changed)
- install [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) from Visual Studio Code marketplace
- install [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- configure environment variables:
    - find `.env.example` file in project root directory
    - copy file and name it `.env` - this file will be ignored via git
    - setup values in `.env` file:
        - SERVER_URL - if it is on the same machine, it may stay `localhost` for web, for Android emulator change host to `10.0.2.2`, in other cases change it to the server address (for example computer ip address)

## Run
To run project use `yarn start` command. If there was a change in environment variables, use `yarn start -c` or `yarn start --clear` command, to clear the Metro bundler cache.

## Client API and models code generation
Client code generator uses npm version of [OpenAPI Generator](https://github.com/OpenAPITools/openapi-generator). Configuration file - `openapitools.json`.

To generate client code run server and type `yarn generate-api`. Files will be saved in `./src/network/generated/` directory (according to configuration). **Do not edit these generated files**.

## Automatic code fixes
To automatically fix code issues and formatting, you may use `Ctrl + Shift + P` keyboard shortcut and choose `ESLint: Fix all auto-fixable Problems`.
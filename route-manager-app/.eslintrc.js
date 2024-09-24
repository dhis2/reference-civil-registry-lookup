// eslint-disable-next-line @typescript-eslint/no-require-imports
const { config } = require("@dhis2/cli-style");

module.exports = {
  extends: [
    config.eslintReact,
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
  ],
  rules: {
    "import/extensions": "off",
  },
};

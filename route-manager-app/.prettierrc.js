// eslint-disable-next-line @typescript-eslint/no-require-imports
const { config } = require('@dhis2/cli-style')

module.exports = {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    ...require(config.prettier),
}

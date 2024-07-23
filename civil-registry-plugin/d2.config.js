const config = {
    name: 'mock-civil-registry-plugin',
    title: 'Mock Civil Registry Plugin',
    description: 'A mock plugin for doing Civil Registry Lookups in the Capture app',
    type: 'app',

    entryPoints: {
        plugin: './src/Plugin.tsx'
    },
}

module.exports = config

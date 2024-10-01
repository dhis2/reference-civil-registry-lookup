const config = {
    name: 'civil-registry-plugin',
    title: 'Civil Registry Plugin',
    description: 'A plugin for doing Civil Registry Lookups in the Capture app',
    type: 'app',

    entryPoints: {
        plugin: './src/Plugin.tsx'
    },
    // todo: verify plugin type
    pluginType: "CAPTURE",
}

module.exports = config

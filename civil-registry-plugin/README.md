## Civil Registry Mock Plugin

⚠️  Please do not use this in production. This is a mock plugin and should only be used for demonstration purposes.

This plugin is a mock-up for how a Civil Registry lookup plugin could be implemented in DHIS2.
The plugins allows you to call a mock API to search for a person in the Civil Registry and display the results in the Capture app.
The values fetched from the API will set the values of the data elements.

### How to use

1. Download the latest version of the plugin from the _App management application_ on your DHIS2 instance.
2. Download and install the Tracker configurator app from the _App management application_ or from the [App hub](https://apps.dhis2.org/app/85d156b7-6e3f-43f0-be57-395449393f7d).
3. Follow the instructions in the Tracker configurator app to configure the plugin.
4. Open the Capture app and search for a person in the Civil Registry.

### Configuration

The plugin expects three tracked entity attributes to be configured in the field map. Please configure this in the Tracker configurator app.

Example (Child Programme):

| Attribute ID | Plugin alias | Type                            |
|--------------|--------------|---------------------------------|
| w75KJ2mc4zz  | firstName    | Text                            |
| zDhUuAYrxNC  | lastName     | Text                            |
| cejWyOfXge6  | gender       | Text / Option set (Male/female) |

### Important notes

The plugin is a mock-up and does not actually call a real Civil Registry API. If you want to use this in production, you will need to implement the API yourself.
This plugin will call the API directly, but if you want to use it in production, you should always consider using a proxy server to call the API.


# Civil Registry Lookup - reference implementation

This is a reference implementation of a **civil registry lookup** from within the DHIS2 Capture App, with a FHIR-compliant civil registry backend protected by OAuth2 authorization.  This is an example which should be used for reference, it **SHOULD NOT** be used directly in production.

The purpose of the Civil Registry plugin is to reduce the chance of errors and provide a quick way to prefill forms with information of the patients. By developing a plugin in a flexible and adjustable way we allow many countries to use the reference implementation and quickly adjust it to their own civil registry structure and DHIS2 setup. 

The plugin is designed to be secure and flexible and follows best practices that match the functionality offered by DHIS2 v40 and higher.

## Components

* DHIS2 v40.5
* Mock Civil Registry (FHIR-compliant)
* OAuth2 Route Middleware & Translation layer (Apache Camel)
* OAuth2 Authentication server (Keycloak)
* Civil Registry lookup plugin (DHIS2 Capture App plugin)

## Architecture

We will use a [Hapi FHIR](https://hapifhir.io/) server with the [FHIR Person resource](https://www.hl7.org/fhir/person.html) as a mock Civil Registry for the purposes of this example repository.  The middleware component will need to be modified to support different upstream civil registry services when adapting this reference implementation in production.

The plugin in turn talks to the civil registry through a few steps

Plugin talks to the Routes API
Route is configured to point to the civil registry
Route is going through middleware that will take care of oAuth authentication and makes sure the route always is in an authenticated state. 
Middleware handles just the forwarding of the connection but handles oAuth under the hood.

Data coming from the Civil registry will contain, potentially:
- Id
- First name
- Last name
- Gender
- DOB
- [...]

This data is then prefilled in the form.

### Route Configuration
An app is built, called `Route Manager`. This app can be found in the [App Hub](https://apps.dhis2.org/app/5dbe9ab8-46bd-411e-b22f-905f08a81d78) and on [Github](https://github.com/dhis2/route-manager-app), to configure the route using the Routes API. A pre-defined code is used to define the route so both the plugin and the app which configures the routes are pointing to the same Route. 

Only admins should be able to configure the Route (and access the App), but all users (potentially within a limit) should be able to execute/use the configured route. Make sure this is configured correctly to prevent unauthorized access to the Civil Registry.

### Transformation layer
The Apache Camel middleware provided by this reference implementation will handle the translation of the data from the civil registry to the format the plugin expects. This is done to make sure that the plugin is generic and can be used by multiple countries with different civil registry structures.

The transformation of one data source to the one accepted by the plugin is done in the `dhis2Person.ds` configuration file which can be found at `config/oauth-route-middleware/dhis2Person.ds` in this repository. Adjusting this file will allow you to adjust the transformation to your own civil registry structure.

### oAuth handling
The Apache Camel middleware will handle the oAuth2 authentication. The plugin will not have to handle the oAuth2 authentication itself. This solves the problem of having oAuth authentication in the plugin, and therefore requiring all the users to have credentials for the Civil registry. 

oAuth is configured in the `application.yaml` file which can be found in `oauth-route-middleware/src/main/resources/application.yaml` on [line 76-79](https://github.com/dhis2/reference-civil-registry-lookup/blob/084ea4554918cab85afcb6f2a819c95c5fbece90/oauth-route-middleware/src/main/resources/application.yaml#L76-L79). 

## Running the example

To run this self-contained example setup (in non-production environments), you can use the included `docker-compose` configuration.

Running the following command will spin up all components listed above, install the civil registry lookup plugin in DHIS2, configure DHIS2 metadata with a simple Tracker program, and set up the necessary clients in KeyCloak for both DHIS2 authentication and civil registry resource protection (through a DHIS2 route).

## Configuring for Production

When configuring for production, it is important to understand which components to incorporate directly into your production system and which to replace with existing components from your infrastructure.

The following components can be added to your production architecture 


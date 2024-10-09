# Civil Registry Lookup - reference implementation

## What is this implementation?

A civil registry is a national database used for storing personal details of citizens. When working with DHIS2 it can be useful to have a way to look up information from the civil registry to prefill forms in DHIS2. By having it integrated with DHIS2, it can reduce the chance of errors and provide a quick way to prefill forms with information of the patients that's accurate and up-to-date.

This reference implementation shows how to build a plugin for the DHIS2 Capture App that can look up information from a civil registry and prefill forms in DHIS2. It also adds a middleware layer to handle the oAuth2 authentication and translation of data from the civil registry to the format expected by the plugin. This is especially useful as it adds a layer of security. 

## Technical Overview

This is a reference implementation of a **civil registry lookup** from within the DHIS2 Capture App, with a FHIR-compliant civil registry backend protected by OAuth2 authorization.  This is an example which should be used for reference, it **SHOULD NOT** be used directly in production.

The purpose of the Civil Registry plugin is to reduce the chance of errors and provide a quick way to prefill forms with information of the patients. By developing a plugin in a flexible and adjustable way we allow many countries to use the reference implementation and quickly adjust it to their own civil registry structure and DHIS2 setup. 

The plugin is designed to be secure and flexible and follows best practices that match the functionality offered by DHIS2 v40 and higher.


## Quick Start

To run this example locally, you must have the following pre-requisites installed:

* Docker Desktop
* Maven
* Node.js
* Yarn

Once these tools are installed and this repository has been cloned to the local machine, run these two commands to build the components, start all services with docker-compose, and configure the system with some example metadata and data.

```sh
yarn install --frozen-lockfile
yarn build
yarn start
```

If you want to run middleware API tests, you can run the following in another terminal:

```sh
yarn test
```

## Core Components

These components extend the capabilities of the Capture App in DHIS2 to support looking up demographic information from an external civil registry

* Civil Registry lookup plugin (DHIS2 Capture App plugin)
* API Route for civil registry lookups (DHIS2 configuration)
* OAuth2 Route Middleware & Translation layer (Apache Camel)

## Mock components

These services are also included in the docker-compose setup of the reference implementation, allowing this to be a fully self-contained example.  However, in most production implementations these services will already exist and the core components above should be configured to talk with them.

* DHIS2 v40.5
* Mock Civil Registry (FHIR-compliant)
* OAuth2 Authentication server (Keycloak)
* OAuth2 Proxy Service (in front of Civil Registry)

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
For managing routes you can use the App called `Route Manager`. This app can be found in the [App Hub](https://apps.dhis2.org/app/5dbe9ab8-46bd-411e-b22f-905f08a81d78) and on [Github](https://github.com/dhis2/route-manager-app), to configure the route using the Routes API. 

The plugin within this reference implementation expects a route to be configured using the code `civil-registry`. By defining a route with this code, the plugin will know where to look for the civil registry data.

Only admins should be able to configure the Route (and access the App), but all users who should have access to the plugin should be able to execute/use the configured route. Make sure this is configured according to those permissions to prevent unauthorized access to the Civil Registry.

To understand how to configure correctly, please refer to the [Route Manager Configuration](./routes.md) documentation.

### Transformation layer
The Apache Camel middleware provided by this reference implementation will handle the translation of the data from the civil registry to the format the plugin expects. This is done to make sure that the plugin is generic and can be used by multiple countries with different civil registry structures.

The transformation of one data source to the one accepted by the plugin is done in the `dhis2Person.ds` configuration file which can be found at `config/oauth-route-middleware/dhis2Person.ds` in this repository. Adjusting this file will allow you to adjust the transformation to your own civil registry structure.

### Authentication
The Apache Camel middleware follows the [OAuth 2 client credentials flow](https://auth0.com/docs/get-started/authentication-and-authorization-flow/client-credentials-flow) (i.e., machine-to-machine) to authenticate with the civil registry. The Civil Registry Plugin does not initiate or participate in the OAuth 2 dance. This solves the problem of having authentication concerns in the plugin, and therefore, requiring DHIS2 end-users to be in possession of credentials for the civil registry.

oAuth 2 parameters, like `client ID` and `secret` are configured in the `application.yaml` file which can be found in `oauth-route-middleware/src/main/resources/application.yaml` on [line 79-82](https://github.com/dhis2/reference-civil-registry-lookup/blob/main/oauth-route-middleware/src/main/resources/application.yaml#L79-L82). 

## Running the example

To run this self-contained example setup (in non-production environments), you can use the included `docker-compose` configuration.

Running the following command will spin up all components listed above, install the civil registry lookup plugin in DHIS2, configure DHIS2 metadata with a simple Tracker program, and set up the necessary clients in KeyCloak for both DHIS2 authentication and civil registry resource protection (through a DHIS2 route).

## Configuring for Production

When configuring for production, it is important to understand which components to incorporate directly into your production system and which to replace with existing components from your infrastructure.

The following components can be added to your production architecture 


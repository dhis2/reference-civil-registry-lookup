# Route Manager App

This app supports managing routes using [DHIS2 Routes API](https://docs.dhis2.org/en/develop/using-the-api/dhis-core-version-master/route.html).

It currently supports:

1. Creating new routes (for all `GET`, `POST`, `DELETE`, `PUT`, `PATCH` and `JSON-PATCH`).
1. Editing and deleting existing routes
1. Testing routes by invoking the upstream endpoint and displaying the result.

Please note that, in order, to be able to perform these operations, the logged-in user's role should have the `Route` authority enabled (under User App -> Roles (select the role) -> Metadata authorities (search for `Route`))

It does not _yet_ support:

1. Configuring authentication parameters
1. Setting authorities required to run the route
1. Configuring the route metadata sharing
1. The app is still not published on AppHub

These should come as improvements in the near future.


This project was bootstrapped with [DHIS2 Application Platform](https://github.com/dhis2/app-platform).


# Deploying the app

The app is not yet deployed on App Hub. In order to install it, you can run `yarn && yarn build` and install the resulting zip file (in `build/bundle` folder) using the `App Management` app in DHIS2. 
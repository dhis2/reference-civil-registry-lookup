import { DataQuery, useDataMutation, useDataQuery } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import { Input, Button } from "@dhis2/ui";
import React, { useState } from "react";
import classes from "./App.module.css";

// 1. create the route
// 2. save the route id to data store
// (assume namespace configured by plugin)

const NAMESPACE = "civil-registry-plugin";

const createConfig = {
  resource: `dataStore/${NAMESPACE}`,
  type: "update",
  id: ({ key = "config" }) => `${key}`,
  data: ({ data }) => data,
};

const createRouteMutation = {
  resource: "routes",
  type: "create",
  data: ({ url }) => ({
    name: "postman-get-6" + Date.now(),
    // code: "postman-get-2",
    disabled: false,
    url,
  }),
};

const getRouteQuery = {
  routes: {
    resource: "routes",
    id: (params) => {
      console.log(">>>>", params);
      return `${params.id}/run`;
    },
  },
};
const MyApp = () => {
  const [urlValue, setValue] = useState("");
  const [createRoute] = useDataMutation(createRouteMutation);
  const [createConfigInDataStore] = useDataMutation(createConfig);

  const { data: routeData, refetch } = useDataQuery(getRouteQuery, {
    lazy: true,
  });

  const handeCreateRoute = async () => {
    const { response: result } = await createRoute({ url: urlValue });
    console.log(result);
    // await refetch({ id: result?.uid });

    const { response: dataStoreResult } = await createConfigInDataStore({
      namespace: "civil-registry-plugin",
      key: "config",
      data: {
        routeId: result?.uid,
      },
    });

    console.log(dataStoreResult);
  };
  return (
    <div className={classes.container}>
      <Input
        onChange={({ value }) => setValue(value)}
        placeholder="URL of civil registry endpoint"
      ></Input>
      <Button onClick={handeCreateRoute}>Save</Button>
      {routeData && JSON.stringify(routeData, null, 2)}
    </div>
  );
};

export default MyApp;

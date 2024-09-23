import i18n from "@dhis2/d2-i18n";
import { useDataMutation, useDataQuery } from "@dhis2/app-runtime";
import {
  Button,
  DataTable,
  DataTableRow,
  DataTableCell,
  DataTableHead,
  DataTableColumnHeader,
} from "@dhis2/ui";
import React, { useState } from "react";
import classes from "./App.module.css";
import UpsertRoute from "./UpsertRoute";
import TestRoute from "./TestRoute";
import { ApiRouteData, WrapQueryResponse } from "./types/RouteInfo";

import "./locales";

const deleteRouteMutation = {
  resource: "routes",
  type: "delete" as const,
  id: ({ id }) => id,
};

const listRoutesQuery = {
  routes: {
    resource: "routes",
    params: {
      fields: "*",
      pageSize: 50,
    },
  },
};

const MyApp = () => {
  const [deleteRoute] = useDataMutation(deleteRouteMutation);

  const { data: allRoutesList, refetch: refetchRoutesList } =
    useDataQuery<WrapQueryResponse<ApiRouteData[], "routes">>(listRoutesQuery);

  const handleDeleteRoute = async (routeCode) => {
    await deleteRoute({ id: routeCode });
    refetchRoutesList();
  };

  const [isCreateModalVisible, showCreateModal] = useState(false);
  const [isTestRouteModalVisible, showTestRouteModal] = useState(false);

  const [activeRoute, setActiveRoute] = useState<ApiRouteData>(undefined);

  const handleShowCreateModal = () => {
    showCreateModal(true);
  };

  const handleShowTestModal = (route) => {
    setActiveRoute(route);
    showTestRouteModal(true);
  };

  const handleEditRoute = (route) => {
    setActiveRoute(route);
    showCreateModal(true);
  };

  const onSave = () => {
    refetchRoutesList();
    showCreateModal(false);
  };

  const onCloseCreateRouteModal = () => {
    showCreateModal(false);
    setActiveRoute(undefined);
  };

  const onCloseTestModal = () => {
    showTestRouteModal(false);
    setActiveRoute(undefined);
  };

  return (
    <div className={classes.container}>
      {isCreateModalVisible && (
        <UpsertRoute
          route={activeRoute}
          closeModal={onCloseCreateRouteModal}
          onSave={onSave}
        />
      )}

      {isTestRouteModalVisible && (
        <TestRoute route={activeRoute} closeModal={onCloseTestModal} />
      )}

      <div className={classes.actionsStrip}>
        <Button onClick={handleShowCreateModal}>
          {i18n.t("Create New Route")}
        </Button>
      </div>
      <DataTable>
        <DataTableHead>
          <DataTableColumnHeader>{i18n.t("ID")}</DataTableColumnHeader>
          <DataTableColumnHeader>{i18n.t("Code")}</DataTableColumnHeader>
          <DataTableColumnHeader>{i18n.t("Name")}</DataTableColumnHeader>
          <DataTableColumnHeader>{i18n.t("URL")}</DataTableColumnHeader>
          <DataTableColumnHeader></DataTableColumnHeader>
        </DataTableHead>
        {allRoutesList?.routes?.routes?.map((route) => {
          return (
            <DataTableRow key={route.id}>
              <DataTableCell>{route.id}</DataTableCell>
              <DataTableCell>{route.code}</DataTableCell>
              <DataTableCell>{route.name}</DataTableCell>
              <DataTableCell>{route.url}</DataTableCell>
              <DataTableCell align="right">
                <Button small onClick={() => handleShowTestModal(route)}>
                  {i18n.t("Test")}
                </Button>{" "}
                <Button small onClick={() => handleEditRoute(route)}>
                  {i18n.t("Edit Route")}
                </Button>{" "}
                <Button
                  destructive
                  small
                  onClick={() => handleDeleteRoute(route.id)}
                >
                  {i18n.t("Delete")}
                </Button>
              </DataTableCell>
            </DataTableRow>
          );
        })}
      </DataTable>
    </div>
  );
};

export default MyApp;

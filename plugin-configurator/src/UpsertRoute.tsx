import {
  Modal,
  ModalContent,
  ModalTitle,
  ModalActions,
  ButtonStrip,
  Button,
  InputField,
} from "@dhis2/ui";
import React, { useState } from "react";
import { useAlert, useDataMutation } from "@dhis2/app-runtime";
import classes from "./App.module.css";
import { ApiRouteData } from "./types/RouteInfo";

const createRouteMutation = {
  resource: "routes",
  type: "create",
  data: ({ data }) => ({
    code: data.code,
    name: data.name,
    disabled: false,
    url: data.url,
  }),
};

const updateRouteMutation = {
  resource: "routes",
  type: "update",
  id: ({ id }) => id,
  data: ({ data }) => ({
    name: data.name,
    code: data.code,
    disabled: false,
    url: data.url,
  }),
};

type UpsertRouteProps = {
  route: ApiRouteData
  closeModal: VoidFunction
  onSave: VoidFunction
}

const UpsertRoute: React.FC<UpsertRouteProps> = ({
  route = {},
  closeModal = () => {},
  onSave = () => {},
}) => {
  const [code, setCode] = useState(route.code ?? "");
  const [name, setName] = useState(route.name ?? "");
  const [urlValue, setValue] = useState(
    route.url ?? "https://postman-echo.com/get"
  );

  const { show } = useAlert(
    ({ type, error }) => {
      if (type === "success") return "Route saved successfully";
      if (type === "error") return `Failed to save route: ${error}`;
    },
    ({ type }) => {
      if (type === "success") return { success: true };
      if (type === "error") return { critical: true };
    }
  );

  const options = {
    onComplete: () => show({ type: "success" }),
    onError: (error) => show({ type: "error", error: error.message }),
  };
  const [createRoute] = useDataMutation(createRouteMutation, options);
  const [updateRoute] = useDataMutation(updateRouteMutation, options);

  const handeCreateRoute = async () => {
    try {
      if (route?.id) {
        await updateRoute({
          id: route.id,
          data: { url: urlValue, code, name },
        });

        onSave();
      } else {
        await createRoute(
          {
            data: { url: urlValue, code, name },
          }
        );

        onSave();
      }
    } catch (err) {
      show({ type: "error", message: err.message });
    }
  };

  return (
    <Modal>
      <ModalTitle>Route details</ModalTitle>
      <ModalActions>
        <ButtonStrip end>
          <Button secondary onClick={closeModal}>
            Close
          </Button>
          <Button primary onClick={handeCreateRoute}>
            Save Route
          </Button>
        </ButtonStrip>
      </ModalActions>
      <ModalContent>
        <div className={classes.formContainer}>
          <InputField
            value={code}
            onChange={({ value }) => setCode(value)}
            placeholder="A unique code for the route"
            label="Route code"
          />
          <InputField
            value={name}
            onChange={({ value }) => setName(value)}
            placeholder="A unique name for the route"
            label="Route Name"
          />

          <InputField
            value={urlValue}
            onChange={({ value }) => setValue(value)}
            placeholder="URL of endpoint to route to"
            label="URL for route destination"
          />
        </div>
      </ModalContent>
    </Modal>
  );
};

export default UpsertRoute;

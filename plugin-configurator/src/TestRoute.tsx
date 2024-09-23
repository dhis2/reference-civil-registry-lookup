import {
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  ButtonStrip,
  Button,
  InputField,
  TextAreaField,
} from "@dhis2/ui";
import React, { useState } from "react";
import { useAlert, useDataQuery } from "@dhis2/app-runtime";
import classes from "./App.module.css";
import { ApiRouteData } from "./types/RouteInfo";

const invokeRouteQuery = {
  routes: {
    resource: "routes",
    id: ({ id, code, wildcard }) => {
      return `${id}/run${wildcard ? `/${wildcard}` : ""}`;
    },
  },
};

type TestRouteProps = {
  route: ApiRouteData;
  closeModal: VoidFunction;
};

const TestRoute: React.FC<TestRouteProps> = ({
  route = {},
  closeModal = () => {}
}) => {
  const [body, setBody] = useState<string>();
  const [wildcard, setWildcard] = useState<string>();

  const [result, setResult] = useState<unknown>("");

  const { show } = useAlert(
    ({ type, error }) => {
      if (type === "success") return "Route invoked successfully";
      if (type === "error") return `Failed to invoke route: ${error}`;
    },
    ({ type }) => {
      if (type === "success") return { success: true };
      if (type === "error") return { critical: true };
    }
  );

  const { data: routeData, refetch: invokeRoute } = useDataQuery<unknown>(
    invokeRouteQuery,
    {
      lazy: true,
      onComplete: () => show({ type: "success" }),
      onError: (error) => show({ type: "error", error: error.message }),
    }
  );
  const handleTestRoute = async () => {
    const result = await invokeRoute({
      ...route,
      wildcard,
    });
    setResult(result);
  };

  const hasWildCardPath = route.url?.endsWith("*");

  return (
    <Modal>
      <ModalActions>
        <ButtonStrip end>
          <Button secondary onClick={closeModal}>
            Close
          </Button>
          <Button primary onClick={handleTestRoute}>
            Test Route
          </Button>{" "}
        </ButtonStrip>
      </ModalActions>
      <ModalTitle>Test Route</ModalTitle>
      <ModalContent>
        <div className={classes.formContainer}>
          <InputField disabled value={route?.code} label="Route code" />
          <InputField disabled value={route?.name} label="Route Name" />
          <InputField disabled value={route?.url} label="Route URL" />

          {hasWildCardPath && (
            <InputField
              value={wildcard}
              onChange={({ value }) => setWildcard(value)}
              label="Wildcard path"
            />
          )}

          <TextAreaField
            value={body}
            onChange={({ value }) => setBody(value)}
            placeholder="Body to pass to route"
            label="Body of request"
          />

          {result && JSON.stringify(result, null, 2)}
        </div>
      </ModalContent>
    </Modal>
  );
};

export default TestRoute;

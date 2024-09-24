import { useAlert, useDataEngine } from "@dhis2/app-runtime";
import i18n from "@dhis2/d2-i18n";
import {
  Modal,
  ModalTitle,
  ModalContent,
  ModalActions,
  ButtonStrip,
  Button,
  InputField,
  SingleSelectField,
  TextAreaField,
  SingleSelectOption,
} from "@dhis2/ui";
import React, { useState } from "react";
import classes from "./App.module.css";
import { ApiRouteData } from "./types/RouteInfo";

type TestRouteProps = {
  route: ApiRouteData;
  closeModal: VoidFunction;
};

type Verb = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "JSON-PATCH";

type MutationType = "create" | "delete" | "update" | "replace" | "json-patch";

const typesMap: Record<string, MutationType> = {
  POST: "create",
  DELETE: "delete",
  PUT: "update",
  PATCH: "replace",
  "JSON-PATCH": "json-patch",
};

const TestRoute: React.FC<TestRouteProps> = ({
  route = {},
  closeModal = () => {},
}) => {
  const [verb, setVerb] = useState<Verb>("GET");
  const [body, setBody] = useState<string>();
  const [wildcard, setWildcard] = useState<string>();
  const [result, setResult] = useState<unknown>("");

  const engine = useDataEngine();

  const { show } = useAlert(
    ({ error }) => {
      if (error) {
        return i18n.t("Failed to invoke route: {{error}}", {
          error,
          nsSeparator: "-:-",
        });
      }
      return i18n.t("Route invoked successfully");
    },
    ({ error }) => {
      if (error) {
        return { critical: true };
      }
      return { success: true };
    }
  );

  const handleTestRoute = async () => {
    try {
      setResult(undefined);

      const resource = `routes/${route.id ?? route.code}/run${
        wildcard ? `/${wildcard}` : ""
      }`;

      if (verb === "GET") {
        const result = await engine.query({
          routes: { resource },
        });

        return setResult(result);
      }

      // other verbs: POST, PUT, PATCH, JSON-PATCH, DELETE
      const mutationOptions = {
        resource,
        type: typesMap[verb],
        data: body && JSON.parse(body),
      };

      if (verb === "DELETE") {
        // a wrokaround for DELETE since it crashes with data: undefined
        delete mutationOptions.data;
      }

      // @ts-expect-error("the error is because different mutations expect ID or not, but in practice, they can be used generically with id=null")
      const result = await engine.mutate(mutationOptions);

      setResult(result);
    } catch (error) {
      console.error(error);
      show({ error });
    }
  };

  const hasWildCardPath = route.url?.endsWith("**");

  return (
    <Modal>
      <ModalActions>
        <ButtonStrip end>
          <Button secondary onClick={closeModal}>
            {i18n.t("Close")}
          </Button>
          <Button primary onClick={handleTestRoute}>
            {i18n.t("Test Route")}
          </Button>{" "}
        </ButtonStrip>
      </ModalActions>
      <ModalTitle>{i18n.t("Test Route")}</ModalTitle>
      <ModalContent>
        <div className={classes.formContainer}>
          <SingleSelectField
            filterable={false}
            selected={verb}
            onChange={({ selected }) => {
              setVerb(selected as Verb);
            }}
          >
            <SingleSelectOption label="GET" value="GET"></SingleSelectOption>
            <SingleSelectOption label="POST" value="POST"></SingleSelectOption>
            <SingleSelectOption label="PUT" value="PUT"></SingleSelectOption>
            <SingleSelectOption
              label="DELETE"
              value="DELETE"
            ></SingleSelectOption>
            {/* // Todo: disabling PATCH for now - it doesn't seem to work correctly with DataEngine */}
            {/* <SingleSelectOption
              label="PATCH"
              value="PATCH"
            ></SingleSelectOption> */}
            <SingleSelectOption
              label="JSON-PATCH"
              value="JSON-PATCH"
            ></SingleSelectOption>
          </SingleSelectField>
          <InputField
            disabled
            value={route?.code}
            label={i18n.t("Route code")}
          />
          <InputField
            disabled
            value={route?.name}
            label={i18n.t("Route Name")}
          />
          <InputField disabled value={route?.url} label={i18n.t("Route URL")} />

          {hasWildCardPath && (
            <InputField
              value={wildcard}
              onChange={({ value }) => setWildcard(value)}
              label={i18n.t("Wildcard path")}
            />
          )}

          <TextAreaField
            helpText={i18n.t(
              "Use valid JSON for this field (i.e. double quoted properties etc..)"
            )}
            disabled={verb === "GET"}
            value={body}
            onChange={({ value }) => setBody(value)}
            placeholder={i18n.t("Body to pass to route")}
            label={i18n.t("Body of request")}
          />

          <pre>{result && JSON.stringify(result, null, 2)}</pre>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default TestRoute;

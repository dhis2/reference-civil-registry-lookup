import {Button} from "@dhis2/ui";
import i18n from "@dhis2/d2-i18n";
import React from "react";
import {IDataEntryPluginProps} from "../../Plugin.types";

export const PluginDetails = ({
    fieldsMetadata,
    setFieldValue,
    values,
    errors,
    warnings,
    formSubmitted,
    setContextFieldValue,
}: IDataEntryPluginProps) => (
    <div className={'px-5 text-[14px] py-4'}>
        <h3>{i18n.t('Hello from a plugin')} 👋</h3>

        <p>{i18n.t('Fields metadata')}:</p>
        <pre>{JSON.stringify(fieldsMetadata, null, 2)}</pre>

        <p>{i18n.t('Values')}:</p>
        <pre>{JSON.stringify(values, null, 2)}</pre>

        <p>{i18n.t('Errors')}:</p>
        <pre>{JSON.stringify(errors, null, 2)}</pre>

        <p>{i18n.t('Warnings')}:</p>
        <pre>{JSON.stringify(warnings, null, 2)}</pre>

        <p>{i18n.t('Save attempted')}:</p>
        <pre>{JSON.stringify(formSubmitted, null, 2)}</pre>

        <br/>

        <Button
            className={'mt-4 mr-2'}
            onClick={() => {
                setFieldValue({
                    fieldId: 'firstName',
                    value: 'NVP only',
                    options: {
                        error: 'This is an error',
                    }
                })
            }}
        >
            {i18n.t('Set value with error')}
        </Button>

        <Button
            className={'mt-4'}
            onClick={() => {
                setContextFieldValue({
                    fieldId: 'geometry',
                    value: {
                        latitude: 60.0001,
                        longitude: 60.0001,
                    },
                })
            }}
        >
            {i18n.t('Set coordinates')}
        </Button>
    </div>
)

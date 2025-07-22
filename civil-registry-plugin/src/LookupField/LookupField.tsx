import i18n from '@dhis2/d2-i18n'
import debounce from 'lodash/debounce'
import { Button, Help, Input, Label } from '@dhis2/ui'
import React, { useState, useCallback } from 'react'
import { useCivilRegistryQuery } from '../lib/useCivilRegistryQuery'
import { usePersonMapQuery } from '../lib/usePersonMapQuery'
import { FieldsMetadata, SetFieldValue } from '../Plugin.types'
import classes from './LookupField.module.css'
import jsonata from 'jsonata'

// ! NB: This is a little custom, and not so generic
let idWarningIssued = false
const idWarning =
    "No field with a plugin alias `id` has been found; the value in this field won't automatically update the form value. Values returned from the civil registry still may, depending on the configured plugin aliases."

const personNotFoundMessage = i18n.t(
    "This person wasn't found in the civil registry. Check the ID and search again, or enter their details manually."
)
const registryErrMessage = i18n.t(
    "Failed to query civil registry. Please enter the person's details manually."
)

type Props = {
    setFieldValue: SetFieldValue
    fieldsMetadata: FieldsMetadata
    values: Record<string, any>
}

export const LookupField = ({
    setFieldValue,
    fieldsMetadata,
    values,
}: Props) => {
    const {
        // loading: personMapLoading,
        // error: personMapError,
        data: personMap,
    } = usePersonMapQuery()

    const [query, { loading, error }] = useCivilRegistryQuery()
    const [patientId, setPatientId] = useState(values['id'] || '')

    const updateFormValue = useCallback(
        debounce((value) => {
            if ('id' in fieldsMetadata) {
                setFieldValue({ fieldId: 'id', value })
            } else if (!idWarningIssued) {
                console.warn(idWarning)
                idWarningIssued = true
            }
        }, 800),
        []
    )

    const handleChange = useCallback(({ value }) => {
        setPatientId(value)
        updateFormValue(value)
    }, [])

    const handleBlur = useCallback(() => {
        updateFormValue.flush()
    }, [updateFormValue])

    const handleSearch = useCallback(async () => {
        try {
            // todo: handle missing personMap
            const fhirPerson = await query({ id: patientId })

            const lookupPerson = await jsonata(
                personMap?.escapedScript as string
            ).evaluate(fhirPerson)

            // Take data returned from Route and set enrollment field values.
            // Expects a flat object, and for keys and values to match the
            // plugin's configured fields
            Object.entries(lookupPerson).forEach(([key, value]) => {
                // Avoids setting values outside of plugin's configured fields
                if (Object.hasOwn(fieldsMetadata, key)) {
                    setFieldValue({ fieldId: key, value: value })
                } else {
                    console.warn(
                        `Field ID "${key}" not found in configured fields; skipping value ${value}`
                    )
                }
            })
        } catch (error) {
            console.error(error.details || error)
        }
    }, [patientId, personMap])

    const validationStatus = React.useMemo(() => {
        if (!error) {
            return {}
        }

        if (
            error.details?.httpStatusCode === 404 &&
            !error.details?.errorCode
        ) {
            // This is the case if a person is not found in the registry
            return { message: personNotFoundMessage, warning: false }
        }

        // All other errors
        // (useCivilRegistryQuery logs error to the console)
        return { message: registryErrMessage, warning: true }
    }, [error])

    return (
        <div className={classes.fieldContainer}>
            <div className={classes.labelContainer}>
                <Label htmlFor={'patientId'} className={classes.label}>
                    {fieldsMetadata['id']?.formName || i18n.t('Patient ID')}
                </Label>
            </div>

            <div className={classes.input}>
                <div className={classes.inputContainer}>
                    <Input
                        name="patientId"
                        className={classes.input}
                        warning={validationStatus.warning}
                        value={patientId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />

                    <Button onClick={handleSearch} loading={loading}>
                        {i18n.t('Search')}
                    </Button>
                </div>
                {error && (
                    <Help warning={validationStatus.warning}>
                        {validationStatus.message}
                    </Help>
                )}
            </div>
        </div>
    )
}

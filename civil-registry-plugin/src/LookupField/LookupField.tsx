import i18n from '@dhis2/d2-i18n'
import { Button, Help, Input, Label, Tooltip } from '@dhis2/ui'
import jsonata from 'jsonata'
import debounce from 'lodash/debounce'
import React, { useState, useCallback, useMemo } from 'react'
import { useCivilRegistryQuery } from '../lib/useCivilRegistryQuery'
import { usePersonMapQuery } from '../lib/usePersonMapQuery'
import { FieldsMetadata, SetFieldValue } from '../Plugin.types'
import classes from './LookupField.module.css'

// ! NB: This is a little custom, and not so generic
let idWarningIssued = false
const idWarning =
    "No field with a plugin alias `id` has been found; the value in this field won't automatically update the form value. Values returned from the civil registry still may, depending on the configured plugin aliases."

const mappingNotFoundMessage = i18n.t(
    'Civil registry mapping has not been set up; contact a system administrator. Patient details can still be entered manually.'
)
const personMapErrMessage = i18n.t(
    'Unable to obtain civil registry mapping. Patient details can still be entered manually.'
)

const mappingErrMessage = i18n.t(
    'Data mapping from civil registry failed. Patient details can still be entered manually.'
)

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
        loading: personMapLoading,
        error: personMapError,
        data: personMapData,
    } = usePersonMapQuery()
    const [query, { loading: registryLoading, error: registryError }] =
        useCivilRegistryQuery()
    const [patientId, setPatientId] = useState(values['id'] || '')
    const [mappingError, setMappingError] = useState(false)

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

    const handleChange = useCallback(
        ({ value }: { value: string }) => {
            setPatientId(value)
            updateFormValue(value)
        },
        [updateFormValue]
    )

    const handleBlur = useCallback(() => {
        updateFormValue.flush()
    }, [updateFormValue])

    const jsonataExpression = useMemo(() => {
        if (personMapData) {
            try {
                const expression = jsonata(
                    personMapData.escapedExpression as string
                )
                return expression
            } catch (err) {
                console.error('Failed to parse mapping expression')
                console.error(err)
                setMappingError(true)
            }
        }
    }, [personMapData])

    const handleSearch = useCallback(async () => {
        const fhirPerson = await query({ id: patientId })
        try {
            const lookupPerson = await jsonataExpression.evaluate(fhirPerson)

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
            console.error('Failed to map registry data')
            console.error(error.details || error)
            setMappingError(true)
        }
    }, [patientId, jsonataExpression, fieldsMetadata])

    const mappingNotSetUp = useMemo(
        () =>
            personMapError?.details.httpStatusCode === 404 ||
            (!personMapLoading &&
                !personMapError && // (rule out other errors)
                personMapData?.escapedExpression === undefined),
        [personMapError, personMapLoading, personMapData]
    )

    const validationStatus = useMemo(() => {
        if (
            !registryError &&
            !personMapError &&
            !mappingNotSetUp &&
            !mappingError
        ) {
            return null
        }

        if (mappingNotSetUp) {
            return { message: mappingNotFoundMessage, warning: true }
        }
        // other Person Map request errors
        if (personMapError) {
            return { message: personMapErrMessage, warning: true }
        }

        // Error trying to map data with Jsonata
        if (mappingError) {
            return { message: mappingErrMessage, warning: true }
        }

        // This is the case if a person is not found in the registry;
        // it depends on the middleware setup
        if (
            registryError?.details?.httpStatusCode === 404 &&
            !registryError.details?.errorCode
        ) {
            return { message: personNotFoundMessage, warning: false }
        }

        // Other registry errors
        if (registryError) {
            return { message: registryErrMessage, warning: true }
        }

        return null
    }, [registryError, mappingNotSetUp, personMapError, mappingError])

    const SearchButton = () => (
        <Button
            onClick={handleSearch}
            loading={registryLoading || personMapLoading}
            disabled={
                patientId.length === 0 ||
                mappingNotSetUp ||
                Boolean(personMapError) ||
                mappingError
            }
        >
            {i18n.t('Search')}
        </Button>
    )

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
                        warning={validationStatus?.warning}
                        value={patientId}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />

                    {patientId.length === 0 ? (
                        <Tooltip content={i18n.t('Enter an ID to search')}>
                            <SearchButton />
                        </Tooltip>
                    ) : (
                        <SearchButton />
                    )}
                </div>
                {validationStatus && (
                    <Help warning={validationStatus.warning}>
                        {validationStatus.message}
                    </Help>
                )}
            </div>
        </div>
    )
}

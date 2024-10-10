import i18n from '@dhis2/d2-i18n'
import { Button, Input, Label } from '@dhis2/ui'
import React, { useState, useCallback } from 'react'
import { useCivilRegistryQuery } from '../lib/useCivilRegistryQuery'
import { FieldsMetadata, SetFieldValue } from '../Plugin.types'
import classes from './LookupField.module.css'

// ! NB: This is a little custom, and not so generic
let idWarningIssued = false
const idWarning =
    "No field with a plugin alias `id` has been found; the value in this field won't automatically update the form value. Values returned from the civil registry still may, depending on the configured plugin aliases."

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
    const [query, { loading }] = useCivilRegistryQuery({
        setFieldValue,
        fieldsMetadata,
    })
    const [patientId, setPatientId] = useState(values['id'] || '')

    const handleChange = useCallback(({ value }) => {
        setPatientId(value)
        if ('id' in fieldsMetadata) {
            setFieldValue({ fieldId: 'id', value })
        } else if (!idWarningIssued) {
            console.warn(idWarning)
            idWarningIssued = true
        }
    }, [])

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
                        value={patientId}
                        onChange={handleChange}
                        className={classes.input}
                    />

                    <Button
                        onClick={() => {
                            query({ id: patientId })
                        }}
                        loading={loading}
                    >
                        {i18n.t('Search')}
                    </Button>
                </div>
            </div>
        </div>
    )
}

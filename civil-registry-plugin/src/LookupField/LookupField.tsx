import i18n from '@dhis2/d2-i18n'
import { Button, Input, Label } from '@dhis2/ui'
import React from 'react'
import { useCivilRegistryQuery } from '../lib/useCivilRegistryQuery'
import { FieldsMetadata, SetFieldValue } from '../Plugin.types'
import classes from './LookupField.module.css'

type Props = { setFieldValue: SetFieldValue; fieldsMetadata: FieldsMetadata }

export const LookupField = ({ setFieldValue, fieldsMetadata }: Props) => {
    const [query, { loading }] = useCivilRegistryQuery({
        setFieldValue,
        fieldsMetadata,
    })
    const [patientId, setPatientId] = React.useState('')

    return (
        <div className={classes.fieldContainer}>
            <div className={classes.labelContainer}>
                <Label htmlFor={'patientId'} className={classes.label}>
                    {i18n.t('Patient ID')}
                </Label>
            </div>

            <div className={classes.inputContainer}>
                <Input
                    name="patientId"
                    value={patientId}
                    onChange={({ value }) => setPatientId(value)}
                    className={classes.input}
                />

                <Button
                    primary
                    onClick={() => query({ id: patientId })}
                    loading={loading}
                >
                    {i18n.t('Search')}
                </Button>
            </div>
        </div>
    )
}

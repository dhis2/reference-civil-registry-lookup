import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { Button, Input, Label } from '@dhis2/ui'
import { SetFieldValueProps } from '../Plugin.types'
import { useRoutedMutation } from '../lib/useRoutedMutation'
import classes from './LookupField.module.css'

type Props = {
    setFieldValue: (values: SetFieldValueProps) => void
}

export const LookupField = ({ setFieldValue }: Props) => {
    const [mutate, { loading }] = useRoutedMutation(setFieldValue)
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
                    onClick={() => {
                        mutate({ id: patientId })
                    }}
                    loading={loading}
                >
                    {i18n.t('Search')}
                </Button>
            </div>
        </div>
    )
}

import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { Button, Input, Label } from '@dhis2/ui'
import { SetFieldValueProps } from '../../Plugin.types'
import { useRoutedMutation } from '../../lib/useRoutedMutation'
import classes from './ExternalSourceForm.module.css'

type Props = {
    setFieldValue: (values: SetFieldValueProps) => void
}

export const ExternalSourceForm = ({ setFieldValue }: Props) => {
    const [mutate, { loading }] = useRoutedMutation(setFieldValue)
    const [patientId, setPatientId] = React.useState('')

    return (
        <div className={classes.formContainer}>
            <div className={classes.labelContainer}>
                <Label
                    required
                    htmlFor={'patientId'}
                    className={classes.label}
                >
                    {i18n.t('Patient ID')}
                </Label>
            </div>

            <div className={classes.inputContainer}>
                <Input
                    name="patientId"
                    value={patientId}
                    onChange={({ value }) => setPatientId(value)}
                    className="grow"
                />

                <Button
                    primary
                    onClick={() => {
                        mutate({ registryId: patientId })
                    }}
                    loading={loading}
                >
                    {i18n.t('Search')}
                </Button>
            </div>
        </div>
    )
}

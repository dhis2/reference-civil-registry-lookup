import React from 'react'
import i18n from '@dhis2/d2-i18n'
import { Button } from '@dhis2/ui'
import { Field, Form, Formik } from 'formik'
import { SetFieldValueProps } from '../../Plugin.types'
import { useRoutedMutation } from '../../lib/useRoutedMutation'

type Props = {
    setFieldValue: (values: SetFieldValueProps) => void
}

// todo: DHIS2 components
export const ExternalSourceForm = ({ setFieldValue }: Props) => {
    const [mutate, { loading }] = useRoutedMutation(setFieldValue)

    return (
        <>
            <Formik
                initialValues={{ patientId: '' }}
                onSubmit={({ patientId }) => {
                    mutate({ registryId: patientId })
                }}
            >
                <Form className={'flex px-3 mt-4 items-center'}>
                    <label
                        htmlFor={'patientId'}
                        className={
                            'basis-[200px] grow-0 shrink-0 pr-4 pl-1 text-[14px]'
                        }
                    >
                        {i18n.t('Patient ID')}
                    </label>

                    <div
                        className={'flex basis-[150px] grow gap-1 items-center'}
                    >
                        <Field
                            name={'patientId'}
                            className={
                                'border text-[14px] border-[#a0adba] py-2 px-2.5 rounded grow'
                            }
                            placeholder={i18n.t('Enter patient ID')}
                        />

                        <Button primary type={'submit'} loading={loading}>
                            {i18n.t('Search')}
                        </Button>
                    </div>
                </Form>
            </Formik>
        </>
    )
}

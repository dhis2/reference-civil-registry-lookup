import './tailwind.css'
import './index.css'
import React, { useState } from 'react'
import { Button } from '@dhis2/ui'
import { IDataEntryPluginProps } from './Plugin.types'
import { ExternalSourceForm } from './Components/ExternalSourceForm'
import { PluginDetails } from './Components/PluginDetails'

const PluginInner = (propsFromParent: IDataEntryPluginProps) => {
    const [showExternalSourceForm, setShowExternalSourceForm] = useState(true)
    const {
        fieldsMetadata,
        setFieldValue,
        values,
        errors,
        warnings,
        formSubmitted,
        setContextFieldValue,
    } = propsFromParent

    return (
        <div className={'bg-white w-lvw flex'}>
            <div className={'w-full'}>
                <div className={'flex justify-end'}>
                    <Button
                        small
                        onClick={() =>
                            setShowExternalSourceForm((prev) => !prev)
                        }
                        className={'mt-3 mr-3'}
                    >
                        {showExternalSourceForm
                            ? 'Show plugin details'
                            : 'Back to form'}
                    </Button>
                </div>

                {showExternalSourceForm ? (
                    <ExternalSourceForm setFieldValue={setFieldValue} />
                ) : (
                    <PluginDetails
                        fieldsMetadata={fieldsMetadata}
                        setFieldValue={setFieldValue}
                        values={values}
                        errors={errors}
                        warnings={warnings}
                        formSubmitted={formSubmitted}
                        setContextFieldValue={setContextFieldValue}
                    />
                )}
            </div>
        </div>
    )
}

export default PluginInner

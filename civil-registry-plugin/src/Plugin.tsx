import React from 'react'
import { LookupField } from './LookupField'
import { IDataEntryPluginProps } from './Plugin.types'
import './locales'

const PluginInner = (propsFromParent: IDataEntryPluginProps) => {
    const {
        values,
        // errors,
        // warnings,
        // formSubmitted,
        // setContextFieldValue,
        fieldsMetadata,
        setFieldValue,
    } = propsFromParent

    return <LookupField setFieldValue={setFieldValue} fieldsMetadata={fieldsMetadata} values={values} />
}

export default PluginInner

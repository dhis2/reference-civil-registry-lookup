import React from 'react'
import { IDataEntryPluginProps } from './Plugin.types'
import { LookupField } from './Components/LookupField'

const PluginInner = (propsFromParent: IDataEntryPluginProps) => {
    const {
        // fieldsMetadata,
        // values,
        // errors,
        // warnings,
        // formSubmitted,
        // setContextFieldValue,
        setFieldValue,
    } = propsFromParent

    return <LookupField setFieldValue={setFieldValue} />
}

export default PluginInner

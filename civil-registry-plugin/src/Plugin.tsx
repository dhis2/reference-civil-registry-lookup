import React from 'react'
import { LookupField } from './LookupField'
import { IDataEntryPluginProps } from './Plugin.types'
import './locales'

const PluginInner = (propsFromParent: IDataEntryPluginProps) => {
    const {
        // values,
        // errors,
        // warnings,
        // formSubmitted,
        // setContextFieldValue,
        // fieldsMetadata,
        setFieldValue,
    } = propsFromParent

    // todo: remove after testing
    console.log({ propsFromParent })

    return <LookupField setFieldValue={setFieldValue} />
}

export default PluginInner

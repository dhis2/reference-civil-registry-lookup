type FieldMetadata = {
    id: string
    name: string
    shortName: string
    formName: string
    disabled: boolean
    compulsory: boolean
    description: string
    type: string
    optionSet: any
    displayInForms: boolean
    displayInReports: boolean
    icon: any
    unique: any
    searchable: boolean | undefined
    url: string | undefined
}

export type FieldsMetadata = Record<string, FieldMetadata>

type FieldValueOptions = {
    valid?: boolean
    touched?: boolean
    error?: string
}

export type SetFieldValueProps = {
    fieldId: string
    value: any
    options?: FieldValueOptions
}

export type SetFieldValue = (values: SetFieldValueProps) => void

type SetContextFieldValueProps = {
    fieldId: 'geometry' | 'occurredAt' | 'enrolledAt'
    value: any
    options?: FieldValueOptions
}

export type IDataEntryPluginProps = {
    values: Record<string, any>
    errors: Record<string, string[]>
    warnings: Record<string, string[]>
    formSubmitted: boolean
    fieldsMetadata: FieldsMetadata
    setFieldValue: SetFieldValue
    setContextFieldValue: (values: SetContextFieldValueProps) => void
}

import { useDataMutation } from '@dhis2/app-runtime'
import { FieldsMetadata, SetFieldValue } from '../Plugin.types'

type Props = { setFieldValue: SetFieldValue; fieldsMetadata: FieldsMetadata }

const mutation = {
    resource: 'routes/civil-registry/run',
    type: 'create',
    data: ({ id }: { id: string }) => ({ id }),
}

export const useCivilRegistryQuery = ({
    setFieldValue,
    fieldsMetadata,
}: Props) => {
    return useDataMutation(mutation as any, {
        onComplete: (person) => {
            // Take data returned from Route and set enrollment field values.
            // Expects a flat object, and for keys and values to match the
            // plugin's configured fields
            Object.entries(person).forEach(([key, value]) => {
                // Avoids setting values outside of plugin's configured fields
                if (Object.hasOwn(fieldsMetadata, key)) {
                    setFieldValue({ fieldId: key, value: value })
                } else {
                    console.warn(
                        `Field ID "${key}" not found in configured fields; skipping value ${value}`
                    )
                }
            })
        },
        onError: (error) => {
            console.error(error.details || error)
        },
    })
}

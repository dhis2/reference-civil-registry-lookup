import { useAlert, useDataMutation } from '@dhis2/app-runtime'
import { FieldsMetadata, SetFieldValue } from '../Plugin.types'
import i18n from '../locales'

type Props = { setFieldValue: SetFieldValue; fieldsMetadata: FieldsMetadata }

// todo: remove after testing
const mockPerson = {
    id: 'abcde12345',
    firstName: 'History',
    lastName: 'Museum',
    sex: 'MALE',
    dateOfBirth: '1876-09-01',
    phone: '+998 71 239 17 79',
    address: [
        'Sharaf Rashidov Avenue 3',
        '100029',
        'Mirobod',
        'Tashkent',
        'Tashkent City',
        'Uzbekistan',
    ].join('\n'),
}

const mutation = {
    // todo: verify code
    resource: 'route/civil-registry/run',
    type: 'create',
    data: ({ id }: { id: string }) => ({ id }),
}

export const useCivilRegistryQuery = ({
    setFieldValue,
    fieldsMetadata,
}: Props) => {
    const { show } = useAlert(({ message }) => message, { critical: true })

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
                        `Field ID ${key} not found in configured fields; skipping value ${value}`
                    )
                }
            })
        },
        onError: (error) => {
            show({
                message: i18n.t('Failed to query civil registry: {{error}}', {
                    error: error.details.message || error.message,
                    nsSeparator: '`',
                }),
            })

            // todo: remove after testing
            // logic copied from above
            // ---
            // Take data returned from Route and set enrollment field values.
            // Expects a flat object
            Object.entries(mockPerson).forEach(([key, value]) => {
                // Avoids setting values outside of plugin's configured fields
                if (Object.hasOwn(fieldsMetadata, key)) {
                    setFieldValue({ fieldId: key, value: value })
                } else {
                    console.warn(
                        `Field ID "${key}" not found in configured fields; skipping value "${value}"`
                    )
                }
            })
        },
    })
}

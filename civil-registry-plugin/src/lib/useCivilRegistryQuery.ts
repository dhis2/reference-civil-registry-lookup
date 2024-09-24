import { useAlert, useDataMutation } from '@dhis2/app-runtime'
import { SetFieldValue } from '../Plugin.types'
import i18n from '../locales'

type Props = { setFieldValue: SetFieldValue }

// TODO: These types should be edited to match the response from your civil registry
type Address = {
    line: string
    city: string
    district: string
    state: string
    postalCode: string
    country: string
}
type Person = {
    id: string
    firstName: string
    lastName: string
    sex: 'male' | 'female'
    dateOfBirth: string
    address: Address
    phone: string
}

const mutation = {
    // todo: verify code
    resource: 'route/civil-registry/run',
    type: 'create',
    data: ({ id }: { id: string }) => ({ id }),
}

export const useCivilRegistryQuery = ({ setFieldValue }: Props) => {
    const { show } = useAlert(({ message }) => message, { critical: true })

    return useDataMutation(mutation as any, {
        onComplete: (person: Person) => {
            // TODO: `fieldId`s should match the configured 'plugin alias' keys,
            // and `value` should be the appropriate value from the civil
            // registry response.
            // For option sets, make sure values exactly match options

            // These values correspond to the WHO Tuberculosis metadata package
            const fieldValueMap = [
                { fieldId: 'nationalId', value: person.id },
                { fieldId: 'firstName', value: person.firstName },
                { fieldId: 'lastName', value: person.lastName },
                {
                    // todo: consider option sets
                    fieldId: 'sex',
                    value: person.sex === 'male' ? 'Male' : 'Female',
                },
                { fieldId: 'dateOfBirth', value: person.dateOfBirth },
                { fieldId: 'administrativeArea', value: person.address.state },
                {
                    fieldId: 'address',
                    value: [
                        person.address.line,
                        person.address.postalCode,
                        person.address.city,
                    ].join('\n'),
                },
            ]
            fieldValueMap.forEach((options) => setFieldValue(options))
        },
        onError: (error) => {
            show({
                message: i18n.t('Failed to query civil registry: {{error}}', {
                    error: error.details.message || error.message,
                    nsSeparator: '`',
                }),
            })

            // todo: remove after testing
            // mock person
            const person: Person = {
                id: 'abcde12345',
                firstName: 'History',
                lastName: 'Museum',
                sex: 'male',
                dateOfBirth: '1876-09-01',
                phone: '+998712391779',
                address: {
                    country: 'Uzbekistan',
                    state: 'Tashkent City',
                    city: 'Tashkent',
                    district: 'Mirobod',
                    postalCode: '0109',
                    line: 'Sharaf Rashidov Avenue 3',
                },
            }
            // These values correspond to the WHO Tuberculosis metadata package
            const fieldValueMap = [
                { fieldId: 'nationalId', value: person.id },
                { fieldId: 'firstName', value: person.firstName },
                { fieldId: 'lastName', value: person.lastName },
                {
                    // todo: consider option sets
                    fieldId: 'sex',
                    value: person.sex === 'male' ? 'Male' : 'Female',
                },
                { fieldId: 'dateOfBirth', value: person.dateOfBirth },
                { fieldId: 'administrativeArea', value: person.address.state },
                {
                    fieldId: 'address',
                    value: [
                        person.address.line,
                        person.address.postalCode,
                        person.address.city,
                    ].join('\n'),
                },
            ]
            fieldValueMap.forEach((options) => setFieldValue(options))
        },
    })
}

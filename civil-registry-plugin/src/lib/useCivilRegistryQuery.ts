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
            // Sierra Leone TB value map

            // TODO: `fieldId`s should match the configured 'plugin alias' keys,
            // and `value` should be the appropriate value from the civil
            // registry response.
            // For option sets, make sure values exactly match options
            const fieldValueMap = [
                { fieldId: 'firstName', value: person.firstName },
                { fieldId: 'lastName', value: person.lastName },
                {
                    // todo: consider option sets
                    fieldId: 'gender',
                    value: person.sex === 'male' ? 'Male' : 'Female',
                },
                // todo: this isn't perfect; doesn't populate 'age since DoB'
                { fieldId: 'age', value: { date: person.dateOfBirth } },
                // todo: is this right? 🤔 the form tip says country
                { fieldId: 'address', value: person.address.line },
                { fieldId: 'city', value: person.address.city },
                { fieldId: 'state', value: person.address.state },
                { fieldId: 'zip', value: person.address.postalCode },
                { fieldId: 'phone', value: person.phone },
                // todo:
                { fieldId: 'nationalId', value: person.id },
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
            // same mapping & populating logic copied from above
            const fieldValueMap = [
                { fieldId: 'firstName', value: person.firstName },
                { fieldId: 'lastName', value: person.lastName },
                {
                    // todo: consider option sets
                    fieldId: 'gender',
                    value: person.sex === 'male' ? 'Male' : 'Female',
                },
                // todo: this isn't perfect; doesn't populate 'age since DoB'
                { fieldId: 'age', value: { date: person.dateOfBirth } },
                // todo: is this right? 🤔 the form tip says country
                { fieldId: 'address', value: person.address.line },
                { fieldId: 'city', value: person.address.city },
                { fieldId: 'state', value: person.address.state },
                { fieldId: 'zip', value: person.address.postalCode },
                { fieldId: 'phone', value: person.phone },
                // todo:
                { fieldId: 'nationalId', value: person.id },
            ]
            fieldValueMap.forEach((options) => setFieldValue(options))
        },
    })
}

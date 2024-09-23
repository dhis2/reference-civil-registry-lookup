import { useAlert, useDataMutation } from '@dhis2/app-runtime'
import { SetFieldValueProps } from '../Plugin.types'

const mutation = {
    // todo: check on code
    resource: 'route/civilRegistry/run',
    type: 'create',
    data: ({ registryId }: { registryId: string }) => ({ registryId }),
}

export const useRoutedMutation = (
    setFieldValue: (values: SetFieldValueProps) => void
) => {
    const { show } = useAlert(({ message }) => message, { critical: true })

    return useDataMutation(mutation as any, {
        onComplete: (data) => {
            // todo: format?
            const person = data.person as any

            setFieldValue({
                fieldId: 'firstName',
                value: person.name.first,
            })
            setFieldValue({
                fieldId: 'lastName',
                value: person.name.last,
            })
            setFieldValue({
                fieldId: 'gender',
                // todo: how to map to an option set 🤔
                value: person.gender === 'male' ? 'Male' : 'Female',
            })
        },
        onError: (error) => {
            show({
                message:
                    'Failed to query civil registry: ' +
                    (error.details.message || error.message),
            })
            console.log({ error, e: Object.entries(error) })

            // todo: remove
            setFieldValue({
                fieldId: 'firstName',
                value: 'not found', // todo
            })
            setFieldValue({
                fieldId: 'lastName',
                value: 'not found',
            })
            setFieldValue({
                fieldId: 'gender',
                value: 'Male',
            })
        },
    })
}

import { useDataMutation } from '@dhis2/app-runtime'

const mutation = {
    resource: 'routes/civil-registry/run',
    type: 'create',
    data: ({ id }: { id: string }) => ({ id }),
}

export const useCivilRegistryQuery = () => {
    return useDataMutation(mutation as any, {
        onError: (err) => console.error(err),
    })
}

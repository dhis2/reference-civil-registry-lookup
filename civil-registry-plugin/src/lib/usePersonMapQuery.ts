import { useDataQuery } from '@dhis2/app-runtime'

const query = {
    escapedExpression: {
        resource: 'dataStore/civilRegistryPlugin/personMap',
    },
}

export const usePersonMapQuery = () => {
    return useDataQuery(query)
}

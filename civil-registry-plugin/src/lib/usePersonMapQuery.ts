import { useDataQuery } from '@dhis2/app-runtime'

const query = {
    escapedExpression: {
        resource: 'dataStore/capture/personMap'
    }
}

export const usePersonMapQuery = () => {
    return useDataQuery(query)
}

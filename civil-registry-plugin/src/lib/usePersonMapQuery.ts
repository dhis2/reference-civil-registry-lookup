import { useDataQuery } from '@dhis2/app-runtime'

const query = {
    escapedScript: {
        resource: 'dataStore/capture/personMap'
    }
}

export const usePersonMapQuery = () => {
    return useDataQuery(query)
}

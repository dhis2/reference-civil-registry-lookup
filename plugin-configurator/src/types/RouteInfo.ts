export type ApiRouteData = {
    id: string
    url: string
    name: string
    code: string
}

export type WrapQueryResponse<T, S extends string = 'result'> = {
    [K in S] : {
        [K in S]: T
    }
}
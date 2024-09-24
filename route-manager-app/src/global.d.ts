declare module '*.module.css' {
    const classes: { [key: string]: string }
    export default classes
}

declare module '@dhis2/d2-i18n' {
    const language: string
    // ts-ignore @typescript-eslint/no-explicit-any
    export function t(key: string, options?: { any }): string
    export function exists(key: string): boolean
}

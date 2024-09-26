import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Plugin from '../Plugin'
import { IDataEntryPluginProps } from '../Plugin.types'
import { CustomDataProvider } from '@dhis2/app-runtime'

const mockSetFieldValue = jest.fn()
const mockPerson: Record<string, string> = {
    id: 'abcdef12345',
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
    ].join(', '),
}
const mockFieldMetadata = {
    id: '',
    name: '',
    shortName: '',
    formName: '',
    disabled: false,
    compulsory: false,
    description: '',
    type: 'TEXT',
    optionSet: 'asdf',
    displayInForms: true,
    displayInReports: true,
    icon: '',
    unique: '',
    searchable: true,
    url: '',
}
const mockFieldsMetadata = {
    id: mockFieldMetadata,
    firstName: mockFieldMetadata,
    lastName: mockFieldMetadata,
    sex: mockFieldMetadata,
    dateOfBirth: mockFieldMetadata,
    address: mockFieldMetadata,
    // ! phone: {},
}

const mockProps: IDataEntryPluginProps = {
    fieldsMetadata: mockFieldsMetadata,
    formSubmitted: false,
    values: {},
    errors: {},
    warnings: {},
    setContextFieldValue: () => undefined,
    setFieldValue: mockSetFieldValue,
}

const expectedError = new Error('Query failed')
const mockData = {
    'routes/civil-registry/run': async (_: string, query: any) => {
        if (query.data.id === mockPerson.id) {
            return mockPerson
        }
        throw expectedError
    },
}

afterEach(() => {
    jest.clearAllMocks()
})

test('happy path, successful query', async () => {
    // arrange
    const consoleWarnSpy = jest.spyOn(console, 'warn')
    render(
        <CustomDataProvider data={mockData}>
            <Plugin {...mockProps} />
        </CustomDataProvider>
    )

    // act
    const input = screen.getByLabelText('Patient ID')
    const searchButton = screen.getByText('Search')

    await userEvent.type(input, mockPerson.id)
    await userEvent.click(searchButton)

    // assert
    // should be called for all the fieldMetadata fields
    expect(mockSetFieldValue).toHaveBeenCalledTimes(
        Object.keys(mockFieldsMetadata).length
    )
    // assert the correct values
    Object.keys(mockFieldsMetadata).forEach((key) => {
        expect(mockSetFieldValue).toHaveBeenCalledWith({
            fieldId: key,
            value: mockPerson[key],
        })
    })
    // expect there to be a warning for the value on mockPerson that was not on
    // mockFieldsData
    expect(consoleWarnSpy).toHaveBeenCalledWith(
        `Field ID "phone" not found in configured fields; skipping value ${mockPerson.phone}`
    )
})

test('failed query', async () => {
    // arrange
    const consoleErrorSpy = jest.spyOn(console, 'error')
    render(
        <CustomDataProvider data={mockData}>
            <Plugin {...mockProps} />
        </CustomDataProvider>
    )

    // act
    const input = screen.getByLabelText('Patient ID')
    const searchButton = screen.getByText('Search')

    await userEvent.type(input, 'not an id')
    await userEvent.click(searchButton)

    // assert
    // should not try to set any fields, and log error
    expect(mockSetFieldValue).not.toHaveBeenCalled()
    expect(consoleErrorSpy).toHaveBeenCalledWith(expectedError)
    // todo: test alert?
})

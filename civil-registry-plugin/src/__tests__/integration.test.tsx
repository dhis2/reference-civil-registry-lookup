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

const mockData = { 'route/civil-registry/run': mockPerson }

afterEach(() => {
    jest.clearAllMocks()
})

test('loads and displays greeting', async () => {
    // ARRANGE
    const consoleWarnSpy = jest.spyOn(console, 'warn')
    render(
        <CustomDataProvider data={mockData}>
            <Plugin {...mockProps} />
        </CustomDataProvider>
    )

    // ACT
    const input = screen.getByLabelText('Patient ID')
    const searchButton = screen.getByText('Search')

    await userEvent.type(input, mockPerson.id)
    await userEvent.click(searchButton)

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

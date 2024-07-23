import {useMutation} from "@tanstack/react-query";
import {SetFieldValueProps} from "../../Plugin.types";

type Props = {
    setFieldValue: (values: SetFieldValueProps) => void;
}

export const useExternalData = ({ setFieldValue }: Props) => {
    const { isLoading, isError, mutate } = useMutation({
        mutationFn: ({ patientId }: { patientId: string }) => fetch(`https://randomuser.me/api?inc=gender,name&seed=${patientId}`)
            .then(res => res.json()),
        onSuccess: (data) => {
            const person = data.results[0];

            setFieldValue({
                fieldId: 'firstName',
                value: person.name.first,
            });

            setFieldValue({
                fieldId: 'lastName',
                value: person.name.last,
            });

            setFieldValue({
                fieldId: 'gender',
                value: person.gender === 'male' ? 'Male' : 'Female',
            })
        }
    })

    return {
        mutate,
        isLoading,
        isError,
    }
}

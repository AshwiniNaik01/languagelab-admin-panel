import * as Yup from 'yup';

export const newEditorSchema = Yup.object({
    full_name: Yup.string().required('Full name is required'),

    email: Yup.string()
        .trim()
        .email('Please enter a valid email address')
        .required('Email is required'),

    password: Yup.string().when('$isEdit', {
        is: true,
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required('Password is required'),
    }),

    phone: Yup.string().required('Phone number is required'),

    role: Yup.string().required('Role is required'),

    profilePhoto: Yup.mixed().test('fileRequired', 'Profile photo is required', (value, context) => {
        if (context.options.context?.isEdit) {
            return true;
        }
        return value && value instanceof File && value.size > 0;
    }),
});


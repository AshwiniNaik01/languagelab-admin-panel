import * as Yup from 'yup';

export const studentSchema = Yup.object({
    full_name: Yup.string().trim().required("Please enter the student's full name."),

    email: Yup.string()
        .trim()
        .email('Please enter a valid email address.')
        .required('Please enter the email address.'),

    password: Yup.string().when('$isEdit', {
        is: true,
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required('Please enter the password.'),
    }),

    phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number.')
        .required('Please enter the phone number.'),

    institute_id: Yup.string().required('Please select the affiliated institute.'),

    license_id: Yup.string().required('Please select the license'),

    roll_no: Yup.string().trim().required('Please enter the roll number.'),

    enrollment_no: Yup.string().trim().required('Please enter the enrollment number.'),

    batch: Yup.string().trim().required('Please enter the batch.'),

    course: Yup.string().trim().required('Please enter the course/stream.'),

    year: Yup.number()
        .typeError('Please enter a valid year.')
        .integer('Year must be an integer')
        .min(1, 'Year must be at least 1')
        .required('Please enter the current year.'),

    profilePhoto: Yup.string()
        .transform((value) => (value === '' ? null : value))
        .url('Please enter a valid profile photo URL.')
        .required('Please enter the profile photo.'),

    student_excel: Yup.mixed().notRequired(),

    status: Yup.string().required('Please select the student status.'),

    is_active: Yup.boolean(),
});

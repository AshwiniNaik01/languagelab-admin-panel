import * as Yup from 'yup';

export const instituteSchema = Yup.object({
    institute_name: Yup.string().trim().matches(/^[A-Za-z\s.-]+$/, "Only alphabets are allowed").required('Institute name is required'),

    institute_code: Yup.string().trim().required('Institute code is required'),

    course_id: Yup.string().trim().required('Please select a course'),

    email: Yup.string()
        .trim()
        .email('Please enter a valid email address')
        .required('Email is required'),

    password: Yup.string().required('Password is required'),

    phone: Yup.string()
        .trim()
        .matches(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number")
        .required('Phone number is required'),

    website: Yup.string().trim().url('Please enter a valid website address'),

    address: Yup.string().trim().required('Address is required'),

    max_students: Yup.string()
        .min(1, 'Max students must be at least 1')
        .max(5000, 'Max students cannot exceed 5000')
        .required('Max students is required'),
});

export const editInstituteSchema = instituteSchema.shape({
    password: Yup.string().optional(),
});

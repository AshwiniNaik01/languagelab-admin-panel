import * as Yup from 'yup';

export const newLicenseSchema = Yup.object({
    institute_id: Yup.string().required('Please select an institute to assign the license to.'),

    license_code: Yup.string().required('Please enter a license code.'),

    total_seats: Yup.number()
        .typeError('Total seats must be a number')
        .integer('Total seats must be an integer')
        .min(1, 'Total seats must be at least 1')
        .required('Please enter the maximum number of seats.'),

    duration: Yup.number()
        .typeError('Duration must be a number')
        .integer('Duration must be an integer')
        .min(1, 'Duration must be at least 1 day')
        .required('Please enter a valid license duration.'),

    start_date: Yup.date()
        .typeError('Please select a valid start date.')
        .required('Please select a start date.'),

    expiry_date: Yup.date()
        .typeError('Please select a valid expiry date.')
        .required('Please select an expiry date.'),

    license_key: Yup.string().required('Please enter the HMAC license signature key.'),

    status: Yup.string().required('Please select a license status.'),
});


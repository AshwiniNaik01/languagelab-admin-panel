import * as Yup from 'yup';

export const courseSchema = Yup.object({
    course_name: Yup.string().trim().required('Course Name is required'),

    course_code: Yup.string().trim().required('Course Code is required'),

    duration: Yup.string().trim().required('Course duration is required'),

    description: Yup.string().trim().nullable().notRequired(),
});


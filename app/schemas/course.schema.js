import * as Yup from 'yup';

export const courseSchema = Yup.object({
  course_name: Yup.string().trim().required('Course name is required'),

  course_code: Yup.string().trim().required('Course code is required'),

  level: Yup.string()
    .oneOf(['beginner', 'intermediate', 'advanced'], 'Level must be beginner, intermediate, or advanced')
    .required('Level is required'),

  language: Yup.string().trim().required('Language is required'),

  duration_days: Yup.number()
    .typeError('Duration must be a number')
    .positive('Duration must be a positive number')
    .integer('Duration must be a whole number')
    .required('Duration (days) is required'),

  description: Yup.string().trim().nullable().notRequired(),
});

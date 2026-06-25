import * as Yup from 'yup';

export const newEditorSchema = Yup.object({
  full_name: Yup.string().trim().matches(/^[A-Za-z\s.-]+$/, "Only alphabets are allowed")
  .required("Full name is required"),

  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),

  // On create: required. On edit: leave blank to keep existing password.
  password: Yup.string().when("$isEdit", {
    is: true,
    then: (schema) => schema.notRequired(),
    otherwise: (schema) => schema.required("Password is required"),
  }),

  phone: Yup.string().trim().matches(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number")
  .required("Phone number is required"),
  // role is always 'editor' — set by the backend, not editable
});

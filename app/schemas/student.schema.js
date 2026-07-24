import * as Yup from 'yup';

export const studentSchema = Yup.object({
  full_name: Yup.string().trim().required("Full name is required"),

  roll_no: Yup.string().trim().required("Roll number is required"),

  enrollment_no: Yup.string().trim().required("Enrollment number is required"),

  institute_id: Yup.string().required("Please select an institute"),

  // Optional fields — backend accepts them but does not require them
  email: Yup.string().trim().email("Enter a valid email address").optional(),

  phone: Yup.string()
    .trim()
    .matches(/^[0-9]{10}$/, "Enter a valid 10-digit phone number")
    .optional(),

  batch: Yup.string().trim().optional(),

  course: Yup.string().trim().optional(),

  year: Yup.number()
    .integer("Year must be a whole number")
    .min(1, "Year must be at least 1")
    .optional()
    .nullable()
    .transform((v, o) => (o === "" ? null : v)),
});

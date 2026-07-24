import * as Yup from "yup";

export const courseSchema = Yup.object({
  course_name: Yup.string()
    .trim()
    .required("Course name is required")
     .matches(/^[A-Za-z\s]+$/,"Course name can contain only letters and spaces")
    .min(3, "Course name must be at least 3 characters")
    .max(100, "Course name cannot exceed 100 characters"),

course_code: Yup.string()
  .trim()
  .required("Course code is required.")
  .matches(
    /^[A-Z0-9_-]+$/,
    "Course code must contain only uppercase letters (A–Z), numbers (0–9), underscores (_), and hyphens (-)."
  ),
  level: Yup.string()
    .oneOf(
      ["beginner", "intermediate", "advanced"],
      "Level must be beginner, intermediate, or advanced"
    )
    .required("Level is required"),

  language: Yup.string()
    .trim()
    .nullable()
    .notRequired(),

  duration_days: Yup.number()
    .typeError("Duration must be a number")
    .positive("Duration must be greater than 0")
    .integer("Duration must be a whole number")
    .required("Duration (days) is required"),

  description: Yup.string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .nullable()
    .notRequired(),
});
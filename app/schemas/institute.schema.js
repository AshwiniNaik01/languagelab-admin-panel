import * as Yup from "yup";

export const instituteSchema = Yup.object({
  institute_name: Yup.string()
    .trim()
    .matches(/^[A-Za-z\s.-]+$/, "Only alphabets are allowed")
    .required("Institute name is required"),

  institute_code: Yup.string()
    .trim()
    .required("Institute code is required"),

  course_id: Yup.string()
    .trim()
    .required("Please select a course"),

  email: Yup.string()
    .trim()
    .email("Please enter a valid email address")
    .required("Email is required"),

  password: Yup.string()
    .required("Password is required"),

  phone: Yup.string()
    .trim()
    .matches(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number")
    .required("Phone number is required"),

  website: Yup.string()
    .trim()
    .url("Please enter a valid website address"),

  // Address Validation
  address: Yup.object({
    line1: Yup.string()
      .trim()
      .required("Address Line 1 is required")
      .min(5, "Address Line 1 must be at least 5 characters")
      .max(100, "Address Line 1 cannot exceed 100 characters"),

    line2: Yup.string()
      .trim()
      .max(100, "Address Line 2 cannot exceed 100 characters")
      .nullable(),

    pincode: Yup.string()
      .trim()
      .matches(/^[1-9][0-9]{5}$/, "Enter a valid 6-digit pincode")
      .required("Pincode is required"),

    state: Yup.string()
      .trim()
      .required("State is required")
      .matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),

    dist: Yup.string()
      .trim()
      .required("District is required")
      .matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),

    taluka: Yup.string()
      .trim()
      .required("Taluka is required")
      .matches(/^[A-Za-z\s]+$/, "Only alphabets are allowed"),

    autorizedName: Yup.string()
      .trim()
      .required("Authorized person name is required")
      .matches(/^[A-Za-z\s.]+$/, "Only alphabets are allowed"),

    autorizedPhono: Yup.string()
      .trim()
      .matches(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number")
      .required("Authorized person's phone number is required"),

    nearbyLandmarks: Yup.string()
      .trim()
      .max(100, "Nearby landmark cannot exceed 100 characters"),
  }).required(),

  max_students: Yup.number()
    .typeError("Max students must be a number")
    .min(1, "Max students must be at least 1")
    .max(5000, "Max students cannot exceed 5000")
    .required("Max students is required"),
});

export const editInstituteSchema = instituteSchema.shape({
  password: Yup.string().optional(),
});
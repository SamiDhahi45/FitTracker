import * as yup from "yup";

export const registerSchemaValidation = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Not a valid email format")
    .required("Email is required"),
  password: yup.string().min(4).max(20).required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords don't match")
    .required("Please confirm your password"),
});

export const loginSchemaValidation = yup.object().shape({
  email: yup
    .string()
    .email("Not a valid email format")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

export const profileSchemaValidation = yup.object().shape({
  name:   yup.string().required("Name is required"),
  age:    yup.number().min(1).max(120).nullable(),
  weight: yup.number().min(1, "Weight must be positive").nullable(),
  height: yup.number().min(1, "Height must be positive").nullable(),
});

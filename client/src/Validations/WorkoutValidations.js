import * as yup from "yup";

export const workoutSchemaValidation = yup.object().shape({
  title: yup
    .string()
    .required("Workout title is required"),
  duration: yup
    .number()
    .min(0, "Duration cannot be negative")
    .nullable(),
  notes: yup.string().nullable(),
});

export const exerciseSchemaValidation = yup.object().shape({
  name: yup.string().required("Exercise name is required"),
  category: yup
    .string()
    .oneOf(["chest", "back", "legs", "shoulders", "arms", "core", "cardio"])
    .required("Category is required"),
  muscleGroup: yup.string().required("Muscle group is required"),
  difficulty: yup
    .string()
    .oneOf(["beginner", "intermediate", "advanced"])
    .nullable(),
});

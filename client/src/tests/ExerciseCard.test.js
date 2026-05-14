import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ExerciseCard from "../Components/ExerciseCard";

const globalExercise = {
  _id:         "e001",
  name:        "Bench Press",
  category:    "chest",
  muscleGroup: "Pectorals",
  equipment:   "Barbell",
  difficulty:  "intermediate",
  isCustom:    false,
};

const customExercise = {
  _id:         "e002",
  name:        "My Custom Row",
  category:    "back",
  muscleGroup: "Latissimus Dorsi",
  equipment:   "Cable",
  difficulty:  "beginner",
  isCustom:    true,
};

describe("ExerciseCard Component", () => {
  test("renders exercise name, category, and muscle group", () => {
    render(<ExerciseCard exercise={globalExercise} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("chest")).toBeInTheDocument();
    expect(screen.getByText("Pectorals")).toBeInTheDocument();
  });

  test("does NOT show edit/delete buttons for global (non-custom) exercises", () => {
    render(<ExerciseCard exercise={globalExercise} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.queryByText("✏️")).not.toBeInTheDocument();
    expect(screen.queryByText("🗑")).not.toBeInTheDocument();
  });

  test("shows edit and delete buttons for custom exercises", () => {
  render(<ExerciseCard exercise={customExercise} onEdit={jest.fn()} onDelete={jest.fn()} />);
  expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
});

  test("calls onEdit with the exercise when edit button is clicked", () => {
    const onEdit = jest.fn();
    render(<ExerciseCard exercise={customExercise} onEdit={onEdit} onDelete={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(customExercise);
  });

  test("calls onDelete with exercise ID when delete button is clicked", () => {
    const onDelete = jest.fn();
    render(<ExerciseCard exercise={customExercise} onEdit={jest.fn()} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith("e002");
  });
});

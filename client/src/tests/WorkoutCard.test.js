import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import WorkoutCard from "../Components/WorkoutCard";

const mockWorkout = {
  _id:         "w001",
  title:       "Push Day A",
  date:        "2024-03-01T10:00:00Z",
  exercises:   [{ exercise: "e1", sets: [] }, { exercise: "e2", sets: [] }],
  totalVolume: 1250,
  duration:    45,
  isCompleted: true,
};

describe("WorkoutCard Component", () => {
  test("renders workout title and total volume", () => {
    render(<WorkoutCard workout={mockWorkout} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText("Push Day A")).toBeInTheDocument();
    expect(screen.getByText(/1,250 kg/i)).toBeInTheDocument();
  });

  test("shows Done badge when workout isCompleted is true", () => {
    render(<WorkoutCard workout={mockWorkout} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText(/✓ Done/i)).toBeInTheDocument();
  });

  test("shows In Progress badge when isCompleted is false", () => {
    const incomplete = { ...mockWorkout, isCompleted: false };
    render(<WorkoutCard workout={incomplete} onEdit={jest.fn()} onDelete={jest.fn()} />);
    expect(screen.getByText(/In Progress/i)).toBeInTheDocument();
  });

  test("calls onDelete with the workout ID when Delete is clicked", () => {
    const onDelete = jest.fn();
    render(<WorkoutCard workout={mockWorkout} onEdit={jest.fn()} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole("button", { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith("w001");
  });

  test("calls onEdit with the full workout object when Edit is clicked", () => {
    const onEdit = jest.fn();
    render(<WorkoutCard workout={mockWorkout} onEdit={onEdit} onDelete={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledWith(mockWorkout);
  });
});

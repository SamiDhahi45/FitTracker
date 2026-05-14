import React from "react";
import { render, screen } from "@testing-library/react";
import ProgressChart from "../Components/ProgressChart";

jest.mock("recharts", () => {
  const React = require("react");
  return {
    AreaChart:          ({ children }) => <div data-testid="area-chart">{children}</div>,
    Area:               () => null,
    XAxis:              () => null,
    YAxis:              () => null,
    CartesianGrid:      () => null,
    Tooltip:            () => null,
    ResponsiveContainer:({ children }) => <div>{children}</div>,
  };
});

const mockWorkouts = [
  { date: "2024-03-01", totalVolume: 800,  duration: 40 },
  { date: "2024-03-03", totalVolume: 1200, duration: 50 },
  { date: "2024-03-05", totalVolume: 950,  duration: 45 },
];

describe("ProgressChart Component", () => {
  test("renders the section heading", () => {
    render(<ProgressChart workouts={mockWorkouts} />);
    expect(screen.getByText(/volume over time/i)).toBeInTheDocument();
  });

  test("renders the AreaChart element", () => {
    render(<ProgressChart workouts={mockWorkouts} />);
    expect(screen.getByTestId("area-chart")).toBeInTheDocument();
  });

  test("renders without crashing when workouts array is empty", () => {
    render(<ProgressChart workouts={[]} />);
    expect(screen.getByTestId("progress-chart")).toBeInTheDocument();
  });

  test("wraps content in a data-testid container", () => {
    render(<ProgressChart workouts={mockWorkouts} />);
    expect(screen.getByTestId("progress-chart")).toBeInTheDocument();
  });
});

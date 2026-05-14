import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Features/UserSlice";
import Login from "../Components/Login";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const createTestStore = () =>
  configureStore({ reducer: { users: userReducer } });

const renderLogin = () =>
  render(
    <Provider store={createTestStore()}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </Provider>
  );

describe("Login Component", () => {
  beforeEach(() => mockNavigate.mockClear());

  test("renders email input, password input, and Sign In button", () => {
    renderLogin();
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  test("shows validation error when email field is empty and form is submitted", async () => {
    renderLogin();
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });
  });

  test("shows validation error for invalid email format", async () => {
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: "not-an-email" },
    });
    fireEvent.blur(screen.getByPlaceholderText(/you@example.com/i));
    await waitFor(() => {
      expect(screen.getByText(/not a valid email format/i)).toBeInTheDocument();
    });
  });

  test("shows validation error when password is empty", async () => {
    renderLogin();
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: "user@test.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));
    await waitFor(() => {
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });
});

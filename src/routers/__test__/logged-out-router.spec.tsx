import { render, screen, waitFor } from "@testing-library/react";
import { LoggedOutRouter } from "../logged-out-router";

jest.mock("../../pages/create-account", () => {
  return {
    CreateAccount: () => <span>create-account-component</span>,
  };
});

jest.mock("../../pages/login", () => {
  return {
    Login: () => <span>log-in-component</span>,
  };
});

jest.mock("../../pages/404", () => {
  return {
    NotFound: () => <span>404-not-found-component</span>,
  };
});

describe("<LoggedInRouter /> route test", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it("renders Login at '/'", async () => {
    window.history.pushState({}, "", "/");
    render(<LoggedOutRouter />);

    await waitFor(() => {
      expect(screen.getByText("log-in-component")).toBeInTheDocument();
    });
  });

  it("renders CreateAccount at '/create-account'", async () => {
    window.history.pushState({}, "", "/create-account");
    render(<LoggedOutRouter />);

    await waitFor(() => {
      expect(screen.getByText("create-account-component")).toBeInTheDocument();
    });
  });

  it("renders NotFound at invalid route", async () => {
    window.history.pushState({}, "", "/invalid-path");
    render(<LoggedOutRouter />);

    await waitFor(() => {
      expect(screen.getByText("404-not-found-component")).toBeInTheDocument();
    });
  });
});

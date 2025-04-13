import { render, screen, waitFor } from "@testing-library/react";
import { App } from "../app";
import { isLoggedInVar } from "../../apollo";

jest.mock("../../routers/logged-out-router", () => {
  return {
    LoggedOutRouter: () => <span>logged-out</span>,
  };
});

jest.mock("../../routers/logged-in-router", () => {
  return {
    LoggedInRouter: () => <span>logged-in</span>,
  };
});

describe("App", () => {
  it("should render LoggedOutRouter", () => {
    render(<App />);
    expect(screen.getByText("logged-out")).toBeInTheDocument();
  });

  it("should render LoggedInRouter", async () => {
    render(<App />);
    await waitFor(() => {
      isLoggedInVar(true);
    });
    expect(screen.getByText("logged-in")).toBeInTheDocument();
  });
});

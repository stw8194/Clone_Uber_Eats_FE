import { MockedProvider } from "@apollo/client/testing";
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { Header } from "../header";
import { ME_QUERY } from "../../hooks/useMe";

const mocks = (verified: boolean) => [
  {
    request: {
      query: ME_QUERY,
    },
    result: {
      data: {
        me: {
          id: 1,
          email: "test@test.com",
          role: "Client",
          verified,
        },
      },
    },
  },
];

describe("<Header />", () => {
  it("should render with veirfy banner", async () => {
    render(
      <MockedProvider mocks={mocks(false)}>
        <Router>
          <Header />
        </Router>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Please verify your email.")).toBeInTheDocument();
    });
  });

  it("should render without verify banner", async () => {
    render(
      <MockedProvider mocks={mocks(true)}>
        <Router>
          <Header />
        </Router>
      </MockedProvider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText("Please verify your email.")
      ).not.toBeInTheDocument();
    });
  });
});

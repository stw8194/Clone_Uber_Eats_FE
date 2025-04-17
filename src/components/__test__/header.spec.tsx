import { MockedProvider } from "@apollo/client/testing";
import { Header } from "../header";
import { ME_QUERY } from "../../hooks/useMe";
import { render, screen, waitFor } from "../../test-utils";

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
        <Header />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText("Please verify your email.")).toBeInTheDocument();
    });
  });

  it("should render without verify banner", async () => {
    render(
      <MockedProvider mocks={mocks(true)}>
        <Header />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(
        screen.queryByText("Please verify your email.")
      ).not.toBeInTheDocument();
    });
  });
});

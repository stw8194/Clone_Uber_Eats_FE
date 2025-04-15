import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import { Login, LOGIN_MUTATION } from "../login";
import { ApolloProvider } from "@apollo/client";
import { createMockClient } from "mock-apollo-client";
import userEvent from "@testing-library/user-event";

describe("<Login />", () => {
  it("should render OK", () => {
    const mockedClient = createMockClient();
    render(
      <Router>
        <ApolloProvider client={mockedClient}>
          <Login />
        </ApolloProvider>
      </Router>
    );

    expect(document.title).toBe("Login | CUber Eats");
  });

  it("should display email validation errors", async () => {
    const mockedClient = createMockClient();
    render(
      <Router>
        <ApolloProvider client={mockedClient}>
          <Login />
        </ApolloProvider>
      </Router>
    );

    const email = screen.getByPlaceholderText("Email");
    userEvent.type(email, "this@wont");
    await waitFor(() => {
      expect(screen.getByText("invalid email address")).toBeInTheDocument();
    });
    userEvent.clear(email);
    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });

  it("should display password required errors", async () => {
    const mockedClient = createMockClient();
    render(
      <Router>
        <ApolloProvider client={mockedClient}>
          <Login />
        </ApolloProvider>
      </Router>
    );

    const email = screen.getByPlaceholderText("Email");
    const submitBtn = screen.getByRole("button");
    userEvent.type(email, "this@will.work");
    userEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByText("Password is required")).toBeInTheDocument();
    });
  });

  it("should show error on mutation", async () => {
    const mockedClient = createMockClient();
    const formData = {
      email: "test@will.be",
      password: "done",
    };
    render(
      <Router>
        <ApolloProvider client={mockedClient}>
          <Login />
        </ApolloProvider>
      </Router>
    );

    const email = screen.getByPlaceholderText("Email");
    const password = screen.getByPlaceholderText("Password");
    const submitBtn = screen.getByRole("button");
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: false,
          error: "error on mutation",
          token: null,
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    userEvent.type(email, formData.email);
    userEvent.type(password, formData.password);
    userEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.getByText("error on mutation")).toBeInTheDocument();
    });
  });

  it("should submit form and calls mutation", async () => {
    const mockedClient = createMockClient();
    const formData = {
      email: "test@will.be",
      password: "done",
    };
    render(
      <Router>
        <ApolloProvider client={mockedClient}>
          <Login />
        </ApolloProvider>
      </Router>
    );

    const email = screen.getByPlaceholderText("Email");
    const password = screen.getByPlaceholderText("Password");
    const submitBtn = screen.getByRole("button");
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        login: {
          ok: true,
          error: null,
          token: "passed",
        },
      },
    });
    mockedClient.setRequestHandler(LOGIN_MUTATION, mockedMutationResponse);
    userEvent.type(email, formData.email);
    userEvent.type(password, formData.password);
    userEvent.click(submitBtn);
    await waitFor(() => {
      expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    });
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      loginInput: { ...formData },
    });
  });
});

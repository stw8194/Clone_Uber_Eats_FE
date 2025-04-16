import { createMockClient } from "mock-apollo-client";
import { CREATE_ACCOUNT_MUTATION, CreateAccount } from "../create-account";
import { render, screen, waitFor } from "../../test-utils";
import userEvent from "@testing-library/user-event";
import { UserRole } from "../../gql/graphql";

describe("<CreateAccount />", () => {
  it("should render ok", () => {
    const mockedClient = createMockClient();
    render(<CreateAccount />, { client: mockedClient });
    expect(document.title).toBe("Create Account | CUber Eats");
  });

  it("should display email validation errors", async () => {
    const mockedClient = createMockClient();
    render(<CreateAccount />, { client: mockedClient });

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
    render(<CreateAccount />, { client: mockedClient });

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
    render(<CreateAccount />, { client: mockedClient });

    const email = screen.getByPlaceholderText("Email");
    const password = screen.getByPlaceholderText("Password");
    const submitBtn = screen.getByRole("button");
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: false,
          error: "error on mutation",
        },
      },
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedMutationResponse
    );
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
      role: UserRole.Client,
    };
    render(<CreateAccount />, { client: mockedClient });

    const email = screen.getByPlaceholderText("Email");
    const password = screen.getByPlaceholderText("Password");
    const submitBtn = screen.getByRole("button");
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      data: {
        createAccount: {
          ok: true,
          error: null,
        },
      },
    });
    mockedClient.setRequestHandler(
      CREATE_ACCOUNT_MUTATION,
      mockedMutationResponse
    );
    jest.spyOn(window, "alert").mockImplementation(() => null);
    userEvent.type(email, formData.email);
    userEvent.type(password, formData.password);
    userEvent.click(submitBtn);
    await waitFor(() => {
      expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByText(UserRole.Client)).toBeInTheDocument();
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      createAccountInput: { ...formData },
    });
    expect(window.alert).toHaveBeenCalledWith("Account created");
  });
});

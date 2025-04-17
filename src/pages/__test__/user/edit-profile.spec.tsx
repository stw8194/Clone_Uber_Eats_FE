import { createMockClient } from "mock-apollo-client";
import { UserRole } from "../../../gql/graphql";
import { render, screen, waitFor } from "../../../test-utils";
import { EDIT_PROFILE_MUTATION, EditProfile } from "../../user/edit-profile";
import { ME_QUERY } from "../../../hooks/useMe";
import userEvent from "@testing-library/user-event";

const mockPush = jest.fn();

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});

const editProfileMutationResults = (ok: boolean, error: string | null) => ({
  data: {
    editProfile: {
      ok,
      error,
    },
  },
});

const meQueryResults = {
  data: {
    me: {
      id: 1,
      email: "old@email.test",
      role: UserRole.Client,
      verified: false,
    },
  },
};

describe("<EditProfile />", () => {
  it("should render OK", async () => {
    const mockedClient = createMockClient();
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      ...editProfileMutationResults(true, null),
    });
    const mockedQueryResponse = jest.fn().mockResolvedValue({
      ...meQueryResults,
    });
    mockedClient.setRequestHandler(
      EDIT_PROFILE_MUTATION,
      mockedMutationResponse
    );
    mockedClient.setRequestHandler(ME_QUERY, mockedQueryResponse);
    render(<EditProfile />, { client: mockedClient });

    await waitFor(() => {
      expect(document.title).toBe("Edit Profile | CUber Eats");
    });
  });

  it("should not be submitted if email and password both are not exist", async () => {
    const mockedClient = createMockClient();
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      ...editProfileMutationResults(true, null),
    });
    const mockedQueryResponse = jest.fn().mockResolvedValue({
      ...meQueryResults,
    });
    mockedClient.setRequestHandler(
      EDIT_PROFILE_MUTATION,
      mockedMutationResponse
    );
    mockedClient.setRequestHandler(ME_QUERY, mockedQueryResponse);
    render(<EditProfile />, { client: mockedClient });
    const email = screen.getByPlaceholderText("Email");
    const submitBtn = screen.getByRole("button");
    userEvent.clear(email);
    userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockedMutationResponse).not.toHaveBeenCalled();
    });
  });

  const rawCases = [
    { email: "new@email.test", password: "newPassword" },
    { email: "new@email.test", password: "" },
    { email: "", password: "newPassword" },
  ];

  const cases = rawCases.map(({ email, password }) => {
    const hasEmail = !!email;
    const hasPassword = !!password;
    const name =
      hasEmail && hasPassword
        ? "should succeed with both email and password"
        : hasEmail
        ? "should succeed with email only"
        : "should Succeeds with password only";
    return {
      name,
      email,
      password,
    };
  });
  it.each(cases)("$name", async ({ email, password }) => {
    const mockedClient = createMockClient();
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      ...editProfileMutationResults(true, null),
    });
    const mockedQueryResponse = jest.fn().mockResolvedValue({
      ...meQueryResults,
    });
    mockedClient.setRequestHandler(
      EDIT_PROFILE_MUTATION,
      mockedMutationResponse
    );
    mockedClient.setRequestHandler(ME_QUERY, mockedQueryResponse);
    render(<EditProfile />, { client: mockedClient });
    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitBtn = screen.getByRole("button");
    if (email) userEvent.type(emailInput, email);
    if (password) userEvent.type(passwordInput, password);
    userEvent.click(submitBtn);

    await waitFor(() => {
      expect(mockedMutationResponse).toHaveBeenCalledTimes(1);
    });
    expect(mockedMutationResponse).toHaveBeenCalledWith({
      editProfileInput: {
        email,
        ...(password !== "" && { password }),
      },
    });
    expect(mockPush).toHaveBeenCalledWith("/");
  });
});

import { createMockClient } from "mock-apollo-client";
import { render, waitFor } from "../../../test-utils";
import { ConfirmEmail, VERIFY_EMAIL_MUTATION } from "../../user/confirm-email";
import { UserRole } from "../../../gql/graphql";
import { ME_QUERY } from "../../../hooks/useMe";

const mockPush = jest.fn();
const mockReplace = jest.fn();

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush,
        replace: mockReplace,
      };
    },
  };
});

const verifyEmailMutationResults = (ok: boolean, error: string | null) => ({
  data: {
    verifyEmail: {
      ok,
      error,
    },
  },
});

const meQueryResults = (verified: boolean) => ({
  data: {
    me: {
      id: 1,
      email: "test@will.work",
      role: UserRole.Client,
      verified,
    },
  },
});

describe("<ConfirmEmail />", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should render OK", async () => {
    Object.defineProperty(window, "location", {
      value: {
        href: "/confirm?code=testCode",
      },
    });
    const mockedClient = createMockClient();
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      ...verifyEmailMutationResults(true, null),
    });
    const mockedQueryResponse = jest.fn().mockResolvedValue({
      ...meQueryResults(true),
    });
    mockedClient.setRequestHandler(
      VERIFY_EMAIL_MUTATION,
      mockedMutationResponse
    );
    mockedClient.setRequestHandler(ME_QUERY, mockedQueryResponse);
    render(<ConfirmEmail />, { client: mockedClient });

    await waitFor(() => {
      expect(document.title).toBe("Verify Email | CUber Eats");
    });
  });

  it("should redirect to home if code not exist", async () => {
    Object.defineProperty(window, "location", {
      value: {
        href: "/confirm",
      },
    });
    const mockedClient = createMockClient();
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      ...verifyEmailMutationResults(false, "No code"),
    });
    const mockedQueryResponse = jest.fn().mockResolvedValue({
      ...meQueryResults(true),
    });
    mockedClient.setRequestHandler(
      VERIFY_EMAIL_MUTATION,
      mockedMutationResponse
    );
    mockedClient.setRequestHandler(ME_QUERY, mockedQueryResponse);
    jest.spyOn(window, "alert").mockImplementation(() => null);
    render(<ConfirmEmail />, { client: mockedClient });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Verification needs code");
    });
    expect(mockReplace).toHaveBeenCalledWith("/");
  });

  it("should redirect to home with wrong code", async () => {
    Object.defineProperty(window, "location", {
      value: {
        href: "/confirm?code=wrongCode",
      },
    });
    const mockedClient = createMockClient();
    const mockedMutationResponse = jest.fn().mockResolvedValue({
      ...verifyEmailMutationResults(false, "Invalid code"),
    });
    const mockedQueryResponse = jest.fn().mockResolvedValue({
      ...meQueryResults(true),
    });
    mockedClient.setRequestHandler(
      VERIFY_EMAIL_MUTATION,
      mockedMutationResponse
    );
    mockedClient.setRequestHandler(ME_QUERY, mockedQueryResponse);
    jest.spyOn(window, "alert").mockImplementation(() => null);
    render(<ConfirmEmail />, { client: mockedClient });

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Invalid verification code");
    });
    expect(mockReplace).toHaveBeenCalledWith("/");
  });
});

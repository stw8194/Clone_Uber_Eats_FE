import { createMockClient } from "mock-apollo-client";
import { CreateAccount } from "../create-account";
import { render } from "../../test-utils";

describe("<CreateAccount />", () => {
  it("should render ok", () => {
    const mockedClient = createMockClient();
    render(<CreateAccount />, { client: mockedClient });
    expect(document.title).toBe("Create Account | CUber Eats");
  });
});

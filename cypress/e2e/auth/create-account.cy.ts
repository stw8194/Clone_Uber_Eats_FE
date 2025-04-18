describe("Create Account", () => {
  const user = cy;
  it("should see email & password validation errors", () => {
    user.visit("/");
    user.findByText(/create an account/i).click();
    user.title().should("eq", "Create Account | CUber Eats");
    user.findByPlaceholderText(/email/i).type("not@work");
    user.findByRole("alert").should("have.text", "invalid email address");
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("it@will.work");
    user
      .findByPlaceholderText(/password/i)
      .type("1")
      .clear();
    user.findByRole("alert").should("have.text", "Password is required");
  });

  it("should be able to create account and login", () => {
    user.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;

      if (operationName && operationName === "CreateAccount") {
        req.reply((res) => {
          res.send({
            data: {
              createAccount: {
                ok: true,
                error: null,
                __typename: "CreateAccountOutput",
              },
            },
          });
        });
      }
    });
    user.visit("/create-account");
    user.findByPlaceholderText(/email/i).type("client@test.com");
    user.findByPlaceholderText(/password/i).type("1234");
    user.findByRole("button").click();
    user.url().should("match", /\/$/);
    user.title().should("eq", "Login | CUber Eats");
    user.findByPlaceholderText(/email/i).type("client@test.com");
    user.findByPlaceholderText(/password/i).type("1234");
    user.findByRole("button").click();
    user.window().its("localStorage.cuber-token").should("be.a", "string");
  });

  it("should see email duplication error", () => {
    user.visit("/create-account");
    user.findByPlaceholderText(/email/i).type("client@test.com");
    user.findByPlaceholderText(/password/i).type("1234");
    user
      .findByRole("button")
      .should("not.have.class", "pointer-events-none")
      .click();
    user
      .findByRole("alert")
      .should("have.text", "There is a user with that email already");
  });
});

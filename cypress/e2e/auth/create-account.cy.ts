describe("Create Account", () => {
  const user = cy;
  it("can go log in page by clicking sign in", () => {
    user.visit("/create-account");
    user.findByText("Sign in").click();
    user.assertTitle("Login");
  });

  it("should see email & password validation errors", () => {
    user.visit("/");
    user.findByText(/create an account/i).click();
    user.assertTitle("Create Account");
    user.findByPlaceholderText(/email/i).type("not@work");
    user.assertDeactivatedButton();
    user.findByRole("alert").should("have.text", "invalid email address");
    user.findByPlaceholderText(/email/i).clear();
    user.assertDeactivatedButton();
    user.findByRole("alert").should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("it@will.work");
    user
      .findByPlaceholderText(/password/i)
      .type("1")
      .clear();
    user.assertDeactivatedButton();
    user.findByRole("alert").should("have.text", "Password is required");
  });

  it("should be able to create account and login", () => {
    user.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;

      if (operationName && operationName === "CreateAccount") {
        req.reply((res) => {
          res.send({
            fixture: "auth/create-account.json",
          });
        });
      }
    });
    user.visit("/create-account");
    user.findByPlaceholderText(/email/i).type("client@test.com");
    user.findByPlaceholderText(/password/i).type("1234");
    user.findByRole("button").click();
    user.login("client@test.com", "1234");
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

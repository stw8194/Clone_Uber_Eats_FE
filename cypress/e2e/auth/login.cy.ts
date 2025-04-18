describe("Log In", () => {
  const user = cy;
  it("should see login page", () => {
    user.visit("/").title().should("eq", "Login | CUber Eats");
  });

  it("can see email & password validation errors", () => {
    user.visit("/");
    user.findByPlaceholderText(/email/i).type("wrongEmail");
    user.findByRole("alert").should("have.text", "invalid email address");
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("wrong@email.com");
    user
      .findByPlaceholderText(/password/i)
      .type("1")
      .clear();
    user.findByRole("alert").should("have.text", "Password is required");
  });

  it("can fill out the form", () => {
    user.visit("/");
    user.findByPlaceholderText(/email/i).type("client@test.com");
    user.findByPlaceholderText(/password/i).type("1234");
    user
      .findByRole("button")
      .should("not.have.class", "pointer-events-none")
      .click();
    user.window().its("localStorage.cuber-token").should("be.a", "string");
  });
});

describe("Log In", () => {
  const user = cy;
  it("should see login page", () => {
    user.visit("/").assertTitle("Login");
  });

  it("can go log in page by clicking Create an Account", () => {
    user.visit("/");
    user.findByText("Create an Account").click();
    user.assertTitle("Create Account");
  });

  it("can see email & password validation errors", () => {
    user.visit("/");
    user.findByPlaceholderText(/email/i).type("wrongEmail");
    user.assertDeactivatedButton();
    user.findByRole("alert").should("have.text", "invalid email address");
    user.findByPlaceholderText(/email/i).clear();
    user.assertDeactivatedButton();
    user.findByRole("alert").should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("wrong@email.com");
    user
      .findByPlaceholderText(/password/i)
      .type("1")
      .clear();
    user.assertDeactivatedButton();
    user.findByRole("alert").should("have.text", "Password is required");
  });

  it("can fill out the form and login", () => {
    user.visit("/");
    user.login("client@test.com", "1234");
  });
});

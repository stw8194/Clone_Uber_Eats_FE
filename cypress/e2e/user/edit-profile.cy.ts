describe("Edit Profile", () => {
  const user = cy;
  beforeEach(() => {
    user.visit("/");
    user.login("client@test.com", "1234");
  });

  it("can go /edit-profile using the header", () => {
    user.get('a[href="/edit-profile"]').click();
    user.assertTitle("Edit Profile");
  });

  it("can not click button in case of nothing on form", () => {
    user.visit("/edit-profile");
    user.findByPlaceholderText(/email/i).clear();
    user.assertDeactivatedButton();
  });

  it("can not click button in case of invalid email on form", () => {
    user.visit("/edit-profile");
    user.findByPlaceholderText(/email/i).clear().type("wrongEmail");
    user.assertDeactivatedButton();
  });

  it("can change email", () => {
    user.intercept("POST", "http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;

      if (operationName && operationName === "EditProfile") {
        req.body.variables.editProfileInput.email = "client@test.com";
      }
    });
    user.visit("/edit-profile");
    user.findByPlaceholderText(/email/i).clear().type("newClient@test.com");
    user.findByRole("button").click();
    user.assertTitle("Home");
  });

  it("can change password", () => {
    user.intercept("POST", "http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;

      if (operationName && operationName === "EditProfile") {
        req.body.variables.editProfileInput.password = "1234";
      }
    });
    user.visit("/edit-profile");
    user
      .findByPlaceholderText(/password/i)
      .clear()
      .type("newOne");
    user.findByRole("button").click();
    user.assertTitle("Home");
  });
});

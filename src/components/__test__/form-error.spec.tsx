import { render, screen } from "@testing-library/react";
import { FormError } from "../form-error";

describe("<FormError />", () => {
  it("should render OK with props", () => {
    render(<FormError errorMessage="test" />);
    expect(screen.getByText("test")).toBeInTheDocument();
  });
});

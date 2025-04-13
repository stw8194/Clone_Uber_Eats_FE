import { render, screen } from "@testing-library/react";
import { SubmitButton } from "../submit-button";

describe("SubmitButton", () => {
  it("should render OK with props", () => {
    render(<SubmitButton canClick={true} loading={false} actionText="test" />);
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveClass("hover:bg-lime-800");
  });

  it("should not clickable", () => {
    render(<SubmitButton canClick={false} loading={false} actionText="test" />);
    expect(screen.getByRole("button")).toHaveClass("pointer-events-none");
  });

  it("should display loading", () => {
    render(<SubmitButton canClick={true} loading={true} actionText="test" />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});

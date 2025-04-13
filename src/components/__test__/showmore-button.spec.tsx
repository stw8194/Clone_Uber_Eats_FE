import { render, screen } from "@testing-library/react";
import { ShowMoreButton } from "../showmore-button";

const onClick = jest.fn();

describe("<ShowMoreButton />", () => {
  it("should render OK with props", () => {
    render(<ShowMoreButton page={1} totalPages={2} onClick={onClick} />);
    expect(screen.getByText("Show more")).toBeInTheDocument();
  });

  it("should not show the load more button if no data remains", () => {
    render(<ShowMoreButton page={1} totalPages={1} onClick={onClick} />);
    expect(screen.queryByText("Show more")).not.toBeInTheDocument();
  });
});

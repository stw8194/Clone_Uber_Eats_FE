import { Restaurant } from "../restaurant";
import { render, screen } from "../../test-utils";

const restaurantProps = {
  id: "1",
  coverImg: "testImg",
  name: "test",
};

describe("<Restaurant />", () => {
  it("should render OK with props", () => {
    render(<Restaurant {...restaurantProps} />);
    expect(screen.getByRole("link")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/restaurant/${restaurantProps.id}`
    );
    expect(screen.getByText(restaurantProps.name)).toBeInTheDocument();
  });
});

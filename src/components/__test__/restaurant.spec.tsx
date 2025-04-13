import { render, screen } from "@testing-library/react";
import { Restaurant } from "../restaurant";
import { BrowserRouter as Router } from "react-router-dom";

const restaurantProps = {
  id: "1",
  coverImg: "testImg",
  name: "test",
};

describe("<Restaurant />", () => {
  it("should render OK with props", () => {
    render(
      <Router>
        <Restaurant {...restaurantProps} />
      </Router>
    );
    expect(screen.getByRole("link")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      `/restaurant/${restaurantProps.id}`
    );
    expect(screen.getByText(restaurantProps.name)).toBeInTheDocument();
  });
});

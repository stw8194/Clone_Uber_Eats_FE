import { render, screen } from "@testing-library/react";
import { NotFound } from "../404";
import { BrowserRouter as Router } from "react-router-dom";

describe("<NotFound />", () => {
  it("should render OK", () => {
    render(
      <Router>
        <NotFound />
      </Router>
    );
    expect(document.title).toBe("Not Found | CUber Eats");
  });
});

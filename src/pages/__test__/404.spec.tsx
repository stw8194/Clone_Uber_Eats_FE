import { render } from "../../test-utils";
import { NotFound } from "../404";
describe("<NotFound />", () => {
  it("should render OK", () => {
    render(<NotFound />);
    expect(document.title).toBe("Not Found | CUber Eats");
  });
});

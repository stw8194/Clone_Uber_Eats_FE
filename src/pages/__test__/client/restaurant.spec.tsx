import { createMockClient } from "mock-apollo-client";
import { render, screen, waitFor } from "../../../test-utils";
import { Restaurant, RESTAURANT_QUERY } from "../../client/restaurant";

const restaurantQueryResults = {
  data: {
    restaurant: {
      restaurant: {
        id: 1,
        name: "testRestaurant",
        coverImg: "testCoverImg",
        category: {
          name: "testCategory",
        },
        address: "testAddress",
        isPromoted: true,
      },
    },
  },
};

describe("<Restaurant />", () => {
  it("should render OK", async () => {
    const mockedClient = createMockClient();
    const mockedQueryResponse = jest.fn().mockResolvedValue({
      ...restaurantQueryResults,
    });
    mockedClient.setRequestHandler(RESTAURANT_QUERY, mockedQueryResponse);
    render(<Restaurant />, { client: mockedClient });

    await waitFor(() => {
      expect(document.title).toBe(
        `${restaurantQueryResults.data.restaurant.restaurant.name} | Cuber Eats`
      );
    });
  });

  it("should display restaurant name and image", async () => {
    const mockedClient = createMockClient();
    const mockedQueryResponse = jest.fn().mockResolvedValue({
      ...restaurantQueryResults,
    });
    mockedClient.setRequestHandler(RESTAURANT_QUERY, mockedQueryResponse);
    render(<Restaurant />, { client: mockedClient });

    await waitFor(() => {
      expect(
        screen.getByText(restaurantQueryResults.data.restaurant.restaurant.name)
      ).toBeInTheDocument();
    });
    const backgroundImage = screen.getByText(
      restaurantQueryResults.data.restaurant.restaurant.name
    ).previousSibling as HTMLElement;
    expect(backgroundImage.style.backgroundImage).toBe(
      `url(${restaurantQueryResults.data.restaurant.restaurant.coverImg})`
    );
  });
});

import { createMockClient } from "mock-apollo-client";
import { render, screen, waitFor } from "../../../test-utils";
import { Restaurants, RESTAURANTS_QUERY } from "../../client/restaurants";
import userEvent from "@testing-library/user-event";
import { Restaurant } from "../../../components/restaurant";
import { ShowMoreButton } from "../../../components/showmore-button";

const mockPush = jest.fn();

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useHistory: () => {
      return {
        push: mockPush,
      };
    },
  };
});

jest.mock("../../../components/restaurant", () => ({
  Restaurant: jest.fn(() => <span>restaurant-component</span>),
}));

jest.mock("../../../components/showmore-button", () => ({
  ShowMoreButton: jest.fn(() => <span>showmore-button-component</span>),
}));

const restaurantsQueryResults = {
  data: {
    allCategories: {
      ok: true,
      error: null,
      categories: [
        {
          id: 1,
          name: "testCategory1",
          coverImg: "testCoverImg1",
          slug: "testSlug1",
          restaurantCount: 1,
        },
        {
          id: 2,
          name: "testCategory2",
          coverImg: "testCoverImg2",
          slug: "testSlug2",
          restaurantCount: 1,
        },
      ],
    },
    restaurants: {
      totalPages: 1,
      totalResults: 2,
      results: [
        {
          id: 1,
          name: "testRestaurant1",
          coverImg: "testCoverImg1",
          category: {
            name: "testCategory1",
          },
          address: "testAddress1",
          isPromoted: false,
        },
        {
          id: 2,
          name: "testRestaurant2",
          coverImg: "testCoverImg2",
          category: {
            name: "testCategory2",
          },
          address: "testAddress2",
          isPromoted: false,
        },
      ],
    },
  },
};

describe("<Restaurants />", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should render OK", async () => {
    const mockedClient = createMockClient();
    const mockedQueryResponse = jest.fn().mockResolvedValue({
      ...restaurantsQueryResults,
    });
    mockedClient.setRequestHandler(RESTAURANTS_QUERY, mockedQueryResponse);
    render(<Restaurants />, { client: mockedClient });

    await waitFor(() => {
      expect(document.title).toBe("Home | CUber Eats");
    });
  });

  it("should not search with inputted term shorter than 2 letters", async () => {
    const mockedClient = createMockClient();
    const mockedQueryResponse = jest.fn().mockResolvedValue({
      ...restaurantsQueryResults,
    });
    mockedClient.setRequestHandler(RESTAURANTS_QUERY, mockedQueryResponse);
    render(<Restaurants />, { client: mockedClient });

    const search = screen.getByPlaceholderText("Search restaurants...");
    userEvent.type(search, "p{enter}");
    await waitFor(() => {
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  it("should search with inputted term", async () => {
    const mockedClient = createMockClient();
    const mockedQueryResponse = jest.fn().mockResolvedValue({
      ...restaurantsQueryResults,
    });
    mockedClient.setRequestHandler(RESTAURANTS_QUERY, mockedQueryResponse);
    render(<Restaurants />, { client: mockedClient });

    const search = screen.getByPlaceholderText("Search restaurants...");
    userEvent.type(search, "pizza{enter}");
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith({
        pathname: "/search",
        search: "term=pizza",
      });
    });
  });

  it("should display all category img and name", async () => {
    const mockedClient = createMockClient();
    const mockedQueryResponse = jest.fn().mockResolvedValue({
      ...restaurantsQueryResults,
    });
    mockedClient.setRequestHandler(RESTAURANTS_QUERY, mockedQueryResponse);
    render(<Restaurants />, { client: mockedClient });

    await waitFor(() => {
      expect(
        screen.getByText(
          restaurantsQueryResults.data.allCategories.categories[0].name
        )
      ).toHaveStyle({
        backgroundImage: `url${restaurantsQueryResults.data.allCategories.categories[0].id}`,
      });
    });
    expect(
      screen.getByText(
        restaurantsQueryResults.data.allCategories.categories[0].name
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        restaurantsQueryResults.data.allCategories.categories[1].name
      )
    ).toHaveStyle({
      backgroundImage: `url${restaurantsQueryResults.data.allCategories.categories[1].id}`,
    });
    expect(
      screen.getByText(
        restaurantsQueryResults.data.allCategories.categories[1].name
      )
    ).toBeInTheDocument();
  });

  it("should call component with proper prop", async () => {
    const mockedClient = createMockClient();
    const mockedQueryResponse = jest.fn().mockResolvedValue({
      ...restaurantsQueryResults,
    });
    mockedClient.setRequestHandler(RESTAURANTS_QUERY, mockedQueryResponse);
    render(<Restaurants />, { client: mockedClient });

    await waitFor(() => {
      expect(Restaurant).toHaveBeenCalledTimes(2);
    });
    expect(Restaurant).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        id: restaurantsQueryResults.data.restaurants.results[0].id + "",
        coverImg: restaurantsQueryResults.data.restaurants.results[0].coverImg,
        name: restaurantsQueryResults.data.restaurants.results[0].name,
      }),
      undefined
    );
    expect(Restaurant).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        id: restaurantsQueryResults.data.restaurants.results[1].id + "",
        coverImg: restaurantsQueryResults.data.restaurants.results[1].coverImg,
        name: restaurantsQueryResults.data.restaurants.results[1].name,
      }),
      undefined
    );
    expect(ShowMoreButton).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        totalPages: 1,
        onClick: expect.any(Function),
      }),
      undefined
    );
  });
});

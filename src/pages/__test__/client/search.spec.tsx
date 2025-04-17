import { createMockClient } from "mock-apollo-client";
import { render, waitFor } from "../../../test-utils";
import { Search, SEARCH_RESTAURANT_QUERY } from "../../client/search";
import { Restaurant } from "../../../components/restaurant";
import { ShowMoreButton } from "../../../components/showmore-button";

const mockReplace = jest.fn();

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useLocation: () => {
      return {
        search: "/search?term=testRestaurant",
      };
    },
    useHistory: () => {
      return {
        replace: mockReplace,
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

const searchRestaurantQueryResults = {
  data: {
    searchRestaurant: {
      totalPages: 1,
      totalResults: 1,
      restaurants: [
        {
          id: 1,
          name: "testRestaurant1",
          coverImg: "testCoverImg1",
          category: {
            name: "testCategory1",
          },
          address: "testAddress1",
          isPromoted: true,
        },
        {
          id: 2,
          name: "testRestaurant2",
          coverImg: "testCoverImg2",
          category: {
            name: "testCategory2",
          },
          address: "testAddress2",
          isPromoted: true,
        },
        {
          id: 3,
          name: "testRestaurant3",
          coverImg: "testCoverImg3",
          category: {
            name: "testCategory3",
          },
          address: "testAddress3",
          isPromoted: true,
        },
        {
          id: 4,
          name: "testRestaurant4",
          coverImg: "testCoverImg4",
          category: {
            name: "testCategory4",
          },
          address: "testAddress4",
          isPromoted: true,
        },
      ],
    },
  },
};

describe("<Search />", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should render OK", async () => {
    const mockedClient = createMockClient();
    const mockedQueryResponse = jest.fn().mockResolvedValue({
      ...searchRestaurantQueryResults,
    });
    mockedClient.setRequestHandler(
      SEARCH_RESTAURANT_QUERY,
      mockedQueryResponse
    );
    render(<Search />, { client: mockedClient });

    await waitFor(() => {
      expect(document.title).toBe("Search | CUber Eats");
    });
  });

  it("should call component with proper prop", async () => {
    const mockedClient = createMockClient();
    const mockedQueryResponse = jest.fn().mockResolvedValue({
      ...searchRestaurantQueryResults,
    });
    mockedClient.setRequestHandler(
      SEARCH_RESTAURANT_QUERY,
      mockedQueryResponse
    );
    render(<Search />, { client: mockedClient });

    await waitFor(() => {
      expect(Restaurant).toHaveBeenCalledTimes(4);
    });
    for (let i = 0; i < 4; i++) {
      expect(Restaurant).toHaveBeenNthCalledWith(
        i + 1,
        expect.objectContaining({
          id:
            searchRestaurantQueryResults.data.searchRestaurant.restaurants[i]
              .id + "",
          coverImg:
            searchRestaurantQueryResults.data.searchRestaurant.restaurants[i]
              .coverImg,
          name: searchRestaurantQueryResults.data.searchRestaurant.restaurants[
            i
          ].name,
        }),
        undefined
      );
    }
    expect(ShowMoreButton).toHaveBeenCalledWith(
      expect.objectContaining({
        page: 1,
        totalPages: 1,
        onClick: expect.any(Function),
      }),
      undefined
    );
  });

  it("should redirect to home if searchTerm not exist", () => {
    jest.spyOn(require("react-router-dom"), "useLocation").mockReturnValue({
      search: "",
    });
    const mockedClient = createMockClient();
    const mockedQueryResponse = jest.fn().mockResolvedValue({
      ...searchRestaurantQueryResults,
    });
    mockedClient.setRequestHandler(
      SEARCH_RESTAURANT_QUERY,
      mockedQueryResponse
    );
    render(<Search />, { client: mockedClient });

    expect(mockReplace).toHaveBeenCalledWith("/");
  });
});

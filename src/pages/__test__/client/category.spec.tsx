import { createMockClient } from "mock-apollo-client";
import { render, screen, waitFor } from "../../../test-utils";
import { Category, CATEGORY_QUERY } from "../../client/category";
import { Restaurant } from "../../../components/restaurant";
import { ShowMoreButton } from "../../../components/showmore-button";

jest.mock("../../../components/restaurant", () => ({
  Restaurant: jest.fn(() => <span>restaurant-component</span>),
}));

jest.mock("../../../components/showmore-button", () => ({
  ShowMoreButton: jest.fn(() => <span>showmore-button-component</span>),
}));

jest.mock("react-router-dom", () => {
  const realModule = jest.requireActual("react-router-dom");
  return {
    ...realModule,
    useParams: () => {
      return { slug: "testSlug" };
    },
  };
});

const mockCategoryQueryResults = {
  data: {
    category: {
      totalPages: 1,
      totalResults: 1,
      restaurants: [
        {
          id: 1,
          name: "restaurant1",
          coverImg: "testRestaurantImg",
          category: {
            name: "testCategory",
          },
          address: "address",
          isPromoted: false,
        },
        {
          id: 2,
          name: "restaurant2",
          coverImg: "testRestaurantImg",
          category: {
            name: "testCategory",
          },
          address: "address",
          isPromoted: false,
        },
      ],
      category: {
        id: 1,
        name: "testCategory",
        coverImg: "testCategoryImg",
        slug: "testSlug",
        restaurantCount: 1,
      },
    },
  },
};

describe("<Category />", () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should render OK with query", async () => {
    const mockedClient = createMockClient();
    const mockedQueryResponse = jest
      .fn()
      .mockResolvedValue({ ...mockCategoryQueryResults });
    mockedClient.setRequestHandler(CATEGORY_QUERY, mockedQueryResponse);
    render(<Category />, { client: mockedClient });

    await waitFor(() => {
      expect(mockedQueryResponse).toHaveBeenCalledWith({
        categoryInput: {
          page: 1,
          slug: "testSlug",
        },
      });
    });
    expect(document.title).toBe("Category | CUber Eats");
  });

  it("should display category name and image", async () => {
    const mockedClient = createMockClient();
    const mockedQueryResponse = jest.fn().mockResolvedValue({
      ...mockCategoryQueryResults,
    });
    mockedClient.setRequestHandler(CATEGORY_QUERY, mockedQueryResponse);
    render(<Category />, { client: mockedClient });

    await waitFor(() => {
      expect(screen.getByText("testCategory")).toBeInTheDocument();
    });
    const backgroundImage = screen.getByText("testCategory")
      .nextSibling as HTMLElement;
    expect(backgroundImage.style.backgroundImage).toBe("url(testCategoryImg)");
  });

  it("should call component with proper prop", async () => {
    const mockedClient = createMockClient();
    const mockedQueryResponse = jest
      .fn()
      .mockResolvedValue({ ...mockCategoryQueryResults });
    mockedClient.setRequestHandler(CATEGORY_QUERY, mockedQueryResponse);
    render(<Category />, { client: mockedClient });

    await waitFor(() => {
      expect(Restaurant).toHaveBeenCalledTimes(2);
    });
    expect(Restaurant).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        id: "1",
        coverImg: "testRestaurantImg",
        name: "restaurant1",
      }),
      undefined
    );
    expect(Restaurant).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        id: "2",
        coverImg: "testRestaurantImg",
        name: "restaurant2",
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

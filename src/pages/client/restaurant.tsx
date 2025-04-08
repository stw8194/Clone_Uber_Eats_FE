import { useQuery } from "@apollo/client";
import { graphql } from "../../gql";
import {
  RestaurantsPageQuery,
  RestaurantsPageQueryVariables,
} from "../../gql/graphql";

const RESTAURANTS_QUERY = graphql(`
  query RestaurantsPage($restaurantsInput: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }

    restaurants(input: $restaurantsInput) {
      totalPages
      totalResults
      results {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`);

export const Restaurants = () => {
  const { data, loading } = useQuery<
    RestaurantsPageQuery,
    RestaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      restaurantsInput: {
        page: 1,
        limit: 10,
      },
    },
  });

  return (
    <div>
      <form className="bg-gray-800 w-full py-40 flex items-center justify-center">
        <input
          type="Search"
          className="input rounded-md border-0 bg-white w-1/4"
          placeholder="Search restaurants..."
        />
      </form>
      {!loading && (
        <div className="max-w-screen-xl mx-auto mt-8">
          <div className="flex justify-around max-w-sm mx-auto">
            {data?.allCategories.categories?.map((category) => (
              <div className="flex flex-col group items-center cursor-pointer">
                <div
                  className="w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full"
                  style={{ backgroundImage: `url(${category.coverImg})` }}
                ></div>
                <span className="mt-1 text-sm font-medium">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
          <div className="grid mt-10 grid-cols-4 gap-x-4 gap-y-8">
            {data?.restaurants.results?.map((restaurant) => (
              <div>
                <div
                  className="bg-cover bg-center mb-2 rounded-xl py-16"
                  style={{ backgroundImage: `url(${restaurant.coverImg})` }}
                ></div>
                <h3 className="text-xl font-medium cursor-pointer">
                  {restaurant.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

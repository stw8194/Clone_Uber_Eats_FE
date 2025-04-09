import { useQuery } from "@apollo/client";
import { graphql } from "../../gql";
import {
  RestaurantsPageQuery,
  RestaurantsPageQueryVariables,
} from "../../gql/graphql";
import { useState } from "react";
import { Restaurant } from "../../components/restaurant";

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
  type RestaurantFromQuery = NonNullable<
    NonNullable<RestaurantsPageQuery["restaurants"]["results"]>[number]
  >;

  const [allRestaurants, setAllRestaurants] = useState<RestaurantFromQuery[]>(
    []
  );
  const [page, setPage] = useState(1);

  const onCompleted = (data: RestaurantsPageQuery) => {
    const {
      restaurants: { results },
    } = data;
    if (results) {
      setAllRestaurants((prev) => [...prev, ...results]);
    }
  };

  const { data, loading } = useQuery<
    RestaurantsPageQuery,
    RestaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, {
    variables: {
      restaurantsInput: {
        page,
        limit: 2,
      },
    },
    onCompleted,
  });

  const onClick = () => {
    setPage((current) => current + 1);
  };

  return (
    <div>
      <form className="bg-gray-800 w-full py-40 flex items-center justify-center">
        <input
          type="Search"
          className="input rounded-md border-0 bg-white w-1/4"
          placeholder="Search restaurants..."
        />
      </form>
      <div className="max-w-screen-xl pb-20 mx-auto mt-8">
        <div className="flex justify-around max-w-sm mx-auto">
          {data?.allCategories.categories?.map((category) => (
            <div
              key={category.id}
              className="flex flex-col group items-center cursor-pointer"
            >
              <div
                className="w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full"
                style={{ backgroundImage: `url(${category.coverImg})` }}
              ></div>
              <span className="mt-1 text-sm font-medium">{category.name}</span>
            </div>
          ))}
        </div>

        <div className="grid mt-10 grid-cols-4 gap-x-4 gap-y-8">
          {allRestaurants.map((restaurant) => (
            <Restaurant
              key={restaurant.id}
              id={restaurant.id + ""}
              coverImg={restaurant.coverImg}
              name={restaurant.name}
            />
          ))}
        </div>

        <div className="flex justify-center items-center mt-16">
          {page !== data?.restaurants.totalPages && (
            <button
              className={`inline-flex items-center justify-center my-3 py-3 px-4 text-lg font-semibold focus:outline-none rounded-lg text-white transition-colors ${
                data?.restaurants.totalPages !== allRestaurants.length
                  ? "bg-black hover:bg-gray-900"
                  : "bg-gray-300 pointer-events-none"
              }`}
              onClick={onClick}
            >
              Show more
            </button>
          )}
          {loading && (
            <div className="flex justify-center mt-4 text-gray-500">
              Loading...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import { useQuery } from "@apollo/client";
import { graphql } from "../../gql";
import {
  RestaurantsPageQuery,
  RestaurantsPageQueryVariables,
} from "../../gql/graphql";
import { useState } from "react";
import { Restaurant } from "../../components/restaurant";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { ShowMoreButton } from "../../components/showmore-button";

interface ISearchForm {
  searchTerm: string;
}

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
  const onClick = () => {
    setPage((current) => current + 1);
  };

  const onCompleted = (data: RestaurantsPageQuery) => {
    const {
      restaurants: { results },
    } = data;
    if (results) {
      setAllRestaurants((prev) => [...prev, ...results]);
    }
  };

  const { data: restaurantsQueryResults, loading } = useQuery<
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

  const { register, handleSubmit, getValues } = useForm<ISearchForm>();
  const history = useHistory();
  const onSearchSubmit = () => {
    const { searchTerm } = getValues();
    history.push({
      pathname: "/search",
      search: `term=${searchTerm}`,
    });
  };

  return (
    <div>
      <title>Home | CUber Eats</title>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 w-full py-40 flex items-center justify-center"
      >
        <input
          {...register("searchTerm", { required: true, min: 2 })}
          type="Search"
          className="input rounded-md border-0 bg-white w-3/4 md:w-1/4"
          placeholder="Search restaurants..."
        />
      </form>
      {allRestaurants && (
        <div className="max-w-screen-xl pb-20 mx-auto mt-8">
          <div className="flex justify-around max-w-sm mx-auto">
            {restaurantsQueryResults?.allCategories.categories?.map(
              (category) => (
                <Link to={`/category/${category.slug}`}>
                  <div
                    key={category.id}
                    className="flex flex-col group items-center cursor-pointer"
                  >
                    <div
                      className="w-16 h-16 bg-cover group-hover:bg-gray-100 rounded-full"
                      style={{ backgroundImage: `url(${category.coverImg})` }}
                    ></div>
                    <span className="mt-1 text-sm font-medium">
                      {category.name}
                    </span>
                  </div>
                </Link>
              )
            )}
          </div>
          <div className="grid mt-10 md:grid-cols-4 gap-x-4 gap-y-8">
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
            {restaurantsQueryResults?.restaurants.totalPages && (
              <ShowMoreButton
                page={page}
                totalPages={restaurantsQueryResults.restaurants.totalPages}
                onClick={onClick}
              />
            )}
            {loading && (
              <div className="flex justify-center mt-4 text-gray-500">
                Loading...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

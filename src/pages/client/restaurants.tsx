import no_restuarant from "../../images/no_restuarant.svg";
import { useLazyQuery } from "@apollo/client";
import { graphql } from "../../gql";
import { useEffect, useState } from "react";
import { Restaurant } from "../../components/restaurant";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import { ShowMoreButton } from "../../components/showmore-button";
import {
  RestaurantsNearbyPagesQuery,
  RestaurantsNearbyPagesQueryVariables,
} from "../../gql/graphql";
import { useMe } from "../../hooks/useMe";

interface ISearchForm {
  searchTerm: string;
}

export const RESTAURANTS_NEARBY_QUERY = graphql(`
  query RestaurantsNearbyPages(
    $restaurantsNearbyInput: RestaurantsNearbyInput!
  ) {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }

    restaurantsNearby(input: $restaurantsNearbyInput) {
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
`);

export const Restaurants = () => {
  type RestaurantFromQuery = NonNullable<
    NonNullable<
      RestaurantsNearbyPagesQuery["restaurantsNearby"]["restaurants"]
    >[number]
  >;
  const { data } = useMe();

  const [allRestaurants, setAllRestaurants] = useState<RestaurantFromQuery[]>(
    []
  );
  const [page, setPage] = useState(1);
  const onClick = () => {
    setPage((current) => current + 1);
  };

  const onCompleted = (data: RestaurantsNearbyPagesQuery) => {
    const {
      restaurantsNearby: { restaurants },
    } = data;
    if (restaurants) {
      setAllRestaurants((prev) => [...prev, ...restaurants]);
    }
  };

  const [
    restaurantsNearbyQuery,
    { data: restaurantsNearbyQueryResults, loading },
  ] = useLazyQuery<
    RestaurantsNearbyPagesQuery,
    RestaurantsNearbyPagesQueryVariables
  >(RESTAURANTS_NEARBY_QUERY, {
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

  useEffect(() => {
    if (data && data.me.selectedAddress) {
      restaurantsNearbyQuery({
        variables: {
          restaurantsNearbyInput: {
            page,
            lat: data.me.selectedAddress?.lat,
            lng: data.me.selectedAddress?.lng,
          },
        },
      });
    }
    setAllRestaurants([]);
  }, [data]);

  return (
    <div>
      <title>Home | CUber Eats</title>
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-gray-800 w-full py-40 flex items-center justify-center"
      >
        <input
          {...register("searchTerm", { required: true, minLength: 2 })}
          type="Search"
          className="input rounded-md border-0 bg-white w-3/4 md:w-1/4"
          placeholder="Search restaurants..."
        />
      </form>
      {allRestaurants && (
        <div className="container pb-20 mt-8">
          <div className="flex justify-around max-w-sm mx-auto">
            {restaurantsNearbyQueryResults?.allCategories.categories?.map(
              (category) => (
                <Link key={category.id} to={`/category/${category.slug}`}>
                  <div className="flex flex-col group items-center cursor-pointer">
                    <div
                      data-testid={category.id}
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
          {allRestaurants.length !== 0 ? (
            <>
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
                {restaurantsNearbyQueryResults?.restaurantsNearby
                  .totalPages && (
                  <ShowMoreButton
                    page={page}
                    totalPages={
                      restaurantsNearbyQueryResults.restaurantsNearby.totalPages
                    }
                    onClick={onClick}
                  />
                )}
                {loading && (
                  <div className="flex justify-center mt-4 text-gray-500">
                    Loading...
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex w-full h-full items-center justify-center">
              <img src={no_restuarant} alt="Empty!" className="w-full mt-48" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

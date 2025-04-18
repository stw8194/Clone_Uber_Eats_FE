import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { graphql } from "../../gql";
import { useLazyQuery } from "@apollo/client";
import {
  SearchRestaurantQuery,
  SearchRestaurantQueryVariables,
} from "../../gql/graphql";
import { Restaurant } from "../../components/restaurant";
import { ShowMoreButton } from "../../components/showmore-button";

export const SEARCH_RESTAURANT_QUERY = graphql(`
  query SearchRestaurant($searchRestaurantInput: SearchRestaurantInput!) {
    searchRestaurant(input: $searchRestaurantInput) {
      totalPages
      totalResults
      restaurants {
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

export const Search = () => {
  type RestaurantFromQuery = NonNullable<
    NonNullable<
      SearchRestaurantQuery["searchRestaurant"]["restaurants"]
    >[number]
  >;

  const [allRestaurants, setAllRestaurants] = useState<RestaurantFromQuery[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const onClick = () => {
    setPage((current) => current + 1);
  };

  const onCompleted = (data: SearchRestaurantQuery) => {
    const {
      searchRestaurant: { restaurants },
    } = data;
    if (restaurants) {
      setAllRestaurants((prev) => [...prev, ...restaurants]);
    }
  };
  const location = useLocation();
  const history = useHistory();
  const [searchRestaurantQuery, { data: searchRestaurantQueryResults }] =
    useLazyQuery<SearchRestaurantQuery, SearchRestaurantQueryVariables>(
      SEARCH_RESTAURANT_QUERY
    );
  useEffect(() => {
    const [_, searchTerm] = location.search.split("?term=");
    if (query === searchTerm) return;
    setQuery(searchTerm);
    if (!searchTerm) {
      return history.replace("/");
    }
    searchRestaurantQuery({
      variables: {
        searchRestaurantInput: {
          page,
          query: searchTerm,
        },
      },
      onCompleted,
    });
  }, [history, location, query, page, searchRestaurantQuery]);
  return (
    <div className="container pb-20 mt-8">
      <title>Search | CUber Eats</title>
      <div className="px-16 text-xl font-semibold">{`${searchRestaurantQueryResults?.searchRestaurant.totalResults} results for "${query}"`}</div>
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
      {searchRestaurantQueryResults?.searchRestaurant.totalPages && (
        <ShowMoreButton
          page={page}
          totalPages={searchRestaurantQueryResults.searchRestaurant.totalPages}
          onClick={onClick}
        />
      )}
    </div>
  );
};

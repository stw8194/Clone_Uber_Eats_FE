import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { graphql } from "../../gql";
import { useLazyQuery } from "@apollo/client";
import {
  SearchRestaurantQuery,
  SearchRestaurantQueryVariables,
} from "../../gql/graphql";

const SEARCH_RESTAURANT_QUERY = graphql(`
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
  const [page, setPage] = useState(1);
  const location = useLocation();
  const history = useHistory();
  const [
    searchRestaurantQuery,
    { data: searchRestaurantQueryResults, loading, called },
  ] = useLazyQuery<SearchRestaurantQuery, SearchRestaurantQueryVariables>(
    SEARCH_RESTAURANT_QUERY
  );
  useEffect(() => {
    const [_, searchTerm] = location.search.split("?term=");
    if (!searchTerm) {
      return history.replace("/");
    }
    searchRestaurantQuery({
      variables: {
        searchRestaurantInput: {
          page,
          limit: 2,
          query: searchTerm,
        },
      },
    });
  }, [history, location]);
  return (
    <div>
      <title>Search | CUber Eats</title>
      {searchRestaurantQueryResults?.searchRestaurant.restaurants?.map(
        (restaurant) => (
          <div key={restaurant.id}>{restaurant.coverImg}</div>
        )
      )}
    </div>
  );
};

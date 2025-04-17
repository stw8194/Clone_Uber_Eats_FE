import { useParams } from "react-router-dom";
import { graphql } from "../../gql";
import { useQuery } from "@apollo/client";
import { RestaurantQuery, RestaurantQueryVariables } from "../../gql/graphql";

export const RESTAURANT_QUERY = graphql(`
  query Restaurant($restaurantId: Float!) {
    restaurant(restaurantId: $restaurantId) {
      restaurant {
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

interface IRestaurantParams {
  id: string;
}

export const Restaurant = () => {
  const { id } = useParams<IRestaurantParams>();
  const { data: restaurantQueryResults } = useQuery<
    RestaurantQuery,
    RestaurantQueryVariables
  >(RESTAURANT_QUERY, {
    variables: {
      restaurantId: +id,
    },
  });

  return (
    <div className="flex flex-col px-10 max-w-7xl h-64 items-center justify-center mx-auto">
      <title>
        {restaurantQueryResults?.restaurant.restaurant?.name + " | Cuber Eats"}
      </title>
      <div
        className="w-full bg-gray-500 h-full mb-3 bg-cover bg-center shrink-0 overflow-hidden rounded-xl"
        style={{
          backgroundImage: `url(${restaurantQueryResults?.restaurant.restaurant?.coverImg})`,
        }}
      ></div>
      <span className="w-full text-3xl font-bold">
        {restaurantQueryResults?.restaurant.restaurant?.name}
      </span>
    </div>
  );
};

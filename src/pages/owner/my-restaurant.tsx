import { useParams } from "react-router-dom";
import { graphql } from "../../gql";
import { useQuery } from "@apollo/client";
import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
} from "../../gql/graphql";
import { Restaurant } from "../../components/restaurant";

const MY_RESTAURANT_QUERY = graphql(`
  query MyRestaurant($restaurantId: Float!) {
    myRestaurant(restaurantId: $restaurantId) {
      ok
      error
      restaurant {
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
        promotedUntil
      }
    }
  }
`);

interface IMyRestaurantParams {
  id: string;
}

export const MyRestaurant = () => {
  const { id } = useParams<IMyRestaurantParams>();
  console.log(id);
  const { data: myRestaurantQueryResults } = useQuery<
    MyRestaurantQuery,
    MyRestaurantQueryVariables
  >(MY_RESTAURANT_QUERY, {
    variables: {
      restaurantId: +id,
    },
  });
  console.log(myRestaurantQueryResults);

  return (
    <div className="container">
      {myRestaurantQueryResults?.myRestaurant.restaurant && (
        <Restaurant
          id={myRestaurantQueryResults?.myRestaurant.restaurant.id + ""}
          coverImg={myRestaurantQueryResults?.myRestaurant.restaurant.coverImg}
          name={myRestaurantQueryResults?.myRestaurant.restaurant.name}
        />
      )}
    </div>
  );
};

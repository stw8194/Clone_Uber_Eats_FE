import { useQuery } from "@apollo/client";
import { graphql } from "../../gql";
import {
  MyRestaurantsQuery,
  MyRestaurantsQueryVariables,
} from "../../gql/graphql";
import { Link } from "react-router-dom";
import { Restaurant } from "../../components/restaurant";

export const MY_RESTAURANTS_QUERY = graphql(`
  query MyRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
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

export const MyRestaurants = () => {
  const { data: myRestaurantsQueryResults } = useQuery<
    MyRestaurantsQuery,
    MyRestaurantsQueryVariables
  >(MY_RESTAURANTS_QUERY);

  return (
    <div>
      <title>My Restaurants | CUber Eats</title>
      <div className="container mt-32">
        <h2 className="text-4xl font-medium mb-10">My Restaurants</h2>
        {myRestaurantsQueryResults?.myRestaurants.ok &&
          (myRestaurantsQueryResults.myRestaurants.restaurants?.length === 0 ? (
            <>
              <h4 className="text-xl mb-5">No restaurants here.</h4>
              <Link className="link" to="/add-restaurant">
                Create one! &rarr;
              </Link>
            </>
          ) : (
            <div className="grid mt-10 md:grid-cols-4 gap-x-4 gap-y-8">
              {myRestaurantsQueryResults?.myRestaurants.restaurants?.map(
                (restaurant) => (
                  <Restaurant
                    key={restaurant.id}
                    id={restaurant.id + ""}
                    coverImg={restaurant.coverImg}
                    name={restaurant.name}
                  />
                )
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

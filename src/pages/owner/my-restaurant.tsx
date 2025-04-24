import { Link, useParams } from "react-router-dom";
import { graphql } from "../../gql";
import { useQuery } from "@apollo/client";
import {
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
} from "../../gql/graphql";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faPercent } from "@fortawesome/free-solid-svg-icons";
import { Dish } from "../../components/dish";

export const MY_RESTAURANT_QUERY = graphql(`
  query MyRestaurant($restaurantId: Float!) {
    myRestaurant(restaurantId: $restaurantId) {
      ok
      error
      restaurant {
        ...RestaurantParts
        promotedUntil
        menu {
          ...DishParts
        }
      }
    }
  }
`);

interface IMyRestaurantParams {
  id: string;
}

export const MyRestaurant = () => {
  const { id } = useParams<IMyRestaurantParams>();
  const { data: myRestaurantQueryResults } = useQuery<
    MyRestaurantQuery,
    MyRestaurantQueryVariables
  >(MY_RESTAURANT_QUERY, {
    variables: {
      restaurantId: +id,
    },
  });

  return (
    <div className="container flex flex-col px-10 max-w-7xl space-y-6 items-center justify-center">
      <title>
        {myRestaurantQueryResults?.myRestaurant.restaurant?.name +
          " | CUber Eats"}
      </title>
      <div className="w-full bg-gray-500 h-64 rounded-xl overflow-hidden relative">
        <div
          className="w-full h-full bg-cover overflow-hidden bg-center shrink-0 rounded-xl"
          data-testid={myRestaurantQueryResults?.myRestaurant.restaurant?.id}
          style={{
            backgroundImage: `url(${myRestaurantQueryResults?.myRestaurant.restaurant?.coverImg})`,
          }}
        >
          <div className="flex flex-col items-end">
            <div className="relative w-10 h-10 mx-4 mt-4 overflow-visible">
              <Link
                className="group absolute right-0 top-0 h-10 w-10 gap-2 hover:bg-white hover:w-35 bg-white/30 flex items-center justify-center rounded-full transition-all"
                to={`/edit-restaurant/${id}`}
              >
                <FontAwesomeIcon icon={faPenToSquare} />
                <span className="hidden group-hover:flex transition-all whitespace-nowrap text-lg font-semibold">
                  Edit
                </span>
              </Link>
            </div>
            <div className="relative w-10 h-10 mx-4 my-3 overflow-visible">
              <Link
                className="group absolute right-0 top-0 h-10 w-10 gap-2 hover:bg-white hover:w-35 bg-white/30 flex items-center justify-center rounded-full transition-all"
                to={"/promotion"}
              >
                <FontAwesomeIcon icon={faPercent} />
                <span className="hidden group-hover:flex overflow-hidden transition-all whitespace-nowrap text-lg font-semibold">
                  Promotion
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex items-center space-y-5 justify-between">
        <span className="text-4xl mx-4 font-bold">
          {myRestaurantQueryResults?.myRestaurant.restaurant?.name}
        </span>
        <div>
          <div>
            <Link
              className="text-white mx-4 bg-gray-800 rounded-lg px-4 py-2"
              to={`/restaurant/${id}/add-dish`}
            >
              Add Dish
            </Link>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 w-full h-80">
        {myRestaurantQueryResults?.myRestaurant.restaurant?.menu.length ===
        0 ? (
          <h1 className="text-9xl">EMPTY</h1>
        ) : (
          myRestaurantQueryResults?.myRestaurant.restaurant?.menu.map(
            (menu) => {
              return (
                <Dish
                  key={menu.id}
                  id={menu.id + ""}
                  name={menu.name}
                  price={menu.price}
                  description={menu.description}
                  photo={menu.photo}
                />
              );
            }
          )
        )}
      </div>
      <div>
        {myRestaurantQueryResults?.myRestaurant.restaurant?.menu.length ===
        0 ? (
          <h4 className="text-xl mb-5">Please upload a dish</h4>
        ) : null}
      </div>
    </div>
  );
};

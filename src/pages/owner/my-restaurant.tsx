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
import {
  VictoryAxis,
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from "victory";
import { useState } from "react";
import { NewOrders } from "../../components/modal/new_orders";

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
        orders {
          id
          createdAt
          total
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
  const [salesStatistics, setSalesStatistics] = useState<
    {
      x: string;
      y: number;
    }[]
  >([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onCompleted = (data: MyRestaurantQuery) => {
    const {
      myRestaurant: { restaurant },
    } = data;
    if (restaurant?.orders) {
      const stats = restaurant.orders.reduce((acc, order) => {
        const date = new Date(order.createdAt).toLocaleDateString("ko");
        const exist = acc.find((stat) => stat.x === date);
        if (exist) {
          exist.y += order.total || 0;
        } else {
          acc.push({ x: date, y: order.total || 0 });
        }
        return acc;
      }, [] as { x: string; y: number }[]);
      stats.sort((a, b) => {
        const dateA = new Date(a.x).getTime();
        const dateB = new Date(b.x).getTime();
        return dateA - dateB;
      });
      setSalesStatistics(stats);
    }
  };
  const { data: myRestaurantQueryResults } = useQuery<
    MyRestaurantQuery,
    MyRestaurantQueryVariables
  >(MY_RESTAURANT_QUERY, {
    variables: {
      restaurantId: +id,
    },
    onCompleted,
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
        <div className="items-center">
          <span className="text-4xl mx-4 font-bold">
            {myRestaurantQueryResults?.myRestaurant.restaurant?.name}
          </span>
          <button
            onClick={() => {
              setIsOpen(true);
            }}
            type="button"
            className="text-white mx-2 bg-gray-800 rounded-lg px-4 py-2 inline-flex items-center justify-center"
          >
            Order List
          </button>
        </div>

        <div>
          <div>
            {isOpen && <NewOrders setIsOpen={setIsOpen} />}
            <Link
              className="text-white bg-gray-800 rounded-lg px-4 py-2 inline-flex items-center justify-center"
              to={`/restaurants/${id}/add-dish`}
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
                  id={menu.id}
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
      <div className="mt-20 mb-10">
        <h4 className="text-center text-2xl font-bold">Sales</h4>
        <div className="max-w-md w-full mx-auto"></div>
        <VictoryChart
          theme={VictoryTheme.material}
          height={500}
          width={window.innerWidth}
          domainPadding={50}
          containerComponent={<VictoryVoronoiContainer />}
        >
          <VictoryLine
            labels={({ datum }) => `$${datum.y}`}
            labelComponent={
              <VictoryTooltip
                style={{ fontSize: 15 }}
                renderInPortal
                dy={-40}
              />
            }
            style={{ data: { strokeWidth: 3 } }}
            interpolation={"natural"}
            data={salesStatistics.map((order) => ({
              x: order.x,
              y: order.y,
            }))}
          />
          <VictoryAxis
            style={{ tickLabels: { fontSize: 15 } }}
            tickFormat={(tick) => new Date(tick).toLocaleDateString("ko")}
          />
        </VictoryChart>
      </div>
    </div>
  );
};

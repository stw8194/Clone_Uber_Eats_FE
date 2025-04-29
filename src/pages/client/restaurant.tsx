import { useParams } from "react-router-dom";
import { graphql } from "../../gql";
import { useMutation, useQuery } from "@apollo/client";
import {
  CreateOrderItemInput,
  CreateOrderMutation,
  CreateOrderMutationVariables,
  OrderItemChoiceInputType,
  RestaurantQuery,
  RestaurantQueryVariables,
} from "../../gql/graphql";
import { Dish } from "../../components/dish";
import { useState } from "react";

export const RESTAURANT_QUERY = graphql(`
  query Restaurant($restaurantId: Float!) {
    restaurant(restaurantId: $restaurantId) {
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
      }
    }
  }
`);

export const CREATE_ORDER_MUTATION = graphql(`
  mutation CreateOrder($createOrderInput: CreateOrderInput!) {
    createOrder(input: $createOrderInput) {
      ok
      error
    }
  }
`);

interface IRestaurantParams {
  id: string;
}

export const Restaurant = () => {
  const { id } = useParams<IRestaurantParams>();
  const [orderItems, setOrderItems] = useState<CreateOrderItemInput[]>([]);
  const { data: restaurantQueryResults } = useQuery<
    RestaurantQuery,
    RestaurantQueryVariables
  >(RESTAURANT_QUERY, {
    variables: {
      restaurantId: +id,
    },
  });

  const onCompleted = () => {
    setOrderItems([]);
    window.alert("Order Created!");
  };

  const [createOrderMutation] = useMutation<
    CreateOrderMutation,
    CreateOrderMutationVariables
  >(CREATE_ORDER_MUTATION, { onCompleted });

  const AddItemToOrder = (
    dishId: number,
    options: OrderItemChoiceInputType[]
  ) => {
    setOrderItems((current) => [{ dishId, options }, ...current]);
  };
  const createOrder = () => {
    createOrderMutation({
      variables: {
        createOrderInput: {
          restaurantId: +id,
          items: orderItems.map((orderItem) => ({
            dishId: orderItem.dishId,
            ...(orderItem.options && {
              options: orderItem.options.map(({ name, choice }) => ({
                name,
                ...(choice && { choice }),
              })),
            }),
          })),
        },
      },
    });
  };

  return (
    <div className="container flex flex-col px-10 max-w-7xl space-y-6 items-center justify-center">
      <title>
        {restaurantQueryResults?.restaurant.restaurant?.name + " | CUber Eats"}
      </title>
      <div
        data-testid={restaurantQueryResults?.restaurant.restaurant?.id}
        className="w-full bg-gray-500 h-64 mb-3 bg-cover bg-center shrink-0 overflow-hidden rounded-xl"
        style={{
          backgroundImage: `url(${restaurantQueryResults?.restaurant.restaurant?.coverImg})`,
        }}
      ></div>
      <div className="flex w-full items-center justify-between">
        <span className="w-full pb-2 text-3xl font-bold">
          {restaurantQueryResults?.restaurant.restaurant?.name}
        </span>
        {orderItems.length !== 0 && (
          <span
            onClick={createOrder}
            className="bg-black hover:bg-gray-800 p-2 text-white rounded-lg"
          >
            Checkout
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 w-full h-80">
        {restaurantQueryResults?.restaurant.restaurant?.menu.map((menu) => {
          return (
            <Dish
              key={menu.id}
              id={menu.id}
              name={menu.name}
              price={menu.price}
              description={menu.description}
              photo={menu.photo}
              options={menu.options}
              AddItemToOrder={AddItemToOrder}
            />
          );
        })}
      </div>
    </div>
  );
};

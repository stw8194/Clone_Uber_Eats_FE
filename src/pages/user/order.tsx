import { useParams } from "react-router-dom";
import { graphql } from "../../gql";
import { useQuery } from "@apollo/client";
import {
  GetOrderQuery,
  GetOrderQueryVariables,
  OrderUpdatesSubscription,
} from "../../gql/graphql";
import { useEffect } from "react";

const GET_ORDER_QUERY = graphql(`
  query GetOrder($getOrderInput: GetOrderInput!) {
    getOrder(input: $getOrderInput) {
      ok
      error
      order {
        ...OrderParts
      }
    }
  }
`);

const ORDER_UPDATES_SUBSCRIPTION = graphql(`
  subscription OrderUpdates($orderUpdatesInput: OrderUpdatesInput!) {
    orderUpdates(input: $orderUpdatesInput) {
      ...OrderParts
    }
  }
`);

interface IOrderParams {
  orderId: string;
}

export const Order = () => {
  const { orderId } = useParams<IOrderParams>();
  const { subscribeToMore, data: getOrderQueryResults } = useQuery<
    GetOrderQuery,
    GetOrderQueryVariables
  >(GET_ORDER_QUERY, {
    variables: {
      getOrderInput: {
        id: +orderId,
      },
    },
  });
  useEffect(() => {
    if (getOrderQueryResults?.getOrder.ok) {
      subscribeToMore({
        document: ORDER_UPDATES_SUBSCRIPTION,
        variables: { orderUpdatesInput: { id: +orderId } },
        updateQuery: (
          prev,
          {
            subscriptionData: { data },
          }: { subscriptionData: { data: OrderUpdatesSubscription } }
        ) => {
          if (!data) return prev;
          return {
            getOrder: {
              ...prev.getOrder,
              order: {
                ...data.orderUpdates,
              },
            },
          };
        },
      });
    }
  }, [getOrderQueryResults, orderId, subscribeToMore]);

  return (
    <div className="container mt-32 flex justify-center">
      <title>{`Order #${orderId} | CUber Eats`}</title>
      <div className="border border-gray-800 w-full max-w-screen-sm flex flex-col justify-center">
        <div className="text-white py-5 bg-lime-600 w-full text-center text-xl">
          Order #{orderId}
        </div>
        <div className="py-5 px-8 text-center text-lg grid gap-6">
          <div className="pt-5 flex justify-between">
            <span>Prepared by</span>
            <span>
              {getOrderQueryResults?.getOrder.order?.restaurant?.name}
            </span>
          </div>
          <div className="border-t-2 border-dashed pt-5 border-gray-400 flex justify-between">
            <span>Deliver to</span>
            <span>{getOrderQueryResults?.getOrder.order?.customer?.email}</span>
          </div>
          <div className="border-t-2 border-dashed pt-5 border-gray-400 flex justify-between">
            <span>Driver</span>
            <span>
              {getOrderQueryResults?.getOrder.order?.driver?.email || "Not Yet"}
            </span>
          </div>
          <div className="border-t-2 border-dashed pt-5 border-gray-400 flex justify-between">
            <span>total</span>
            <span>${getOrderQueryResults?.getOrder.order?.total}</span>
          </div>
          <div className="border-t-2 border-dashed pt-5 border-gray-400 flex justify-between font-semibold">
            <span>Status</span>
            <span>{getOrderQueryResults?.getOrder.order?.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useMutation, useQuery } from "@apollo/client";
import {
  EditOrderMutation,
  EditOrderMutationVariables,
  GetOrdersQuery,
  GetOrdersQueryVariables,
  OrderStatus,
  OrderUpdatesSubscription,
} from "../../gql/graphql";
import { EDIT_ORDER_MUTATION } from "./new_order";
import { forwardRef, useEffect, useState } from "react";
import { ORDER_UPDATES_SUBSCRIPTION } from "../../pages/user/order";
import { GET_ORDERS_QUERY } from "./new_orders";
import { pendingCountVar } from "../../apollo";

interface IPendingOrdersProps {
  setIsPendingOrdersOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PendingOrders = forwardRef<HTMLDivElement, IPendingOrdersProps>(
  ({ setIsPendingOrdersOpen }, ref) => {
    const [currentOrderId, setCurrentOrderId] = useState<number>();
    const [editOrderMutaion] = useMutation<
      EditOrderMutation,
      EditOrderMutationVariables
    >(EDIT_ORDER_MUTATION);
    const {
      data: getOrdersQueryResults,
      loading,
      subscribeToMore,
    } = useQuery<GetOrdersQuery, GetOrdersQueryVariables>(GET_ORDERS_QUERY, {
      variables: {
        getOrdersInput: {
          status: [OrderStatus.Pending],
        },
      },
    });
    useEffect(() => {
      if (getOrdersQueryResults?.getOrders.ok && currentOrderId) {
        subscribeToMore({
          document: ORDER_UPDATES_SUBSCRIPTION,
          variables: { orderUpdatesInput: { id: currentOrderId } },
          updateQuery: (
            prev,
            {
              subscriptionData: { data },
            }: { subscriptionData: { data: OrderUpdatesSubscription } }
          ) => {
            if (!data) return prev;
            return {
              getOrders: {
                ...prev.getOrders,
                orders: prev.getOrders.orders?.filter(
                  (order) => order.id !== data.orderUpdates.id
                ),
              },
            };
          },
        });
      }
    }, [getOrdersQueryResults, currentOrderId, subscribeToMore]);
    const onAcceptClick = (orderId: number) => {
      setCurrentOrderId(orderId);
      editOrderMutaion({
        variables: {
          editOrderInput: {
            id: orderId,
            status: OrderStatus.Cooking,
          },
        },
      });
      setIsPendingOrdersOpen(false);
      pendingCountVar(pendingCountVar() - 1);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex flex-col justify-center items-center z-50">
        <div
          ref={ref}
          className="bg-white w-full max-w-screen-sm max-h-[90vh] overflow-y-auto flex flex-col"
        >
          {!loading ? (
            getOrdersQueryResults?.getOrders.orders?.map((order) => (
              <div key={order.id} className="m-4">
                <div className="text-white py-4 rounded-xl bg-lime-600 w-full text-center text-xl">
                  <div className="font-semibold text-3xl mb-2">
                    {order.restaurant?.name}
                  </div>
                  Order #{order.id}
                </div>
                <div className="py-5 px-8 border-b-2 border-gray-400 text-center text-lg grid gap-6">
                  <div className="pt-5 border-gray-400 flex justify-between">
                    <span>Deliver to</span>
                    <span>{order.total}</span>
                  </div>
                  <div className="border-t-2 border-dashed pt-5 border-gray-400 flex justify-between">
                    <span>Driver</span>
                    <span>{order.driver?.email || "Not Yet"}</span>
                  </div>
                  <div className="border-t-2 border-dashed pt-5 border-gray-400 flex justify-between">
                    <span>total</span>
                    <span>{order.total}</span>
                  </div>
                  <div className="border-t-2 border-dashed pt-5 border-gray-400 flex justify-between font-semibold">
                    <span>Status</span>
                    <span>{order.status}</span>
                  </div>
                  <button
                    onClick={() => onAcceptClick(order.id)}
                    type="button"
                    className="w-full h-12 bg-lime-600 text-white mt-2 rounded-xl hover:bg-lime-700"
                  >
                    Accept!
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-full p-5">
              <div className="text-center my-12 font-semibold text-3xl">
                Loading...
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

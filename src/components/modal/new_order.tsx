import { useMutation } from "@apollo/client";
import { graphql } from "../../gql";
import {
  CookedOrdersSubscription,
  EditOrderMutation,
  EditOrderMutationVariables,
  OrderStatus,
  PendingOrdersSubscription,
  TakeOrderMutation,
  TakeOrderMutationVariables,
} from "../../gql/graphql";
import { isDriverGotOrderVar, pendingCountVar } from "../../apollo";

export const EDIT_ORDER_MUTATION = graphql(`
  mutation EditOrder($editOrderInput: EditOrderInput!) {
    editOrder(input: $editOrderInput) {
      ok
      error
    }
  }
`);

const TAKE_ORDER_MUTATION = graphql(`
  mutation TakeOrder($takeOrderInput: TakeOrderInput!) {
    takeOrder(input: $takeOrderInput) {
      ok
      error
    }
  }
`);

interface INewOrderProps {
  unSortedOrder: PendingOrdersSubscription | CookedOrdersSubscription;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function isPendingOrder(
  unSortedOrder: PendingOrdersSubscription | CookedOrdersSubscription
): unSortedOrder is PendingOrdersSubscription {
  return "pendingOrders" in unSortedOrder;
}

export const NewOrder: React.FC<INewOrderProps> = ({
  unSortedOrder,
  setIsOpen,
}) => {
  let order;
  const isOwner = isPendingOrder(unSortedOrder);
  if (isOwner) {
    order = unSortedOrder.pendingOrders;
  } else {
    order = unSortedOrder.cookedOrders;
  }

  const [editOrderMutaion] = useMutation<
    EditOrderMutation,
    EditOrderMutationVariables
  >(EDIT_ORDER_MUTATION);

  const [takeOrderMutaion] = useMutation<
    TakeOrderMutation,
    TakeOrderMutationVariables
  >(TAKE_ORDER_MUTATION);

  const onAcceptClick = async () => {
    if (isOwner) {
      editOrderMutaion({
        variables: {
          editOrderInput: {
            id: order.id,
            status: OrderStatus.Cooking,
          },
        },
      });
      pendingCountVar(pendingCountVar() - 1);
    } else {
      await editOrderMutaion({
        variables: {
          editOrderInput: {
            id: order.id,
            status: OrderStatus.PickedUp,
          },
        },
      });
      await takeOrderMutaion({
        variables: {
          takeOrderInput: {
            id: order.id,
          },
        },
      });
    }
    setIsOpen(false);
    isDriverGotOrderVar(order.id);
    localStorage.setItem("isDriverGotOrder", order.id + "");
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex flex-col justify-center items-center z-50">
      <div className="bg-white w-full max-w-screen-sm rounded-xl overflow-hidden flex flex-col justify-center">
        <div className="flex flex-col text-white py-4 bg-lime-600 w-full text-center text-xl">
          <span className="font-semibold text-3xl mb-2">
            {order.restaurant?.name}
          </span>
          New Order #{order.id}
        </div>
        <div className="py-5 px-8 text-center text-lg grid gap-6">
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
          {!isOwner && (
            <div className="border-t-2 flex-col border-dashed pt-5 border-gray-400 flex justify-between">
              <span className="font-semibold">Address</span>
              <span>{order.restaurant?.address}</span>
            </div>
          )}
        </div>
      </div>
      <div className="w-full h-14 max-w-screen-sm justify-center">
        <button
          onClick={onAcceptClick}
          className="w-full h-full bg-lime-600 text-white mt-2 rounded-xl hover:bg-lime-700"
        >
          Accept
        </button>
      </div>
    </div>
  );
};

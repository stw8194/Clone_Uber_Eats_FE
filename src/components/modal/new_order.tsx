import { useMutation } from "@apollo/client";
import { graphql } from "../../gql";
import {
  EditOrderMutation,
  EditOrderMutationVariables,
  OrderStatus,
  PendingOrdersSubscription,
} from "../../gql/graphql";

export const EDIT_ORDER_MUTATION = graphql(`
  mutation EditOrder($editOrderInput: EditOrderInput!) {
    editOrder(input: $editOrderInput) {
      ok
      error
    }
  }
`);

interface INewOrderProps {
  order: PendingOrdersSubscription;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const NewOrder: React.FC<INewOrderProps> = ({ order, setIsOpen }) => {
  const [editOrderMutaion] = useMutation<
    EditOrderMutation,
    EditOrderMutationVariables
  >(EDIT_ORDER_MUTATION);

  const onAcceptClick = () => {
    editOrderMutaion({
      variables: {
        editOrderInput: {
          id: order.pendingOrders.id,
          status: OrderStatus.Cooking,
        },
      },
    });
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex flex-col justify-center items-center z-50">
      <div className="bg-white w-full max-w-screen-sm rounded-xl overflow-hidden flex flex-col justify-center">
        <div className="flex flex-col text-white py-4 bg-lime-600 w-full text-center text-xl">
          <span className="font-semibold text-3xl mb-2">
            {order.pendingOrders.restaurant?.name}
          </span>
          New Order #{order.pendingOrders.id}
        </div>
        <div className="py-5 px-8 text-center text-lg grid gap-6">
          <div className="pt-5 border-gray-400 flex justify-between">
            <span>Deliver to</span>
            <span>{order.pendingOrders.total}</span>
          </div>
          <div className="border-t-2 border-dashed pt-5 border-gray-400 flex justify-between">
            <span>Driver</span>
            <span>{order.pendingOrders.driver?.email || "Not Yet"}</span>
          </div>
          <div className="border-t-2 border-dashed pt-5 border-gray-400 flex justify-between">
            <span>total</span>
            <span>{order.pendingOrders.total}</span>
          </div>
          <div className="border-t-2 border-dashed pt-5 border-gray-400 flex justify-between font-semibold">
            <span>Status</span>
            <span>{order.pendingOrders.status}</span>
          </div>
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

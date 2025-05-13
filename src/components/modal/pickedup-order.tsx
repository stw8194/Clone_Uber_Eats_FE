import { useMutation, useQuery } from "@apollo/client";
import {
  EditOrderMutation,
  EditOrderMutationVariables,
  GetOrderByDriverIdQuery,
  GetOrderByDriverIdQueryVariables,
  OrderStatus,
} from "../../gql/graphql";
import {
  isDriverCloseToDestinationVar,
  isDriverGotOrderVar,
} from "../../apollo";
import { EDIT_ORDER_MUTATION } from "./new_order";
import { GET_ORDER_BY_DRIVER_ID_QUERY } from "../../pages/driver/dashboard";
import { forwardRef } from "react";

interface IPickedupOrderProps {
  driverId: number;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PickedupOrder = forwardRef<HTMLDivElement, IPickedupOrderProps>(
  ({ driverId, setIsOpen }, ref) => {
    const [editOrderMutaion] = useMutation<
      EditOrderMutation,
      EditOrderMutationVariables
    >(EDIT_ORDER_MUTATION);

    const { data: getOrderByDriverIdResults } = useQuery<
      GetOrderByDriverIdQuery,
      GetOrderByDriverIdQueryVariables
    >(GET_ORDER_BY_DRIVER_ID_QUERY, {
      variables: {
        getOrderByDriverIdInput: {
          driverId: driverId,
        },
      },
    });

    const onDeliveredClick = async () => {
      const orderId = isDriverGotOrderVar();
      if (orderId) {
        await editOrderMutaion({
          variables: {
            editOrderInput: {
              id: +orderId,
              status: OrderStatus.Delivered,
            },
          },
        });
      }
      setIsOpen(false);
      isDriverCloseToDestinationVar(false);
      isDriverGotOrderVar(null);
      localStorage.removeItem("isDriverGotOrder");
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex flex-col justify-center items-center z-50">
        <div ref={ref} className="w-full max-w-screen-sm">
          <div className="bg-white max-w-screen-sm rounded-xl overflow-hidden flex flex-col justify-center">
            <div className="flex flex-col text-white py-4 bg-lime-600 w-full text-center text-xl">
              <span className="font-semibold text-3xl mb-2">
                Did you finish your delivery?
              </span>
              New Order #
              {getOrderByDriverIdResults?.getOrderByDriverId.order?.id}
            </div>
            <div className="py-5 px-8 text-center text-lg grid gap-6">
              <div className="pt-5 border-gray-400 flex justify-between">
                <span>Deliver from</span>
                <span>
                  {
                    getOrderByDriverIdResults?.getOrderByDriverId.order
                      ?.restaurant?.name
                  }
                </span>
              </div>
              <div className="border-t-2 border-dashed pt-5 border-gray-400 flex justify-between">
                <span>Deliver to</span>
                <span>
                  {
                    getOrderByDriverIdResults?.getOrderByDriverId.order
                      ?.customer?.email
                  }
                </span>
              </div>
              <div className="border-t-2 border-dashed pt-5 border-gray-400 flex justify-between">
                <span>total</span>
                <span>
                  {getOrderByDriverIdResults?.getOrderByDriverId.order?.total}
                </span>
              </div>
            </div>
          </div>
          <div className="w-full h-14 max-w-screen-sm justify-center">
            <button
              onClick={onDeliveredClick}
              className="w-full h-full bg-lime-600 text-white mt-2 rounded-xl hover:bg-lime-700"
            >
              Deliverd!
            </button>
          </div>
        </div>
      </div>
    );
  }
);

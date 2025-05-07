import { useState } from "react";
import { MenuOrder } from "./modal/menu-order";
import { DishOption, OrderItemChoiceInputType, UserRole } from "../gql/graphql";
import { useMe } from "../hooks/useMe";
import { useModalRef } from "../hooks/useModalRef";

interface IDishProps {
  id: number;
  name: string;
  price: number;
  description?: string | null;
  photo?: string | null;
  options?: DishOption[] | null;
  AddItemToOrder?: (
    dishId: number,
    options: OrderItemChoiceInputType[]
  ) => void;
}

export const Dish: React.FC<IDishProps> = ({
  id,
  name,
  price,
  description,
  photo,
  options,
  AddItemToOrder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useModalRef(setIsOpen);
  const { data } = useMe();

  return (
    <div
      onClick={() => {
        setIsOpen(true);
      }}
      className="min-w-md h-full border overflow-hidden border-gray-100 rounded-xl flex"
    >
      <div className="flex flex-col mx-4 flex-1">
        <h3 className="font-semibold truncate mt-3 overflow-hidden">
          {name.split(" - ")[0]}
        </h3>
        <h4 className="font-medium truncate overflow-hidden">${price}</h4>
        {description && (
          <h4 className="font-medium mt-2 text-gray-500 truncate overflow-hidden">
            {description}
          </h4>
        )}
      </div>
      <div
        className="relative w-36 h-full bg-center bg-cover"
        style={{ backgroundImage: `url(${photo})` }}
      ></div>
      {data?.me.role === UserRole.Client && isOpen && (
        <div
          className="fixed inset-0 flex justify-center items-center z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <MenuOrder
            ref={modalRef}
            dishId={id}
            name={name}
            price={price}
            description={description}
            options={options}
            setIsOpen={setIsOpen}
            AddItemToOrder={AddItemToOrder}
          />
        </div>
      )}
    </div>
  );
};

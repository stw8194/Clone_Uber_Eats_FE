import { forwardRef, useState } from "react";
import { DishOption, OrderItemChoiceInputType } from "../../gql/graphql";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

interface IMenuOrderProps {
  dishId: number;
  name: string;
  price: number;
  description?: string | null;
  options: DishOption[] | null | undefined;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  AddItemToOrder?: (
    dishId: number,
    options: OrderItemChoiceInputType[]
  ) => void;
}

export const MenuOrder = forwardRef<HTMLDivElement, IMenuOrderProps>(
  (
    { dishId, name, price, description, options, setIsOpen, AddItemToOrder },
    ref
  ) => {
    const [selectedChoices, setSelectedChoices] = useState<
      OrderItemChoiceInputType[]
    >([]);

    return (
      <div className="fixed inset-0 bg-black/50 flex justify-center items-start z-50">
        <div
          ref={ref}
          className="grid grid-cols-2 mt-36 max-w-5xl w-full max-h-[80vh] overflow-y-auto p-6 bg-white rounded-2xl shadow-xl"
        >
          <div>
            <div className="font-semibold text-3xl">{name}</div>
            <div className="font-semibold opacity-70 text-xl">${price}</div>
            {description && <div className="mt-2">{description}</div>}
          </div>
          <div>
            {options &&
              options?.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <div className="text-2xl mt-6 font-semibold pb-1 border-b-2 border-gray-300">
                    {option.name}
                  </div>
                  {option.extra ? (
                    <div className="flex justify-between items-center">
                      <div>+${option.extra}</div>
                      <ToggleGroup
                        type="single"
                        value={
                          selectedChoices.find((c) => c.name === option.name)
                            ? option.name
                            : ""
                        }
                        onValueChange={(value) => {
                          setSelectedChoices((prev) => {
                            const alreadySelected = prev.find(
                              (c) => c.name === option.name
                            );
                            const filtered = prev.filter(
                              (c) => c.name !== option.name
                            );

                            if (alreadySelected) {
                              return filtered;
                            }

                            return [...filtered, { name: value }];
                          });
                        }}
                      >
                        <ToggleGroupItem
                          value={option.name}
                          aria-label={option.name}
                          className="p-2 rounded-full hover:bg-gray-200 data-[state=on]:text-green-600"
                        >
                          <FontAwesomeIcon icon={faCheckCircle} />
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>
                  ) : (
                    <ToggleGroup
                      type="single"
                      value={
                        selectedChoices.find(
                          (choice) => choice.name === option.name
                        )?.choice ?? ""
                      }
                      onValueChange={(value) => {
                        setSelectedChoices((prev) => {
                          const existingChoice = prev.find(
                            (choice) => choice.name === option.name
                          );

                          if (existingChoice?.choice === value) {
                            return prev.filter(
                              (choice) => choice.name !== option.name
                            );
                          }

                          return [
                            ...prev.filter(
                              (choice) => choice.name !== option.name
                            ),
                            { name: option.name, choice: value },
                          ];
                        });
                      }}
                    >
                      {option.choices?.map((choice, choiceIndex) => (
                        <div
                          key={choiceIndex}
                          className="flex justify-between items-center border-b border-gray-200"
                        >
                          <div>
                            <div>{choice.name}</div>
                            {choice.extra !== 0 && <div>+${choice.extra}</div>}
                          </div>
                          <ToggleGroupItem
                            value={choice.name}
                            aria-label={choice.name}
                            className="p-2 rounded-full hover:bg-gray-200 data-[state=on]:text-green-600"
                          >
                            <FontAwesomeIcon icon={faCheckCircle} />
                          </ToggleGroupItem>
                        </div>
                      ))}
                    </ToggleGroup>
                  )}
                </div>
              ))}
            <div
              onClick={() => {
                setIsOpen(false);
                AddItemToOrder && AddItemToOrder(dishId, selectedChoices);
              }}
              className="flex mt-12 h-12 text-white text-lg font-semibold items-center justify-center rounded-lg bg-black hover:bg-gray-900"
            >
              Add Cart
            </div>
          </div>
        </div>
      </div>
    );
  }
);

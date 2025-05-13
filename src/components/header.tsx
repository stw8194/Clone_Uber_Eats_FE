import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../images/logo.svg";
import {
  faBell,
  faMapLocationDot,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { useState } from "react";
import { pendingCountVar } from "../apollo";
import { UserRole } from "../gql/graphql";
import { PendingOrders } from "./modal/pending_orders";
import { useModalRef } from "../hooks/useModalRef";
import { UserIcon } from "./modal/user-icon";
import { ClientAddressIcon } from "./modal/client-address-icon";
// import { Cart } from "./modal/cart";

export const Header: React.FC = () => {
  const { data } = useMe();
  const [isOpen, setIsOpen] = useState(false);
  const [isPendingOrdersOpen, setIsPendingOrdersOpen] = useState(false);
  const [isClientAddressOpen, setIsClientAddressOpen] = useState(false);
  // const [isCartOpen, setIsCartOpen] = useState(false);
  const profileModalRef = useModalRef(setIsOpen);
  const bellModalRef = useModalRef(setIsPendingOrdersOpen);
  const addressModalRef = useModalRef(setIsClientAddressOpen);

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-base text-white">
          <span>Please verify your email.</span>
        </div>
      )}
      <header className="fixed top-0 left-0 w-full bg-white z-50 shadow-md py-6">
        <div className="container w-full px-5 my-3 xl:px-0 flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <Link to="/">
              <img src={logo} alt="Cuber Eats" className="w-24" />
            </Link>
            {data?.me.role === UserRole.Client && (
              <div className="inline-block justify-self-start mr-5">
                <FontAwesomeIcon
                  icon={faMapLocationDot}
                  onClick={() => setIsClientAddressOpen((current) => !current)}
                  className="text-xl cursor-pointer"
                />
                {isClientAddressOpen && (
                  <ClientAddressIcon
                    ref={addressModalRef}
                    setIsOpen={setIsClientAddressOpen}
                  />
                )}
              </div>
            )}
          </div>
          <div className="items-center">
            <span
              className="relative text-xs"
              // onClick={() => setIsCartOpen((current) => !current)}
            >
              {/* <FontAwesomeIcon
                icon={faCartShopping}
                className="cursor-pointer mr-5"
                size="lg"
              />
              {isCartOpen && (
                <Cart
                  setIsCartOpen={setIsCartOpen}
                  restaurantName="Test"
                  dish=""
                />
              )} */}
            </span>
            <span className="relative text-xs">
              {data?.me.role === UserRole.Owner && (
                <div
                  onClick={() => {
                    if (pendingCountVar()) setIsPendingOrdersOpen(true);
                  }}
                  className="relative inline-block mr-5"
                >
                  <FontAwesomeIcon
                    icon={faBell}
                    className="text-xl cursor-pointer"
                  />
                  {!!pendingCountVar() && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full w-2.5 h-2.5"></span>
                  )}
                  {isPendingOrdersOpen && (
                    <PendingOrders
                      ref={bellModalRef}
                      setIsOpen={setIsPendingOrdersOpen}
                    />
                  )}
                </div>
              )}
              <FontAwesomeIcon
                icon={faUser}
                onClick={() => setIsOpen((current) => !current)}
                className="text-xl cursor-pointer"
              />
              {isOpen && (
                <UserIcon ref={profileModalRef} setIsOpen={setIsOpen} />
              )}
            </span>
          </div>
        </div>
      </header>
      <div className="my-24"></div>
    </>
  );
};

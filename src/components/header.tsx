import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../images/logo.svg";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useMe } from "../hooks/useMe";
import { useState } from "react";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";
import { useApolloClient } from "@apollo/client";

export const Header: React.FC = () => {
  const { data } = useMe();
  const [isOpen, setIsOpen] = useState(false);
  const client = useApolloClient();

  const onLogout = () => {
    localStorage.removeItem(LOCALSTORAGE_TOKEN);
    authTokenVar(null);
    isLoggedInVar(false);
    client.clearStore();
  };

  return (
    <>
      {!data?.me.verified && (
        <div className="bg-red-500 p-3 text-center text-base text-white">
          <span>Please verify your email.</span>
        </div>
      )}
      <header className="py-6">
        <div className="container w-full px-5 mb-6 xl:px-0 flex justify-between items-center">
          <Link to="/">
            <img src={logo} alt="Cuber Eats" className="w-24" />
          </Link>
          <span
            className="relative text-xs"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <FontAwesomeIcon icon={faUser} className="text-xl cursor-pointer" />
            {isOpen && (
              <div
                className="absolute right-0 mt-2 w-40 bg-gray-100 p-4 rounded shadow-xl z-50 origin-top-right transform scale-95 opacity-0 animate-dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col space-y-2">
                  <Link to="/edit-profile" onClick={() => setIsOpen(false)}>
                    <button className="bg-lime-600 text-white px-4 py-2 rounded w-full">
                      Edit Profile
                    </button>
                  </Link>
                  <Link
                    to="/"
                    onClick={() => {
                      setIsOpen(false);
                      onLogout();
                    }}
                  >
                    <button className="bg-lime-600 text-white px-4 py-2 rounded w-full">
                      Log out
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </span>
        </div>
      </header>
    </>
  );
};

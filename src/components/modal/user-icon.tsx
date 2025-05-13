import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { authTokenVar, isLoggedInVar } from "../../apollo";
import { useApolloClient } from "@apollo/client";
import { LOCALSTORAGE_TOKEN } from "../../constants";

interface IUserIconProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserIcon = forwardRef<HTMLDivElement, IUserIconProps>(
  ({ setIsOpen }, ref) => {
    const client = useApolloClient();
    const onLogout = () => {
      localStorage.removeItem(LOCALSTORAGE_TOKEN);
      authTokenVar(null);
      isLoggedInVar(false);
      client.clearStore();
    };

    return (
      <div
        ref={ref}
        className="fixed right-0 mt-2 w-40 bg-gray-100 p-4 rounded shadow-xl z-50 origin-top-right transform scale-95 opacity-0 animate-dropdown"
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
    );
  }
);

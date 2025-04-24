import { faHeart, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

interface IDishProps {
  id: string;
  name: string;
  price: number;
  description?: string | null;
  photo?: string | null;
}

export const Dish: React.FC<IDishProps> = ({
  id,
  name,
  price,
  description,
  photo,
}) => {
  return (
    // <Link to={`/restaurant/${id}`}>
    <div className="min-w-md h-full border overflow-hidden border-gray-100 rounded-xl flex">
      <div className="flex flex-col mx-4 flex-1">
        <h3 className="font-semibold truncate mt-3 overflow-hidden">
          {name.split(" - ")[0]}
        </h3>
        <h4 className="font-medium truncate overflow-hidden">${price}</h4>
      </div>
      <div
        className="relative w-36 h-full bg-center bg-cover"
        style={{ backgroundImage: `url(${photo})` }}
      ></div>
    </div>
    // </Link>
  );
};

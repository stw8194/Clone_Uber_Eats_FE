import { faHeart } from "@fortawesome/free-solid-svg-icons";
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
    <div>
      <div
        className="bg-cover bg-center mb-2 rounded-xl py-16"
        style={{ backgroundImage: `url(${photo})` }}
      ></div>
      <div className="flex justify-between items-center">
        <h3 className="font-medium cursor-pointer truncate overflow-hidden">
          {name.split(" - ")[0]}
        </h3>
        <FontAwesomeIcon className="opacity-30" icon={faHeart} color="gray" />
      </div>
    </div>
    // </Link>
  );
};

import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

interface IRestaurantProps {
  id: string;
  coverImg: string;
  name: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({
  id,
  coverImg,
  name,
}) => {
  return (
    <Link to={`/restaurants/${id}`}>
      <div>
        <div
          className="bg-cover bg-center mb-2 rounded-xl py-16"
          style={{ backgroundImage: `url(${coverImg})` }}
        ></div>
        <div className="flex justify-between items-center">
          <h3 className="font-medium cursor-pointer truncate overflow-hidden">
            {name.split(" - ")[0]}
          </h3>
        </div>
      </div>
    </Link>
  );
};

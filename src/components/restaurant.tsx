import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IRestaurantProps {
  id: string;
  coverImg: string;
  name: string;
}

export const Restaurant: React.FC<IRestaurantProps> = ({ coverImg, name }) => {
  return (
    <div>
      <div
        className="bg-cover bg-center mb-2 rounded-xl py-16"
        style={{ backgroundImage: `url(${coverImg})` }}
      ></div>
      <div className="flex justify-between items-center">
        <h3 className="font-medium cursor-pointer truncate overflow-hidden">
          {name.split(" - ")[0]}
        </h3>
        <FontAwesomeIcon className="opacity-30" icon={faHeart} color="gray" />
      </div>
    </div>
  );
};

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IPosition } from "../../pages/owner/add-restaurant";

interface IAddRestaurantAddressProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  restaurantCoords: IPosition | null;
  setRestaurantCoords: React.Dispatch<React.SetStateAction<IPosition | null>>;
  restaurantAddress: string;
  setRestaurantAddress: React.Dispatch<React.SetStateAction<string>>;
}

const containerStyle = {
  width: "100%",
  height: "80%",
  borderRadius: "1rem",
  overflow: "hidden",
};

interface IFormProps {
  address: string;
}

export const AddRestaurantAddress = forwardRef<
  HTMLDivElement,
  IAddRestaurantAddressProps
>(
  (
    {
      setIsOpen,
      restaurantCoords,
      setRestaurantCoords,
      restaurantAddress,
      setRestaurantAddress,
    },
    ref
  ) => {
    const { isLoaded } = useJsApiLoader({
      id: "google-map-script",
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
    });
    const [initialCenter, setInitialCenter] = useState<IPosition>();
    const [map, setMap] = useState<google.maps.Map | null>();
    const { register, getValues } = useForm<IFormProps>({ mode: "onChange" });

    const onSuccess = (position: GeolocationPosition) => {
      if (!restaurantCoords) {
        setRestaurantCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setInitialCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      } else {
        setInitialCenter(restaurantCoords);
      }
    };
    const onError = (error: GeolocationPositionError) => {
      console.log(error);
    };
    useEffect(() => {
      navigator.geolocation.watchPosition(onSuccess, onError, {
        enableHighAccuracy: true,
      });
    }, []);
    const onLoad = useCallback(function callback(map: google.maps.Map) {
      if (restaurantCoords) {
        map.panTo(
          new google.maps.LatLng(restaurantCoords.lat, restaurantCoords.lng)
        );
        setMap(map);
      }
    }, []);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
      setMap(null);
    }, []);

    const onClick = (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const { lat, lng } = e.latLng;
        setRestaurantCoords({ lat: lat(), lng: lng() });
      }
    };

    const onSearchClick = (map: google.maps.Map) => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        {
          address: getValues("address"),
        },
        (results) => {
          if (results) {
            const { lat, lng } = results[0].geometry.location;
            setRestaurantCoords({ lat: lat(), lng: lng() });
            setRestaurantAddress(results[0].formatted_address);
            map.panTo(new google.maps.LatLng(lat(), lng()));
          }
        }
      );
    };

    const onConfirmClick = () => {
      const geocoder = new google.maps.Geocoder();
      setIsOpen(false);
      geocoder.geocode(
        {
          location: restaurantCoords,
        },
        (results) => {
          if (results) {
            setRestaurantAddress(results[0].formatted_address);
          }
        }
      );
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex flex-col justify-center items-center z-50">
        {isLoaded ? (
          <div ref={ref} className="w-4/5 h-4/5">
            <div className="flex items-center">
              <input
                {...register("address")}
                type="text"
                placeholder="Address"
                className="p-3 w-full mb-2 rounded-xl border-2 bg-white text-lg focus:outline-none focus:border-gray-500 transition-colors font-light border-gray-200"
              />
              <button
                onClick={() => map && onSearchClick(map)}
                className="bg-lime-500 hover:bg-lime-600 ml-2 mb-2 cursor-pointer text-white font-semibold p-4 rounded-xl"
              >
                Search
              </button>
              <button
                onClick={onConfirmClick}
                className="bg-lime-500 hover:bg-lime-600 ml-2 mb-2 cursor-pointer text-white font-semibold p-4 rounded-xl"
              >
                Confirm
              </button>
            </div>

            <GoogleMap
              mapContainerStyle={containerStyle}
              center={initialCenter}
              zoom={16}
              onLoad={onLoad}
              onUnmount={onUnmount}
              onClick={onClick}
            >
              {restaurantCoords && <Marker position={restaurantCoords} />}
            </GoogleMap>
          </div>
        ) : (
          <></>
        )}
      </div>
    );
  }
);

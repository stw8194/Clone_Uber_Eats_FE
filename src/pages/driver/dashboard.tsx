import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useEffect, useRef, useState } from "react";
import { graphql } from "../../gql";
import { useLazyQuery, useReactiveVar } from "@apollo/client";
import {
  isDriverCloseToDestinationVar,
  isDriverGotOrderVar,
} from "../../apollo";
import {
  GetOrderByDriverIdQuery,
  GetOrderByDriverIdQueryVariables,
} from "../../gql/graphql";
import { useMe } from "../../hooks/useMe";
import { PickedupOrder } from "../../components/modal/pickedup-order";
import { useModalRef } from "../../hooks/useModalRef";

export const GET_ORDER_BY_DRIVER_ID_QUERY = graphql(`
  query GetOrderByDriverId($getOrderByDriverIdInput: GetOrderByDriverIdInput!) {
    getOrderByDriverId(input: $getOrderByDriverIdInput) {
      ok
      error
      order {
        ...OrderParts
      }
    }
  }
`);

const containerStyle = {
  width: "95%",
  height: "320px",
  borderRadius: "1rem",
  overflow: "hidden",
};

interface IPosition {
  lat: number;
  lng: number;
}

export const Dashboard = () => {
  const [map, setMap] = useState<google.maps.Map | null>();
  const [driverCoords, setDriverCoords] = useState<IPosition>({
    lat: 0,
    lng: 0,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isButtonOpen, setIsButtonOpen] = useState(false);
  const modalRef = useModalRef(setIsOpen);
  const isDriverGotOrder = useReactiveVar(isDriverGotOrderVar);
  const isDriverCloseToDestination = useReactiveVar(
    isDriverCloseToDestinationVar
  );
  const { data } = useMe();
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
    null
  );
  const [distanceInMeters, setDistanceInMeters] = useState<number | null>(null);

  const [getOrderByDriverIdQuery] = useLazyQuery<
    GetOrderByDriverIdQuery,
    GetOrderByDriverIdQueryVariables
  >(GET_ORDER_BY_DRIVER_ID_QUERY);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
  });

  useEffect(() => {
    if (!isLoaded) return;
    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        suppressMarkers: true,
      });
    }

    if (map && directionsRendererRef.current) {
      directionsRendererRef.current.setMap(map);
    }

    if (!isDriverGotOrder) {
      directionsRendererRef.current.setMap(null);
      setIsButtonOpen(false);
    }
  }, [map, isLoaded, isDriverGotOrder]);

  const onSuccess = (position: GeolocationPosition) => {
    setDriverCoords({
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    });
  };
  const onError = (error: GeolocationPositionError) => {
    console.log(error);
  };
  useEffect(() => {
    navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
    });
  }, []);
  useEffect(() => {
    if (map) {
      map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));
    }
  }, [map, driverCoords.lat, driverCoords.lng]);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));

    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded) return;
      if (map && isDriverGotOrder && data) {
        try {
          const result = await getOrderByDriverIdQuery({
            variables: {
              getOrderByDriverIdInput: {
                driverId: data.me.id,
              },
            },
          });

          if (result?.data?.getOrderByDriverId?.order?.restaurant) {
            const {
              data: {
                getOrderByDriverId: {
                  order: {
                    restaurant: { lat: restaurantLat, lng: restaurantLng },
                  },
                },
              },
            } = result;

            const directionsService = new google.maps.DirectionsService();
            const driverPoint = new google.maps.LatLng(
              driverCoords.lat,
              driverCoords.lng
            );
            const restaurantPoint = new google.maps.LatLng(
              restaurantLat,
              restaurantLng
            );

            directionsService.route(
              {
                origin: driverPoint,
                destination: restaurantPoint,
                // Google Maps does not support non-transit routes in Korea
                travelMode: google.maps.TravelMode.TRANSIT,
              },
              (results) => {
                directionsRendererRef.current?.setDirections(results);
              }
            );

            setDistanceInMeters(
              google.maps.geometry.spherical.computeDistanceBetween(
                driverPoint,
                restaurantPoint
              )
            );
          }
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, [data, driverCoords, isDriverGotOrder, map, isLoaded]);

  useEffect(() => {
    if (
      distanceInMeters &&
      !isDriverCloseToDestinationVar() &&
      distanceInMeters <= 50
    ) {
      isDriverCloseToDestinationVar(true);
    }
  }, [distanceInMeters]);

  useEffect(() => {
    if (isDriverCloseToDestination) {
      setIsButtonOpen(true);
    }
  }, [isDriverCloseToDestination]);

  return (
    <div className="container">
      <div className="flex justify-center items-center">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={driverCoords}
            zoom={17}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            <Marker
              position={driverCoords}
              icon={{
                url: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1'%20height='1'%3E%3C/svg%3E",
                scaledSize: new window.google.maps.Size(1, 1),
              }}
              label={{ text: "🛵", fontSize: "22px" }}
            />
          </GoogleMap>
        ) : (
          <></>
        )}
      </div>
      {isButtonOpen && (
        <div className="flex w-[90%] mx-2 mt-9 justify-end">
          <button
            onClick={() => {
              setIsOpen(true);
            }}
            type="button"
            className="text-white cursor-pointer bg-lime-600 rounded-lg px-4 py-2 font-semibold"
          >
            Arrival at destination
          </button>
        </div>
      )}
      {data && isDriverCloseToDestination && isOpen && (
        <PickedupOrder
          ref={modalRef}
          setIsOpen={setIsOpen}
          driverId={data.me.id}
        />
      )}
    </div>
  );
};

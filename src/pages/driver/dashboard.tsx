import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";

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

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "",
  });
  const onLoad = useCallback(function callback(map: google.maps.Map) {
    map.panTo(new google.maps.LatLng(driverCoords.lat, driverCoords.lng));

    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  return (
    <div>
      <div className="flex justify-center items-center">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={driverCoords}
            zoom={18}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            <Marker
              position={driverCoords}
              icon={{
                url: "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='1'%20height='1'%3E%3C/svg%3E",
                scaledSize: new window.google.maps.Size(1, 1),
              }}
              label={{ text: "🛵", fontSize: "24px" }}
            />
          </GoogleMap>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

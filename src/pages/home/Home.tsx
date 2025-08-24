import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100vh",
};

const center = {
  lat: -34.397,
  lng: 150.644,
};

export const Home = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyDEbgrPMy2WgtfJj5w164HOlKYFkjyPXzY">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        options={{
          disableDefaultUI: true,
          streetViewControl: true,
          minZoom: 3,
          maxZoom: 20,
        }}
      />
    </LoadScript>
  );
};

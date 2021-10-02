import geolib from "geolib";
const { getDistance, convertDistance } = geolib;
export const calculateDistance = (sender, receiver) => {
  return convertDistance(
    getDistance(
      {
        lat: sender.latitude,
        lng: sender.longitude,
      },
      {
        lat: receiver.latitude,
        lng: receiver.longitude,
      },
      1
    ),
    "km"
  );
};

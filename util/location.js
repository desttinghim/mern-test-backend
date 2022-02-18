const axios = require("axios");

const HttpError = require("../models/http-error");

const getCoordsForAddress = async (address) => {
  // Dummy values for if nominatim is too annoying
  // return {
  //   lat: 0.0,
  //   lng: 0.0,
  // };
  const response = await axios.get(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=jsonv2`
  );

  const data = response.data;

  console.log(data);
  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for specified address.",
      422
    );
    throw error;
  }

  const coords = { lat: data[0].lat, lng: data[0].lon };

  return coords;
};

module.exports = getCoordsForAddress;

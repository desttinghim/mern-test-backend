const { v4: uuidv4 } = require("uuid");

const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famouse sky scrapers in the world!",
    location: { lat: 40.784474, lng: -73.9871516 },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
];

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;

  const place = DUMMY_PLACES.find((p) => p.id === placeId);

  if (!place) {
    throw new HttpError("Could not find a place for the provided id.", 404);
  }

  res.json({ place });
};

const getPlaceByUserId = (req, res, next) => {
  const userId = req.params.uid;

  const places = DUMMY_PLACES.filter((p) => p.creator === userId);

  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find a place for the provided user id.", 404)
    );
  }

  res.json(places);
};

const createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id: uuidv4(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlaceById = (req, res, next) => {
  const placeId = req.params.pid;

  const updatedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

  if (!updatedPlace) {
    return next(new HttpError("Could not find place for provided id.", 404));
  }

  const { title, description, coordinates, address, creator } = req.body;

  updatedPlace.title = title;
  updatedPlace.description = description;
  updatedPlace.location = coordinates;
  updatedPlace.address = address;
  updatedPlace.creator = creator;

  res.status(200).json({ place: updatedPlace });
};

const deletePlaceById = (req, res, next) => {
  const placeId = req.params.pid;

  const deleteIndex = DUMMY_PLACES.findIndex((p) => p.id === placeId);

  if (deleteIndex < 0) {
    return next(new HttpError("Could not find place for provided id.", 404));
  }

  res.status(200).json({ place: DUMMY_PLACES.splice(deleteIndex) });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUserId = getPlaceByUserId;
exports.createPlace = createPlace;
exports.updatePlaceById = updatePlaceById;
exports.deletePlaceById = deletePlaceById;

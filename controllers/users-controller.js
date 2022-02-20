const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Sussus Amogus",
    email: "sus@amog.us",
    password: "password",
  },
];

const getUsers = (req, res, next) => {
  const users = DUMMY_USERS.map((user) => ({ id: user.id, name: user.name }));

  res.status(200).json({ users });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Could not create user.", 500));
  }

  if (existingUser) {
    return next(
      new HttpError("Could not create user, email already exists.", 422)
    );
  }

  const createdUser = new User({
    name,
    email,
    image: "https://freesvg.org/img/Hide-the-pain-Harold.png",
    password,
    places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    return next(new HttpError("Signup failed.", 500));
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  const user = DUMMY_USERS.find(
    (user) => user.email === email && user.password === password
  );

  if (!user) {
    return next(new HttpError("Incorrect email or password.", 401));
  }

  res.status(200).json({ message: "Successfully logged in.", id: user.id });
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;

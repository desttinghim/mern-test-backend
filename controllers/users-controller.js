const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Sussus Amogus",
    email: "sus@amog.us",
    password: "password",
  },
];

const getUsers = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const users = DUMMY_USERS.map((user) => ({ id: user.id, name: user.name }));

  res.status(200).json({ users });
};

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
  }

  const { name, email, password } = req.body;

  const hasUser = DUMMY_USERS.find((u) => u.email === email);
  if (hasUser) {
    return next(
      new HttpError("Could not create user, email already exists.", 422)
    );
  }

  const id = uuidv4();

  DUMMY_USERS.push({
    id,
    name,
    email,
    password,
  });

  res.status(201).json({ message: "Successfully created user!", id });
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

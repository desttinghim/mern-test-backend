const { v4: uuidv4 } = require("uuid");

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
  const users = DUMMY_USERS.map((user) => ({ id: user.id, name: user.name }));

  res.status(200).json({ users });
};

const signup = (req, res, next) => {
  const { name, email, password } = req.body;

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

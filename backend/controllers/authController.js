const User = require("../models/User");
const { signToken } = require("../utils/tokenUtils");

const createSession = (user) => ({
  token: signToken({ id: user._id.toString() }),
  user: user.toSafeJSON()
});

const signup = async (req, res) => {
  const { email, name, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  if (String(password).length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const existingUser = await User.findOne({ email: String(email).toLowerCase().trim() });

    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = new User({
      email,
      name
    });
    user.setPassword(password);
    await user.save();

    res.status(201).json(createSession(user));
  } catch (error) {
    res.status(500).json({ message: "Failed to create account" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email: String(email).toLowerCase().trim() });

    if (!user || !user.comparePassword(password)) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json(createSession(user));
  } catch (error) {
    res.status(500).json({ message: "Failed to log in" });
  }
};

const getMe = async (req, res) => {
  res.status(200).json({ user: req.user.toSafeJSON() });
};

module.exports = {
  getMe,
  login,
  signup
};

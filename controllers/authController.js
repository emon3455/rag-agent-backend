const User = require("../model/userSchema");


// get all user
async function getAllUser(req, res) {
  try {
    const user = await User.find().populate("user");
    if (!user || user.length === 0) {
      return res.status(200).json([]);
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching all agents:", error.message);
    res.status(500).json({ detail: "Internal Server Error" });
  }
}


// register
async function register(req, res) {
  try {
    const user = new User(req.body);
    const newUser = await user.save();

    res.json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(500).json({ detail: "Internal Server Error" });
  }
}


// login
async function login(req, res) {
  try {
    const user = await User.find({ email: req.body.email });
    if (user && user.length > 0) {
      if (req.body.password) {
        res.status(200).json({
          message: "User LoggedIn Successfully",
          user: user[0],
        });
      } else {
        res.status(500).json({
          error: "Login Failed..!",
        });
      }
    } else {
      res.status(500).json({
        error: "Login Failed..!",
      });
    }
  } catch (err) {
    res.status(500).json({
      error: "Internal Server Error..!",
    });
  }
}

module.exports = {
  register,
  login,
  getAllUser
};

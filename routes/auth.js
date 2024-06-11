const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");

// SIGN UP 
router.post("/register", async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Check if a user with the given email or username already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // Add a salt round of 10 for hashing

        // Create and save the new user with the hashed password
        const user = new User({ email, username, password: hashedPassword });
        await user.save();

        // Return the user with the hashed password
        res.status(200).json({ user: user });
    } catch (error) {
        console.error("Error in /register route:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// SIGN IN 

router.post("/signin", async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(400)
          .json({ message: "User not found. Please Sign Up First" });
      }
  
      const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Password is not correct" });
      }
  
      const { password, ...others } = user._doc;
      res.status(200).json({ user: others });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

module.exports = router;

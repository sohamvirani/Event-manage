const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

// Middleware to hash password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pass any errors to the next middleware
  }
});

// Instance method to compare entered password with the hashed password
userSchema.methods.verifyPassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

// Create the User model
const UserModel = mongoose.model("User", userSchema);
module.exports = UserModel;

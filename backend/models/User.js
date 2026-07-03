const crypto = require("crypto");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    passwordSalt: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

userSchema.methods.setPassword = function setPassword(password) {
  this.passwordSalt = crypto.randomBytes(16).toString("hex");
  this.passwordHash = crypto
    .pbkdf2Sync(password, this.passwordSalt, 120000, 64, "sha512")
    .toString("hex");
};

userSchema.methods.comparePassword = function comparePassword(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.passwordSalt, 120000, 64, "sha512")
    .toString("hex");

  const candidate = Buffer.from(hash, "hex");
  const stored = Buffer.from(this.passwordHash, "hex");

  return candidate.length === stored.length && crypto.timingSafeEqual(candidate, stored);
};

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    _id: this._id,
    email: this.email,
    name: this.name
  };
};

module.exports = mongoose.model("User", userSchema);

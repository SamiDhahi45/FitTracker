import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
  },
  weight: {
    type: Number, // kg
  },
  height: {
    type: Number, // cm
  },
  goal: {
    type: String,
    enum: ["lose_weight", "build_muscle", "maintain"],
    default: "maintain",
  },
  profilePic: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("userInfos", UserSchema);
export default UserModel;

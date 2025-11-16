const mongoose = require("mongoose");
require("dotenv").config();

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    userName: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    collegeName: { type: String },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User", UserSchema);

const ContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    link: { type: String, required: true },
    type: { type: String, enum: ["youtube", "twitter"], required: true },
    tags: [{ type: mongoose.Types.ObjectId, ref: "tag" }],
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const ContentModel = mongoose.model("Content", ContentSchema);

const LinkSchema = new mongoose.Schema(
  {
    hash: { type: String, required: true, unique: true },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const LinkModel = mongoose.model("Links", LinkSchema);

module.exports = {
  UserModel,
  ContentModel,
  LinkModel,
};

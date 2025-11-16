import mongoose, { model, Schema } from "mongoose";
require("dotenv").config();

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    userName: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    collegeName: { type: String },
  },
  { timestamps: true }
);

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema(
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

export const ContentModel = model("Content", ContentSchema);

const LinkSchema = new Schema(
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

export const LinkModel = model("Links", LinkSchema);

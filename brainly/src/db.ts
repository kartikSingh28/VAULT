import mongoose, { model } from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  userName: { type: String, required: true },
  password: { type: String, required: true },
  collegeName: { type: String, required: true },
});

const ContentSchema = new Schema({
  title: String,
  link: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const LinkSchema = new Schema({
  hash: String,
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true, unique: true },
});

// Models
const UserModel = mongoose.model("User", UserSchema);
const ContentModel = mongoose.model("Content", ContentSchema);
const LinkModel = mongoose.model("Link", LinkSchema);

export { UserModel, ContentModel, LinkModel };

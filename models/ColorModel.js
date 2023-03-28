//Color schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ColorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

const Color = mongoose.model("Color", ColorSchema);

export default Color;
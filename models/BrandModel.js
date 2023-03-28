//Brand schema
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const BrandSchema = new Schema(
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
    image: {
        type: String,
        default: 'https://picsum.photos/200/300',
        required: true
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const Brand = mongoose.model("Brand", BrandSchema);

export default Brand;
import { count } from "console";
import mongoose from "mongoose";
const reviewSchema = mongoose.Schema({
user:{ type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
name: { type: String, required: true },
rating: { type: Number, required: true },
comment: { type: String, required: true },
});


const productSchema = new mongoose.Schema({
    _id: { type: String, required: true },
  asin: { type: String, required: true },
  title: { type: String, required: true },
  imgUrl: { type: String, required: true },
  productURL: { type: String, required: true },
  stars: { type: String, required: true, default: "0"},
  reviews: { type: [reviewSchema], required: true },
  price: { type: String, required: true },
  listPrice: { type: String, required: true },
  category_id: { type: String, required: true },
  countInStock: { type: Number, required: true },
  numReviews: { type: Number, required: true },
  });

  const Product = mongoose.model("Product", productSchema, "Products");

    export default Product;
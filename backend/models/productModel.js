import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  _id: String, // Assuming you have a unique identifier for each product
  asin: String,
  title: String,
  imgUrl: String,
  productURL: String,
  stars: Number,
  price: Number,
  listPrice: Number,
  category_id: String, // Or another appropriate field for category
  Category: String, // Can be removed if redundant with category_id
  quantity: Number,
  numberOfReviews: Number,
});


const Product = mongoose.model('Product', productSchema);
export default Product;
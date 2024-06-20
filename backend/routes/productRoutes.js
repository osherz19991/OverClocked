// routes/productRoutes.js

import express, { Router } from 'express';
import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';

const router = express.Router();
const productsCollectionName = 'Products';
const accountsCollectionName = 'accounts';

router.get('/', async (req, res) => {
  try {
    const db = await getDB();
    const page = parseInt(req.query.page) || 1;
    const limit = 9999; // Limit products per page
    const skip = (page - 1) * limit;
    const searchQuery = req.query.search;
    const sortField = req.query.sortBy || null;
    const sortOrder = req.query.sortOrder || null;

    let filter = {};
    if (searchQuery && searchQuery !== "Other") {
      filter = { $text: { $search: searchQuery } };
    } else if (searchQuery === "Other") {
      filter = { Category: "Other" };
    }

    // Define sort criteria based on the sortField and sortOrder
    let sortCriteria = {};
    if (sortField && sortOrder) {
      sortCriteria[sortField] = sortOrder === 'asc' ? 1 : -1;
    }

    const products = await db.collection(productsCollectionName)
      .find(filter)
      .sort(sortCriteria) // Apply sorting
      .skip(skip)
      .limit(limit)
      .toArray();

    // Count total number of documents in the collection based on the search filter
    const totalCount = await db.collection(productsCollectionName).countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    res.json({ products, totalPages });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/suggested', async (req, res) => {
  try {
    const { username } = req.body;
    const db = await getDB();

    const account = await db.collection(accountsCollectionName).findOne({ username: username });
    if (account && account.categories) {
      const categories = account.categories;
      const products = await db.collection(productsCollectionName).find({ Category: { $in: categories } }).toArray();
      res.json({ products });
    } else {
      res.json({ message: 'No categories found for the user or user does not exist' });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const db = await getDB();
    const product = await db.collection(productsCollectionName).findOne({ _id: new ObjectId(req.params.id) });
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.put('/:id/updateQuantity', async (req, res) => {
  try {
    const productId = req.params.id;
    const { quantity } = req.body;
    const db = await getDB();

    // Find the product by ID
    const product = await db.collection(productsCollectionName).findOne({ _id: new ObjectId(productId) });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await db.collection(productsCollectionName).updateOne({ _id: new ObjectId(productId) }, { $set: { quantity: quantity } });

    res.status(200).json({ message: 'Product quantity updated successfully', quantity });
  } catch (error) {
    console.error('Error updating product quantity:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/:id/reviews', async (req, res) => {
  try {
    const db = await getDB();
    const product = await db.collection(productsCollectionName).findOne({ _id: new ObjectId(req.params.id) });
    res.json(product.reviews || []);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST /api/products/:id/reviews
router.post('/:id/addReviews', async (req, res) => {
  try {
   
    const db = await getDB();
    const productId = req.params.id;
    const { username, text, rating, createdAt } = req.body;
    
    
    // Create a new review object
    const newReview = { _id: new ObjectId(),username,text,rating,createdAt,};
    
    // Find the product by ID and update its reviews array
    const result = await db.collection(productsCollectionName).findOneAndUpdate(
      { _id: new ObjectId(productId) },
      { $push: { reviews: newReview } },
      { returnOriginal: false } // Return the updated document
    );
    const product = await db.collection(productsCollectionName).findOne({ _id: new ObjectId(productId) });
    const account = await db.collection(accountsCollectionName).findOne({ username: username });
    
    // we need to update the stars field based on the new rating by calculating the average
    const totalStars = product.reviews.reduce((acc, review) => acc + review.rating, 0); 
    const newStars = totalStars / product.reviews.length;
    console.log("total stars", totalStars);
    console.log("new stars", newStars);
    await db.collection(productsCollectionName).updateOne(
      { _id:new ObjectId(productId)},
      {  $set: {stars: newStars}
      }
    );
    // Add the review to the user's account
 const userReview = { product, newReview };
    if (account.reviews) {
      account.reviews.push(userReview);
      await db.collection(accountsCollectionName).updateOne(
        { username: username },
        { $set: { reviews: account.reviews } }
      );
    } else {
      await db.collection(accountsCollectionName).updateOne(
        { username: username },
        { $set: { reviews: [userReview] } }
      );
    }
    
    // Send back the updated reviews array
    res.json(result.reviews);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




export default router;
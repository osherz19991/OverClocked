// api/products.js

import express from 'express';
import { connectDB } from '../config/db.js';
import { ObjectId } from 'mongodb';

const router = express.Router();
const productsCollectionName = 'Products';

// Connect to the database
const connectToDBAndCreateTextIndex = async () => {
  const db = await connectDB();

  // Create a text index on the fields you want to search on
  await db.collection(productsCollectionName).createIndex({
    title: 'text', // Assuming 'title' is one of the fields you want to search on
    description: 'text' // Assuming 'description' is another field you want to search on
  });
};

connectToDBAndCreateTextIndex(); // Call the function to create the text index when the server starts

// GET route to fetch products with pagination, search query, and sorting
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default page to 1 if not provided
    const limit = 2400; // Limit the number of products per page to 24
    const skip = (page - 1) * limit; // Calculate number of documents to skip
    const db = await connectDB();
    const searchQuery = req.query.search; // Get the search query from the request
    const sortField = req.query.sortBy || null; // No default sort field
    const sortOrder = req.query.sortOrder || null; // No default sort order

    // Define the search filter based on the search query
    const filter = searchQuery ? { $text: { $search: searchQuery } } : {};
    const products = await db.collection(productsCollectionName)
      .find(filter)
      .skip(skip)
      .limit(limit)
      .toArray();
      
    // Fetch products for the current page with pagination, search filter, and sorting
    
    console.log(sortField);
    console.log(sortOrder);
    console.log(searchQuery);
    if (!searchQuery && sortField && sortOrder) {
      const sortCriteria = {};
      sortCriteria[sortField] = sortOrder === 'asc' ? 1 : -1;

      // If sorting by price, ensure it's treated as a numeric field
      if (sortField === 'price') {
        sortCriteria[sortField] = sortOrder === 'asc' ? 1 : -1;
      }

      products.sort((a, b) => {
        const aValue = parseFloat(a[sortField]);
        const bValue = parseFloat(b[sortField]);
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });

    }

    // Count total number of documents in the collection based on the search filter
    const totalCount = await db.collection(productsCollectionName).countDocuments(filter);

    // Calculate total number of pages
    const totalPages = Math.ceil(totalCount / limit);

    // Send response with products and pagination information
    res.json({ products, totalPages });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = await connectDB();
    const product = await db.collection(productsCollectionName).findOne({ _id: new ObjectId(req.params.id) });
    console.log('Fetched product:', product);
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

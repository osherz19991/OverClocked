// routes/productRoutes.js

import express from 'express';
import { ObjectId } from 'mongodb';

const router = express.Router();
const productsCollectionName = 'Products';

router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const page = parseInt(req.query.page) || 1;
    const limit = 2400;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.search;
    const sortField = req.query.sortBy || null;
    const sortOrder = req.query.sortOrder || null;

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
    const totalPages = Math.ceil(totalCount / limit);

    res.json({ products, totalPages });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const product = await db.collection(productsCollectionName).findOne({ _id: new ObjectId(req.params.id) });
    console.log('Fetched product:', product);
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
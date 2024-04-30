import express from 'express';
import { connectDB } from '../config/db.js';
import { ObjectId } from 'mongodb';

const router = express.Router();
const productsCollectionName = 'Products';

// GET route to fetch all products
router.get('/', async (req, res) => {
  try {
    const db = await connectDB();
    const products = await db.collection(productsCollectionName).find({}).toArray();
    console.log('Fetched products:', products);
    res.json(products);
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
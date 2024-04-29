import express from 'express';
const router = express.Router();

// Import any necessary middleware or dependencies

const productRoutes = (db) => {
  // GET route to fetch all products
  router.get('/', async (req, res) => {
    try {
      const products = await db.collection('Products').find().toArray();
      res.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Add more routes for other CRUD operations if needed

  return router;
};

export default productRoutes;
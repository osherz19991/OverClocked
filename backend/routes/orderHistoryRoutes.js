import express from 'express';
import { getDB } from '../config/db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { username } = req.body;

    const db = await getDB();
    const accountsCollectionName = 'accounts';
    const account = await db.collection(accountsCollectionName).findOne({ username: username });
    const orders = account.orderHistory;
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


  



export default router;

// checkoutRoutes.js

import express from 'express';
import { getDB } from '../config/db.js';

const router = express.Router();

const generateUniqueId = () => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 15; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// Route for handling checkout requests
router.post('/', async (req, res) => {
  try {
    // Retrieve the checkout details from the request body
    const { username, cartItems, totalPrice } = req.body;

    const db = await getDB();
    const accountsCollectionName = 'accounts';
    const orderId = generateUniqueId();
    
    const account = await db.collection(accountsCollectionName).findOne({ username: username });
    const itemsArray = JSON.parse(cartItems);
    const cartCategories = itemsArray.map(item => item.Category);
    
    // Only add categories that don't already exist in the cart
    const uniqueCartCategories = [...new Set(cartCategories)];
    const existingCategories = new Set(account.categories);
    const newCategories = uniqueCartCategories.filter(category => !existingCategories.has(category));

    // Update the cart field in the account with the new categories
    if (newCategories.length > 0) {
      account.categories.push(...newCategories);
      await db.collection(accountsCollectionName).updateOne(
        { username: username },
        { $set: { categories: account.categories } }
      );
    }
    
    // Construct the order object and add it to orderHistory
    const order = { cartItems, totalPrice, date: new Date(), id: orderId };
    account.orderHistory.push(order);

    // Update the account document with the modified orderHistory
    await db.collection(accountsCollectionName).updateOne(
      { username: username },
      { $set: { orderHistory: account.orderHistory } }
    );

    res.status(200).json({ message: 'Checkout successful' });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

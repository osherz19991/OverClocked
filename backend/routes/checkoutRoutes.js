import express from 'express';
import { getDB } from '../config/db.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Generate a unique ID for the order
const generateUniqueId = () => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < 15; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// Send order confirmation email
const sendOrderConfirmationEmail = async (username, orderId, totalPrice, recipientEmail) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: true,
    auth: {
      user: 'overclocked.users@gmail.com',
      pass: 'bumn hozy elrp uirz',
    },
  });

  const mailOptions = {
    from: 'overclocked.users@gmail.com',
    to: recipientEmail,
    subject: `Bill Number: ${orderId}`,
    text: `Hi ${username},

    Thank you for choosing OverClocked for your purchase. We greatly appreciate your support!
    
    Your total bill comes to ${totalPrice}. We hope you find your items satisfactory and they enhance your gaming experience.
    
    Always here to elevate your gaming journey,
    
    OverClocked`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Handle the checkout process
router.post('/', async (req, res) => {
  try {
    const { username, cartItems, totalPrice, paymentDetails, billingAddress } = req.body;

    const db = await getDB();
    const accountsCollectionName = 'accounts';
    const orderId = generateUniqueId();

    const account = await db.collection(accountsCollectionName).findOne({ username });
    const itemsArray = JSON.parse(cartItems);
    const cartCategories = itemsArray.map(item => item.Category);

    const uniqueCartCategories = [...new Set(cartCategories)];
    const existingCategories = new Set(account.categories || []);
    const newCategories = uniqueCartCategories.filter(category => !existingCategories.has(category));

    // Update billing address if not already set
    if (!account.billingAddress) {
      await db.collection(accountsCollectionName).updateOne(
        { username },
        { $set: { billingAddress } }
      );
    }

    // Update categories if there are new ones
    if (newCategories.length > 0) {
      const updatedCategories = account.categories ? [...account.categories, ...newCategories] : newCategories;
      await db.collection(accountsCollectionName).updateOne(
        { username },
        { $set: { categories: updatedCategories } }
      );
    }

    // Update order history
    const order = { cartItems, totalPrice, date: new Date(), id: orderId };
    const updatedOrderHistory = account.orderHistory ? [...account.orderHistory, order] : [order];
    await db.collection(accountsCollectionName).updateOne(
        { username },
        { $set: { orderHistory: updatedOrderHistory } }
    );

    // Update payment methods if the card is not already present
    const existingPaymentMethods = account.paymentMethods || [];
    const paymentMethodExists = existingPaymentMethods.some(
      method => method.cardNumber === paymentDetails
    );
    
    if (!paymentMethodExists) {
      existingPaymentMethods.push(paymentDetails);
      await db.collection(accountsCollectionName).updateOne(
        { username },
        { $set: { paymentMethods: existingPaymentMethods } }
      );
    }

    // Insert purchase into 'purchases' collection
    const purchaseData = {
      username: username,
      orderId: orderId,
      cartItems: cartItems,
      totalPrice: totalPrice,
      paymentDetails: paymentDetails,
      billingAddress: billingAddress,
      purchaseDate: new Date()
    };

    await db.collection('purchases').insertOne(purchaseData);

    // Send confirmation email
    await sendOrderConfirmationEmail(username, orderId, totalPrice, account.mail);

    res.status(200).json({ message: 'Checkout successful' });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for fetching existing payment methods and billing address
router.post('/paymentMethods', async (req, res) => {
  try {
    const { username } = req.body;
    const db = await getDB();
    const accountsCollectionName = 'accounts';

    const account = await db.collection(accountsCollectionName).findOne({ username });

    if (account) {
      res.status(200).json({
        paymentMethods: account.paymentMethods || [],
        billingAddress: account.billingAddress || {},
      });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching payment methods and billing address:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

import express from 'express';
import { getDB } from '../config/db.js';
import nodemailer from 'nodemailer';

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

router.post('/', async (req, res) => {
  try {
    const { username, cartItems, totalPrice, paymentDetails, billingAddress } = req.body;

    const db = await getDB();
    const accountsCollectionName = 'accounts';
    const orderId = generateUniqueId();

    const account = await db.collection(accountsCollectionName).findOne({ username: username });
    const itemsArray = JSON.parse(cartItems);
    const cartCategories = itemsArray.map(item => item.Category);

    const uniqueCartCategories = [...new Set(cartCategories)];
    const existingCategories = new Set(account.categories);
    const newCategories = uniqueCartCategories.filter(category => !existingCategories.has(category));

    if (!account.billingAddress) {
      await db.collection(accountsCollectionName).updateOne(
        { username: username },
        { $set: { billingAddress: billingAddress } }
      );
    }

    if (newCategories.length > 0) {
      const updatedCategories = account.categories ? [...account.categories, ...newCategories] : newCategories;
      await db.collection(accountsCollectionName).updateOne(
        { username: username },
        { $set: { categories: updatedCategories } }
      );
    }

    const order = { cartItems, totalPrice, date: new Date(), id: orderId };
    const updatedOrderHistory = account.orderHistory ? [...account.orderHistory, order] : [order];
    await db.collection(accountsCollectionName).updateOne(
      { username: username },
      { $set: { orderHistory: updatedOrderHistory } }
    );

    const existingPaymentMethods = account.paymentMethods || [];
    const paymentMethodExists = existingPaymentMethods.some(
      method => method.cardNumber === paymentDetails.cardNumber
    );

    if (!paymentMethodExists) {
      existingPaymentMethods.push(paymentDetails);
      await db.collection(accountsCollectionName).updateOne(
        { username: username },
        { $set: { paymentMethods: existingPaymentMethods } }
      );
    }

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
      to: account.mail,
      subject: `Bill Number: ${orderId}`,
      text: `Hi ${username},

      Thank you for choosing OverClocked for your purchase. We greatly appreciate your support!
      
      Your total bill comes to ${totalPrice}. We hope you find your items satisfactory and they enhance your gaming experience.
      
      Always here to elevate your gaming journey,
      
      OverClocked`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(200).json({ message: 'Checkout successful' });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route for fetching existing payment methods
router.post('/paymentMethods', async (req, res) => {
  try {
    const { username } = req.body;
    const db = await getDB();
    const accountsCollectionName = 'accounts';

    const account = await db.collection(accountsCollectionName).findOne({ username: username });

    if (account) {
      res.status(200).json({
        paymentMethods: account.paymentMethods || [],
        billingAddress: account.billingAddress || {}
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
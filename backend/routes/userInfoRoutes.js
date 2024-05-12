// userInfoRoutes.js

import express from 'express';
import nodemailer from 'nodemailer';
import { connectDB } from '../config/db.js';

const router = express.Router();

// Route handler for user sign-in
router.post('/', async (req, res) => {
  try {
    // Extract user data from request body
    const { username } = req.body;
    const db = await connectDB();
    const accountsCollectionName = 'accounts';
    const account = await db.collection(accountsCollectionName).findOne({  $or: [{ email: username }, { username: username }]});
    if (!account)
        return res.status(401).json({ error: 'Invalid username or password' });
    else
      res.json({username: account.username, mail: account.mail, password: account.password});


  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/sendPassword', async (req, res) => {
  try {
    const { identifier, username } = req.body;
    const db = await connectDB();
    const accountsCollectionName = 'accounts';
    const account = await db.collection(accountsCollectionName).findOne({  $or: [{ mail: identifier }, { username: username }]});
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: true, 
        auth: {
          user: 'overclocked.users@gmail.com', // Your Gmail email address
          pass: 'bumn hozy elrp uirz', // Your Gmail password
        },
      });
  
      const mailOptions = {
        from: 'overclocked.users@gmail.com',
        to: account.mail,
        subject: 'Password',
        text: 'Your Password is: ' + account.password,
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
        } else {
          console.log('Email sent:', info.response);
        }
      });
    } catch (error) {
      console.error('Error sending password:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

router.post('/logout', async (req, res) => {
  try {
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  
export default router;

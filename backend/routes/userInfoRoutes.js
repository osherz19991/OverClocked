
import express from 'express';
import { getDB } from '../config/db.js';
import multer from 'multer';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const generateResetToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

router.post('/', async (req, res) => {
  try {
    // Extract user data from request body
    const { username } = req.body;
    const db = await getDB();
    const accountsCollectionName = 'accounts';
    const account = await db.collection(accountsCollectionName).findOne({ $or: [{ email: username }, { username: username }] });
    if (!account)
      return res.status(401).json({ error: 'Invalid username or password' });
    else
      res.json(account);


  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/toggleEmailNotifications', async (req, res) => {
  try {
    const { username } = req.body;
    const db = await getDB();
    const accountsCollectionName = 'accounts';
    const account = await db.collection(accountsCollectionName).findOne({ username: username });
    account.emailNotifications = !(account.emailNotifications);
    await db.collection(accountsCollectionName).updateOne(
      { username: username },
      { $set: { emailNotifications: account.emailNotifications } }
    );
    res.json(account.emailNotifications);

  } catch (error) {
    console.error('Error toggle Email Notifications ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.get('/checkUserRole', async (req, res) => {
  try {
    const db = await getDB();
    const usersCollection = db.collection('accounts');
    const { username } = req.query; // Use req.query to get URL parameters
    const account = await usersCollection.findOne({ $or: [{ email: username }, { username: username }] });
    if (!account)
      return res.status(401).json({ error: 'Invalid username or user is not an admin' });
    else
      res.status(200).json(account.role);
  } catch (error) {
    console.error('Error checking user if is admin:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

 // logout route
router.post('/logout', async (req, res) => {
  try {
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Password reset route
router.post('/sendPasswordReset', async (req, res) => {
  try {
    // Extract user data from request body
    const { mail, username } = req.body;
    const db = await getDB();
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

    const resetToken = generateResetToken();

    // Save the token in the database for later verification
    await db.collection('passwordResetTokens').insertOne({ mail, token: resetToken });

    const resetLink = `http://http://localhost:3000/password-reset?token=${resetToken}`;
    const mailOptions = {
      from: 'overclocked.users@gmail.com',
      to: mail,
      subject: 'Reset Password',
      text: 'Your password reset link is here please press here in order to reset your password\n' + resetLink,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    res.json({ message: 'Password reset link sent' });

  } catch (error) {
    console.error('Error during sign-in:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// new route to update user info
router.put('/updateUserInfo', async (req, res) => { 
  try {
    const { username, email } = req.body;
    const db = await getDB();
    const accountsCollectionName = 'accounts';
    const account = await db.collection(accountsCollectionName).findOne({ username: username });
    if (!account)
      return res.status(401).json({ error: 'Invalid username' });
    else {
      if (email)
        account.email = email;
    
      await db.collection(accountsCollectionName).updateOne(
        { username: username },
        { $set: { email: account.email} }
      );
      res.json(account);
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;

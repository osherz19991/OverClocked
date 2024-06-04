// config/db.js

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoUrl = 'mongodb+srv://osherzafar1973:zafar1234@cluster0.ol7kukn.mongodb.net/';
const dbName = 'final_project';

let dbClient;
let database;

export const connectDB = async () => {
  try {
    if (!mongoUrl) {
      throw new Error('MongoDB connection string is not provided.');
    }

    dbClient = await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
    database = dbClient.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export const getDB = () => {
  if (!dbClient || !database) {
    throw new Error('Database not connected!');
  }
  return database;
};
{/*
export const getGridFSBucket = () => {
  if (!dbClient || !database) {
    throw new Error('Database not connected!');
  }
  return new mongoose.mongo.GridFSBucket(database, { bucketName: 'files' });

};
*/}
export const closeDB = async () => {
  try {
    if (dbClient) {
      await dbClient.close();
      console.log('Disconnected from MongoDB');
    }
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error);
    throw error;
  }
};



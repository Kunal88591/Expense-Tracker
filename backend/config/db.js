import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.error('MONGODB_URI is totally missing. You must add it to your environment variables.');
      throw new Error('MONGODB_URI is required to connect to MongoDB Atlas');
    }

    // Connect to MongoDB Atlas
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Re-throw so the server knows it failed
    throw error;
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
};

export default connectDB;

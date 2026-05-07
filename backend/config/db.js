import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    let connectionUri = mongoUri;
    const isProduction = process.env.NODE_ENV === 'production';

    if (!mongoUri && isProduction) {
      throw new Error('MONGODB_URI is required in production');
    }

    if (!mongoUri && !isProduction) {
      // Local-dev fallback so the API can run even if Atlas credentials are not configured yet.
      memoryServer = await MongoMemoryServer.create();
      connectionUri = memoryServer.getUri();
      console.warn('MONGODB_URI not set. Using in-memory MongoDB for local development.');
    }

    const conn = await mongoose.connect(connectionUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export const closeDB = async () => {
  await mongoose.connection.close();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

export default connectDB;

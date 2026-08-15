import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/jobportal', {
      serverSelectionTimeoutMS: 2000 // Fast fail to fallback if local mongod is not running
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(`Local MongoDB connection failed (${error.message}). Initializing In-Memory Mongo Database fallback...`);
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Memory Server Connected successfully at: ${conn.connection.host}`);
    } catch (memError) {
      console.error(`MongoDB Memory Server Error: ${memError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;

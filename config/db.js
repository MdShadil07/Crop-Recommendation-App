const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI; // e.g., "mongodb://localhost:27017/coin2flow"
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME || 'coin2flow'); // default DB name
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}

// Exported getter
function getDb() {
  if (!db) throw new Error('Database not connected yet!');
  return db;
}

module.exports = { connectDB, getDb };

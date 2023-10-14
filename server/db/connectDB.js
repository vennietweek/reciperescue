const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://mcomp5007:ICEmilo2023@cluster0.usczdrl.mongodb.net/?retryWrites=true&w=majority";  // replace with your URI from MongoDB Atlas
const client = new MongoClient(uri);

let db;

async function connectDB() {
    if (db) return db;

    await client.connect();
    db = client.db('recipeRescue');

    return db;
}

module.exports = { connectDB, db } 

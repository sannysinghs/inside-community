const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI || "mongodb+srv://tixeonjobs:hu92UdzbZFJXrsM@room-rentals-1.5lxx2.mongodb.net/?retryWrites=true&w=majority&appName=room-rentals-1"
const db_name = process.env.MONGODB_NAME || "room_rentals"

let dbConnection; 

async function connect() {
    if (!dbConnection) {
        try {
            const client = new MongoClient(uri)
            await client.connect()
            dbConnection = client.db(db_name)
        } catch (error) {
            console.log(error)
        }
    }

    return dbConnection
}
module.exports = { connect }
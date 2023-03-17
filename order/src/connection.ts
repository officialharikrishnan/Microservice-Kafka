import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017/Kafka-orders')

const db = mongoose.connection

export default db
import mongoose from "mongoose";

mongoose.connect('mongodb://localhost:27017/Kafka-products')

const db = mongoose.connection

export default db
import mongoose from 'mongoose'
import db from './connection'

function insertPorduct(data:object){
    console.log(data);
    
    db.collection('product').insertOne(data)
}


async function findProduct(data:string){
    const product =await  db.collection('product').findOne({_id:new mongoose.Types.ObjectId(data)})
    return product
    
}

export { findProduct,insertPorduct }
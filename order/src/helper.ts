import mongoose from 'mongoose'
import db from './connection'


async function createOrder(data:object){
    let orderId
    await db.collection('orders').insertOne(data).then((res)=>{
         orderId= res.insertedId
    })
    return orderId
}
async function editOrder(id:string,status:string){
    const _id=""+id
    console.log(_id,status);
    await db.collection('orders').updateOne({_id:new mongoose.Types.ObjectId(_id)},{
        $set:{
            paymentStatus:status
        }
    })
    
}

export { createOrder, editOrder}
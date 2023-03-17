import express from 'express'
import { Kafka , Partitioners} from 'kafkajs'
import {insertPorduct,findProduct} from './helper'
import bodyParser from 'body-parser'
const app= express()
const port=6000
app.use(bodyParser.json())

const kafka = new Kafka({
    clientId:"my-kafka1",
    brokers:['localhost:9092']
});

kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner })
const producer = kafka.producer();
const consumer  = kafka.consumer({groupId:'group1'})
async function sendMessage(topic:string,message:any){
    await producer.connect()
    await producer.send({
        topic,
        messages:[{value:message}]
    })
    console.log(topic,"published");
    
    await producer.disconnect();
}
async function listenToMessage(topic:string){
    await consumer.connect()
    await consumer.subscribe({topic})
    await consumer.run({
        eachMessage:async ({partition,message,topic})=>{
            const data = message.value?.toString()
            
        }
    }) 
}
app.post('/create-product',(req,res)=>{
    console.log(req.body);    
    insertPorduct(req.body)
})
app.post('/order-product',async (req, res) => {
    const id= req.body.id
    let product = await findProduct(id)
    if(product){    
        product.purpose='order'
        const data = JSON.stringify(product)
        await sendMessage('order',data)
        res.send(data) 
    }else{
        res.send("product not found")
    }

}); 
  

app.listen(port,()=>{
    console.log("product server listening on",port); 
     
})  
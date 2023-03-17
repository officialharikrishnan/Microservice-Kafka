import express from 'express';
import { Kafka } from 'kafkajs';
import { createOrder, editOrder } from './helper';
import bodyParser from 'body-parser';

const app = express();
const port = 6100;
app.use(bodyParser.json());

const kafka = new Kafka({
  clientId: 'my-kafka2',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'group2' });

async function sendMessage(topic: string, message: any) {
    console.log(topic,message);
    
  await producer.connect();
  await producer.send({ 
    topic,
    messages: [{
      value: JSON.stringify(message)
    }]
  });
  console.log("payment published....",message);

  await producer.disconnect();
}
 
async function listenToMessage(topic: string) {
    console.log("Listening to message...");
    
  await consumer.connect();
  await consumer.subscribe({topic,fromBeginning:true});
  await consumer.run({
     eachMessage: async ({ message }) => {
        if (message.value !== null) { // type guard to check for null
            try {
              const product = JSON.parse(message.value.toString());
              console.log("output>>>",product);
              if(product.purpose=='order'){
                  let order={
                    product,
                    paymentStatus:'pending'
                  } 
                  const orderID =await createOrder(order); 
                  console.log(">>>?????///",orderID);
                  await sendMessage('Dopayment',orderID)
              }else if(product.purpose='payment-status'){
                console.log(product);
                
                if(product.status){
                    editOrder(product.id,'Payment Success')
                }else{
                    editOrder(product.id,'Payment failed')
                }
              }
               
            } catch (err) {
              console.error('Error parsing message value:', err);
            }
          }
    } 
  })
}

async function getMessage(){
    listenToMessage('order')
    listenToMessage('paymentstatus')
}
getMessage().then(()=>{
    app.listen(port, () => {
        console.log("order server listening on", port);
    });
}).catch((err)=>{
    console.log(">>>>>>>>>",err);
    
})
  
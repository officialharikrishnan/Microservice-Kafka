import express from 'express';
import { Kafka } from 'kafkajs';
import bodyParser from 'body-parser';

const app = express();
const port = 6300;
app.use(bodyParser.json());

const kafka = new Kafka({
  clientId: 'my-kafka3',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'group3' });

async function sendMessage(topic: string, message: any) {
  await producer.connect();
  await producer.send({ 
    topic:topic,
    messages: [{
      value: message
    }]
  });
  console.log("payment published....",message);

  await producer.disconnect();
}
 
async function listenToMessage(topic: string) {
    console.log("Listening to message...",topic);
    
  await consumer.connect();
  await consumer.subscribe({topic,fromBeginning:true});
  await consumer.run({
     eachMessage: async ({ message }) => {
        if (message.value !== null) { // type guard to check for null
            try {
              const product = JSON.parse(message.value.toString());
              console.log("output>>>",product);
              const PayResponse={
                id:product,
                purpose:'payment-status',
                status:false
              }
              sendMessage('paymentstatus',JSON.stringify(PayResponse))
            } catch (err) {
              console.error('Error parsing message value:', err);
            }
          }
    } 
  })
}

async function getMessage(){
    listenToMessage('Dopayment')
}
getMessage().then(()=>{
    app.listen(port, () => {
        console.log("payment server listening on", port);
    });
}).catch((err)=>{
    console.log(">>>>>>>>>",err);
    
})
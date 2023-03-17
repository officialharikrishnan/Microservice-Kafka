"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const kafkajs_1 = require("kafkajs");
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = 6100;
app.use(body_parser_1.default.json());
const kafka = new kafkajs_1.Kafka({
    clientId: 'my-kafka',
    brokers: ['localhost:9092']
});
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'kafka-group' });
function sendMessage(topic, message) {
    return __awaiter(this, void 0, void 0, function* () {
        yield producer.connect();
        yield producer.send({
            topic,
            messages: [{
                    value: message
                }]
        });
        yield producer.disconnect();
    });
}
function listenToMessage(topic) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(">>>>&&>>>>>>");
        yield consumer.connect();
        yield consumer.subscribe({ topic });
        yield consumer.run({
            eachMessage: ({ message }) => __awaiter(this, void 0, void 0, function* () {
                if (message.value !== null) { // type guard to check for null
                    try {
                        const product = JSON.parse(message.value.toString());
                        console.log("output>>>", product);
                    }
                    catch (err) {
                        console.error('Error parsing message value:', err);
                    }
                }
            })
        });
    });
}
listenToMessage('create-order').then(() => {
    app.listen(port, () => {
        console.log("order server listening on", port);
    });
});

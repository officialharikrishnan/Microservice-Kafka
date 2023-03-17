"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = void 0;
const connection_1 = __importDefault(require("./connection"));
function createOrder(data) {
    connection_1.default.collection('product').insertOne(data);
}
exports.createOrder = createOrder;

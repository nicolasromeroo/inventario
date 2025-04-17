
import mongoose, { Schema } from "mongoose";

const productCollection = "products"

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    cantidadBultos: {
        type: Number,
        default: 0
    },
    unidadesPorBulto: {
        type: Number,
        required: true
    },
    lastDeliveryDate: {
        type: Number,
        default: null
    },
    expirationDates: {
        type: [
            {
                date: { type: Date, required: true },
                stock: { type: Number, default: 0 }
            }
        ],
        default: []
    },
    position: {
        type: String,
        default: null,
    }
})

const Product = mongoose.model("Product", productSchema, productCollection)

export default Product
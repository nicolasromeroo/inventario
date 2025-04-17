
import mongoose, { Schema } from "mongoose"

const fechaCollection = "fechas"

const fechaSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    },
    expirationDates: [
        {
            type: Date
        }
    ],
    quantity: {
        type: Number
    }
})

const Fecha = mongoose.model("Fecha", fechaSchema, fechaCollection)

export default Fecha

// User.js
import mongoose from "mongoose"

const userCollection = "users"

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    documents: {
        type: [
            {
                name: {
                    type: String,
                    requered: true,
                },
                reference: {
                    type: String,
                    requered: true
                }
            }
        ],
        default: []
    },
    last_connection: {
        type: Date,
        default: null, 
    }
},
    {
        timestamps: true
    })

export const userModel = mongoose.model(userCollection, userSchema)


import mongoose from 'mongoose'
import { userModel } from '../../src/models/User.js'
import { expect } from 'chai'
import crypto from 'crypto'
import dotenv from "dotenv"

dotenv.config()

describe("Testing User DB", async function () {
    let idUser
    before(async () => {
        const mongoURL = process.env.MONGO_URL

        mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() => console.log("DB is connected"))
            .catch((e) => console.log("Error al conectarme a DB:", e))
    })

    it("Crear un usuario", async () => {
        let mockUser = {
            first_name: "Pepe",
            last_name: "Perez",
            email: `pepe${crypto.randomBytes(5).toString('hex')}@pepe.com`,
            password: "coder",
            age: 20
        }

        const newUser = await userModel.create(mockUser)
        idUser = newUser._id
        expect(newUser).to.have.property("email")
    })

    it("Obtener todos los usuarios", async () => {
        const users = await userModel.find()

        //expect(users).to.be.deep.equal([])
        expect(Array.isArray(users)).to.be.ok //true con assert
    })

    it("Obtener un usuario", async () => {
        const user = await userModel.findById(idUser)

        expect(user).to.have.property("cart")
        //assert.strictEqual(typeof user, "object")
    })

    it("Actualizar Un usuario", async () => {
        let mockUserUpdate = {
            first_name: "Pedro",
            last_name: "Parez",
            email: `pepe${crypto.randomBytes(5).toString('hex')}@pepe.com`,
            password: "coder",
            age: 20
        }

        const userUpdate = await userModel.findByIdAndUpdate(idUser, mockUserUpdate)
        const user = await userModel.findById(userUpdate._id)

        expect(user).to.property("first_name").to.be.equal("Pedro")
        //assert.deepStrictEqual(typeof userUpdate.email, "string")
    })

    it("Eliminar Un usuario", async () => {

        const userDelete = await userModel.findByIdAndDelete(idUser)
        let rta = await userModel.findById(userDelete._id)
        expect(rta).to.be.equal(null)
        //assert.strictEqual(rta, null)
    })
})
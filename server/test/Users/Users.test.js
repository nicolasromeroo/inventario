
import mongoose from "mongoose"
import { userModel } from "../../src/models/User.js"
import Assert from "assert"

const mongoURL = process.env.MONGO_URL
if (!mongoURL) throw new Error("La URI de MongoDB no está definida en las variables de entorno.")
await mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const assert = Assert.strict

describe('Testing users', async () => {
    // let idUser
    it('Obtener todos los usuarios', async function () {
        const users = await userModel.find()
        assert.strictEqual(Array.isArray(users), true)
    })

    it('Obtener usuario por username', async function () {
        const username = userModel.username
        const users = await userModel.findById(username)

        assert.strictEqual(typeof userModel, "object")
    })

    it('Crear un usuario', async function () {
        let mockUser = {
            // first_name: "Nicolas",
            // last_name: "Romero",
            // email: `nico${crypto.randomBytes(5).toString('hex')}@gmail.com`,
            username: "nicorom",
            password: "12345"
        }
        const newUser = await userModel.create(mockUser)
        idUser = newUser._id
        assert.deepStrictEqual(typeof newUser.email, "string")
    })

    it('Actualizar un usuario', async function () {
        let mockUserUpdate = {
            // first_name: "Juan",
            // last_name: "Romero",
            // email: `nico${crypto.randomBytes(5).toString('hex')}@gmail.com`,
            username: "nicorom",
            password: "nick"
        }

        const userUpdate = await userModel.findByIdAndUpdate(idUser, mockUserUpdate)
        console.log(userUpdate)

        assert.deepStrictEqual(typeof userUpdate.email, "string")
    })

    it('Eliminar un usuario', async function () {
        const userDelete = await userModel.findByIdAndDelete()
        let rta = await userModel.findById(userDelete._id)

        assert.strictEqual(rta, null)
    })
})


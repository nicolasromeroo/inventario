
// test/Users/UsersSupertest.test.js
import { expect } from "chai"
import mongoose from "mongoose"
import supertest from "supertest"
import dotenv from "dotenv"
import crypto from "crypto"

dotenv.config()

// const expect = chai.expect

const requester = supertest("http://localhost:8080")

describe("Rutas de sesión de usuario (Register, Login, Profile)", function () {
  let user = {}
  let token = ""

  before(async () => {
    try {
      const mongoURL = process.env.MONGO_URL
      await mongoose.connect(mongoURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      console.log("DB is connected")
    } catch (e) {
      console.error("Error al conectarme a DB:", e)
    }
  })

  after(async () => {
    await mongoose.disconnect()
  })

  // correccion 1 
  it("Ruta: POST /api/register - Registrar un usuario", async () => {
    const newUser = {
      first_name: "Martino",
      last_name: "Pereziano",
      email: `martiiiin${crypto.randomBytes(5).toString("hex")}@pepe.com`,
      password: "coder",
      age: 20,
    }

    const { statusCode, body } = await requester
      .post("/api/register")
      .send(newUser)

    user = newUser

    expect(statusCode).to.equal(201)
    expect(body).to.have.property("message", "User registered successfully")
  })

  it("Ruta: POST /api/auth/login - Autentica al usuario y devolver un token", async () => {
    const { statusCode, body } = await requester
      .post("/api/login")
      .send({ email: user.email, password: user.password })

    expect(statusCode).to.equal(200)
    expect(body).to.have.property("token")

    token = body.token
  })

  it("Ruta: GET /api/profile - Devuelve el perfil del usuario autenticado", async () => {
    const { statusCode, body } = await requester
      .get("/api/profile")
      .set("Authorization", `Bearer ${token}`)

    expect(statusCode).to.equal(200)
    expect(body).to.have.property("email", user.email)
    expect(body).to.have.property("first_name", user.first_name)
    expect(body).to.have.property("last_name", user.last_name)
  })
})

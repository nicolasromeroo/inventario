
import express from "express"
import cors from "cors"
import productsRoutes from "./routes/products.router.js"
import datesRoutes from "./routes/dates.router.js"
import { connectMongoDB } from "./db/connect.js"

connectMongoDB()

const app = express()

app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173", “https://inventario-git-master-nicolas-projects-a0f909f1.vercel.app"]
}))

app.use("/api/products", productsRoutes)
app.use("/api/dates", datesRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

export default app
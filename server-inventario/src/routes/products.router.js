
import { Router } from "express"
import { addProduct, deleteProduct, getProducts, updateProduct, updateProductPosition } from "../controllers/products.controller.js"

const router = Router()

router.post("/addProduct", addProduct)
router.get("/getProducts", getProducts)
// router.get("/getProduct/:id", getProductById)
router.put("/updateProduct/:id", updateProduct)
router.delete("/deleteProduct/:id", deleteProduct)
router.put("/updatePosition/:id/position", updateProductPosition)

export default router
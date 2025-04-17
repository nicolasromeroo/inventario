
import { Router } from "express";
import { addExpirationDate, getExpiringProducts, removeExpirationDate } from "../controllers/dates.controller.js";

const router = Router()

router.get("/getDate", getExpiringProducts)
router.post("/addDate", addExpirationDate)
router.delete("/deleteDate", removeExpirationDate)

export default router
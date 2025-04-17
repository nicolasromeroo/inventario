
// authRouter.router.js
import { Router } from "express"
import { register, login, logout, profile } from "../controllers/auth.controller.js";
import { authRequired } from "../middleware/validateToken.middleware.js";

const router = Router()

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout)
router.get("/profile", authRequired, profile)

export default router

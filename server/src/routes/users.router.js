
import { Router } from "express"
import { sendDocs } from "../controllers/users.controller.js"
import { uploadDocs } from "../config/multer.js"

const userRouter = Router()

userRouter.post("/:uid/documents", uploadDocs.array("newDocs"), sendDocs)

export default userRouter
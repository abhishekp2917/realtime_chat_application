const express = require("express")
const chatPageMiddleware = require("../middleware/chatPage-middleware")
const chatPageGetController = require("../controller/chatPageGet-controller")
const chatPagePostController = require("../controller/chatPagePost-controller")

const router = express.Router()

router.use("/chat", chatPageMiddleware)

router.get("/chat", chatPageGetController)

router.post("/chat", chatPagePostController)

module.exports = router
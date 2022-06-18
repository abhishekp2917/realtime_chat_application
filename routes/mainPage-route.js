const express = require("express")
const mainPagePostController = require("../controller/mainPagePost-controller")
const router = express.Router()

router.post("/",mainPagePostController)

module.exports = router
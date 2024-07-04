const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/post", require("./post"));
router.use("/follow", require("./follow"));
module.exports = router;

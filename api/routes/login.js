const PORT = 3000;
const express = require("express");
const router = express.Router();
const path = require("path");


  router.use((req, res, next) => {
    res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    next();
  });
  

router
  .route("/")
  .post((req, res) => {
    const token = req.body;
    res.sendFile(path.join(__dirname, "../html/index.html"));
  })
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "../html/login.html"));
  });

  module.exports = router;
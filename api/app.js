const PORT = 3000;

const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const https = require("https");
const fs = require("fs");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
const options = {
  key: fs.readFileSync("localhost-key.pem"),
  cert: fs.readFileSync("localhost.pem"),
};

//Routes
var loginRouter = require("./routes/login");
var generatorRouter = require("./routes/generator");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./html/login.html"));
});
app.use(express.static(path.join(__dirname, "./html")));

app.use(express.json()); // para lectura de application/json

app.post("/",(req, res) => {
    
  const token = req.body;
  if (token) {
    res.cookie('myTokenCookie', token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.status(200).json({ message: 'Token almacenado con éxito' });
  } else {
    res.status(400).json({ error: 'Token no proporcionado' });
  }
})

app.use("/login", loginRouter);
app.use("/", generatorRouter);

https.createServer(options, app).listen(PORT, () => {
  console.log(`Servidor corriendo en https://localhost:${PORT}`);
});



module.exports = app;

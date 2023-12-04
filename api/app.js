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

let useLoginHtml = true; // Bandera para controlar la ruta de la página inicial

app.get("/", (req, res) => {
  if (useLoginHtml) {
    res.sendFile(path.join(__dirname, "./html/login.html"));
  } else {
    res.redirect("/generador"); // Redirige a la ruta /generador
  }
});
app.use(express.static(path.join(__dirname, "./html")));

app.use(express.json()); // para lectura de application/json

app.post("/", (req, res) => {
  const token = req.body;
  if (token) {
    res.cookie('myTokenCookie', token, { httpOnly: true, secure: true, sameSite: 'none' });
    useLoginHtml = false; // Cambia la bandera para usar index.html
    res.status(200).json({ message: 'Token almacenado con éxito' });
  } else {
    res.status(400).json({ error: 'Token no proporcionado' });
  }
});


app.use("/", loginRouter);

// Redireccionamiento al router de generador después de la redirección
app.use("/generador", (req, res, next) => {
  if (!useLoginHtml) {
    generatorRouter(req, res, next);
  } else {
    res.redirect("/"); // Redirige a la página de inicio si no se ha redirigido aún
  }
});

https.createServer(options, app).listen(PORT, () => {
  console.log(`Servidor corriendo en https://localhost:${PORT}`);
});

module.exports = app;

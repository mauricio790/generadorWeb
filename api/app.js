const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

app.use(express.static(path.join(__dirname, '.')));

app.use(express.json());  // para lectura de application/json


app.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});

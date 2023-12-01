const express = require('express');
const app = express();
const path = require('path'); 
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const PORT = 3000;
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
const options = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost.pem')
  };
  
/* app.post('/',(req,res) =>{
 
  res.send(req.body.g_csrf_token);
  console.log(req.body.g_csrf_token);
  res.end();
}); */


app.use((req, res, next) => {
  res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  next();
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/', (req, res) => {
  const token = req.body;
  res.sendFile(path.join(__dirname, 'index.html'));
});

//app.use(express.json());

/* 
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`); 
});*/
https.createServer(options, app).listen(PORT, () => {
    console.log(`Servidor corriendo en https://localhost:${PORT}`);
  });
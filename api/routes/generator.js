const express = require("express");
const router = express.Router();
const path = require('path'); 
const tf = require('@tensorflow/tfjs-node');
const fs = require('fs').promises;
//const { Comment } = require('../models');

async function loadFile() {
    try {
      // Read file using fs module
      const content = await fs.readFile("api/choruses.txt", "utf-8");
      return content;
    } catch (error) {
      console.error("Error loading the file:", error);
    }
  }

async function loadVocab() {
  // Lee el archivo de manera sincrónica
  const contenido = await loadFile();

  // Encuentra los caracteres únicos en el texto
  const vocab = Array.from(new Set(contenido.split(""))).sort(); // Separar el texto en caracteres individuales

  // Crea los mapeos char2idx e idx2char
  const char2idx = {};
  const idx2char = [];

  vocab.forEach((char, idx) => {
    char2idx[char] = idx;
    idx2char[idx] = char;
  });

  return { char2idx, idx2char };
}



async function generateText(generated) {
  const { char2idx, idx2char } = await loadVocab();
  let model = await tf.loadLayersModel("file://../taylor_swift_js/model.json");


  const numGenerate = 600;
  text = generated;
  let inputEval = text.split("").map((char) => char2idx[char]);

  inputEval = tf.tensor2d([inputEval]);

  let textGenerated = [];

  const temperature = 0.2;

  for (let i = 0; i < numGenerate; i++) {
    const predictions = model.predict(inputEval);
    const lastPrediction = predictions.squeeze().arraySync();

    const scaledPredictions = tf.div(lastPrediction, temperature);

    const predictedId = tf.multinomial(scaledPredictions, 2).dataSync()[0];
    inputEval = tf.expandDims([predictedId], 0);

    textGenerated += idx2char[predictedId];
  }
  return textGenerated.toString();
}


router
  .route("/")
  .get(async (req, res, next) => {
    res.sendFile('index.html', { root: './html' });
  })
  .post(async (req, res, next) => {
    //Asumiendo que los datos de entrada se reciben como arreglo JSON
    const inputData = req.body.data;
    console.log(inputData);
    const prediction = await generateText(inputData);

        res.json({
            prediction: prediction
        });
  });

module.exports = router;

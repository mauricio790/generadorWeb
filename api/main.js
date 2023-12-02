import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest';

class Main {
  constructor() {
    this.generatedSentence = document.getElementById("generated-sentence");
    this.inputSeed = document.getElementById("seed");
    this.generateButton = document.getElementById("generate-button");
    this.generateButton.onclick = () => {
      this.generateText();
    };
    tf.loadLayersModel("taylor_swift_js/model.json").then((model) => {
      this.model = model;
      this.enableGeneration();
    });
  }

  enableGeneration() {
    this.generateButton.innerText = "Generar un verso nuevo";
    this.generateButton.disabled = false;
  }

  async loadFile() {
    try {
      const response = await fetch('choruses.txt');
      if (!response.ok) {
        throw new Error('No se pudo cargar el archivo.');
      }
      const text = await response.text();
      return text;
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
    }

  }

  async loadVocab() {

    // Lee el archivo de manera sincrónica
    const contenido = await this.loadFile();

    // Encuentra los caracteres únicos en el texto
    const vocab = Array.from(new Set(contenido.split(''))).sort(); // Separar el texto en caracteres individuales

    // Crea los mapeos char2idx e idx2char
    const char2idx = {};
    const idx2char = [];

    vocab.forEach((char, idx) => {
      char2idx[char] = idx;
      idx2char[idx] = char;
    });

    return {char2idx,idx2char};
  }

  async generateText() {
    const {char2idx,idx2char} = await this.loadVocab();
    let generated = this.inputSeed.value;
    this.generatedSentence.innerText = generated;
    this.generateButton.disabled = true;
    this.generateButton.innerText = "Taylor Swift dice";
    const numGenerate = 600;
    let inputEval = Array.from(generated, (char) => char2idx[char]);
    console.log(inputEval);
    console.log(idx2char);
    console.log(char2idx);
    inputEval = tf.tensor2d([inputEval]);

    let textGenerated = [];

    const temperature = 0.2;

    this.model.resetStates();
    for (let i = 0; i < numGenerate; i++) {
      const predictions = this.model.predict(inputEval);
      const lastPrediction = predictions
        .squeeze().arraySync();

      const scaledPredictions = tf.div(lastPrediction, temperature);

      const predictedId = tf.multinomial(scaledPredictions, 2).dataSync()[0];
      inputEval = tf.expandDims([predictedId],0);

      textGenerated+=(idx2char[predictedId]);
    }
    this.generatedSentence.innerText += textGenerated.toString();
    this.enableGeneration();
  }
}

module.exports = Main;

import indices_char from "./indices_char.js";
import char_indices from "./char_indices.js";

const INPUT_LENGTH = 40;
const CHARS_TO_GENERATE = 200;
const DIVERSITY = 0.5;

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

  async generateText() {
    let generated = this.inputSeed.value;
    this.generatedSentence.innerText = generated;
    this.generateButton.disabled = true;
    this.generateButton.innerText = "Taylor Swift dice";
    const numGenerate = 300;
    let inputEval = Array.from(generated, char => char_indices[char]);
    inputEval = tf.tensor2d([inputEval]);
  
    let textGenerated = [];
  
    const temperature = 0.3;
  
    this.model.resetStates();
    for (let i = 0; i < numGenerate; i++) {
      const predictions = this.model.predict(inputEval);
      const lastPrediction = predictions.slice([0, predictions.shape[1] - 1], [1, 1]).squeeze();
      
      const scaledPredictions = tf.div(lastPrediction, temperature);
      const softmaxed = tf.softmax(scaledPredictions);
      
      const logits = tf.div(softmaxed, tf.sum(softmaxed));
  
      const predictedId = tf.multinomial(logits, 1).dataSync()[0];
      inputEval = tf.tensor2d([[predictedId]]);
  
      textGenerated.push(indices_char[predictedId]);
    }
    this.generatedSentence.innerText =textGenerated;
    this.enableGeneration();
  }

}

window.addEventListener("load", () => new Main());

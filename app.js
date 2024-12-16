const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());

const A_pattern = [
    [0,0,0,0,1,1,0,0,0,0],
    [0,0,0,1,0,0,1,0,0,0],
    [0,0,1,0,0,0,0,1,0,0],
    [0,0,1,0,0,0,0,1,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,1,0,0,0,0,1,0,0],
    [0,0,1,0,0,0,0,1,0,0],
    [0,0,1,0,0,0,0,1,0,0],
    [0,0,1,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,0,0,0]
];

const G_pattern = [
    [0,0,1,1,1,1,0,0,0,0],
    [0,1,0,0,0,0,1,0,0,0],
    [0,1,0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,1,1,1,1],
    [0,1,0,0,0,0,0,0,1,0],
    [0,1,0,0,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0,1,0],
    [0,0,1,1,1,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
];

// Função de ativação (degrau descendente)
function funcaoAtivacao(sum) {
    return sum >= 0 ? 1 : 0;
}

// Função de treinamento do Perceptron
function trainPerceptron(inputPattern, target, weights, alpha, epochs) {
    for (let epoch = 0; epoch < epochs; epoch++) {
        let totalError = 0;

        for (let i = 0; i < inputPattern.length; i++) {
            for (let j = 0; j < inputPattern[i].length; j++) {
                let input = inputPattern[i][j];
                let weightedSum = input * weights[i][j];
                let output = funcaoAtivacao(weightedSum);
                let error = target[i][j] - output;
                weights[i][j] += alpha * error * input;
                totalError += Math.abs(error);
            }
        }

        if (totalError === 0) break; // Se não houver erro, o treinamento termina
    }
    return weights;
}

// Função para reconhecer a letra com o Perceptron treinado
function recognizeLetterWithPerceptron(matrix, weights_A, weights_G) {
    const score_A = matrix.flat().reduce((sum, value, index) => sum + value * weights_A.flat()[index], 0);
    const score_G = matrix.flat().reduce((sum, value, index) => sum + value * weights_G.flat()[index], 0);

    return score_A > score_G ? "A" : "G";
}

// Treinamento inicial
let weights_A = Array(A_pattern.length).fill(0).map(() => Array(A_pattern[0].length).fill(0));
let weights_G = Array(G_pattern.length).fill(0).map(() => Array(G_pattern[0].length).fill(0));

const alpha = 0.1; // taxa de aprendizado
const epochs = 1000; // ciclos de treinamento

weights_A = trainPerceptron(A_pattern, A_pattern, weights_A, alpha, epochs);
weights_G = trainPerceptron(G_pattern, G_pattern, weights_G, alpha, epochs);

app.post('/recognition_perceptron', (req, res) => {
    const matrix = req.body.matrix;
    const letter = recognizeLetterWithPerceptron(matrix, weights_A, weights_G);
    console.log(letter);
    res.json({ letter });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

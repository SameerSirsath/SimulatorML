// Global State
let completedModules = [];
let currentModule = null;

// Module Data
const modules = [
  { id: 1, title: "What is Machine Learning?", description: "Understand the basics of ML and how it differs from traditional programming", icon: "🧠" },
  { id: 2, title: "Data Playground", description: "Explore, clean, and transform data interactively", icon: "📊" },
  { id: 3, title: "Training Simulator", description: "Train your first ML model and watch it learn", icon: "🎯" },
  { id: 4, title: "Neural Networks", description: "Build and visualize neural network architectures", icon: "🕸️" },
  { id: 5, title: "Classification Demo", description: "Create decision boundaries for classification", icon: "🎨" },
  { id: 6, title: "Real-World Apps", description: "See ML in action with practical examples", icon: "🌍" }
];

// Sample Data
const houseData = [
  { size: 800, bedrooms: 2, age: 15, price: 180 },
  { size: 1200, bedrooms: 3, age: 10, price: 250 },
  { size: 1500, bedrooms: 3, age: 8, price: 320 },
  { size: 1800, bedrooms: 4, age: 5, price: 380 },
  { size: 2000, bedrooms: 4, age: 3, price: 420 },
  { size: 2400, bedrooms: 5, age: 2, price: 500 },
  { size: 2800, bedrooms: 5, age: 1, price: 580 },
  { size: 3200, bedrooms: 6, age: 0, price: 650 }
];

// Training State
let trainingData = [];
let weight = Math.random();
let bias = Math.random();
let epoch = 0;
let learningRate = 0.01;

// Classification State
let classData = { red: [], blue: [] };
let currentClass = 'red';
let classifierTrained = false;
let decisionBoundary = { weight1: 0, weight2: 0, bias: 0 };

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
  renderModules();
  updateProgress();
  setupEventListeners();
});

function renderModules() {
  const grid = document.getElementById('modulesGrid');
  grid.innerHTML = modules.map(module => `
    <div class="module-card ${completedModules.includes(module.id) ? 'completed' : ''}" onclick="showModule(${module.id})">
      <div class="module-icon">${module.icon}</div>
      <h3>${module.title}</h3>
      <p>${module.description}</p>
    </div>
  `).join('');
}

function showModule(id) {
  currentModule = id;
  document.getElementById('dashboard').style.display = 'none';
  
  modules.forEach(module => {
    const element = document.getElementById(`module${module.id}`);
    if (element) {
      element.style.display = module.id === id ? 'block' : 'none';
    }
  });

  // Initialize module-specific content
  if (id === 2) initDataPlayground();
  if (id === 3) initTrainingSimulator();
  if (id === 4) initNeuralNetwork();
  if (id === 5) initClassification();
  if (id === 6) initRealWorld();
}

function showDashboard() {
  document.getElementById('dashboard').style.display = 'block';
  modules.forEach(module => {
    const element = document.getElementById(`module${module.id}`);
    if (element) element.style.display = 'none';
  });
  renderModules();
}

function completeModule(id) {
  if (!completedModules.includes(id)) {
    completedModules.push(id);
    updateProgress();
  }
}

function updateProgress() {
  const progress = (completedModules.length / modules.length) * 100;
  document.getElementById('progressFill').style.width = `${progress}%`;
  document.getElementById('progressText').textContent = `${completedModules.length} of ${modules.length}`;
}

function setupEventListeners() {
  const lrSlider = document.getElementById('learningRate');
  if (lrSlider) {
    lrSlider.addEventListener('input', (e) => {
      learningRate = parseFloat(e.target.value);
      document.getElementById('lrValue').textContent = learningRate.toFixed(3);
    });
  }

  const neuronSlider = document.getElementById('hiddenNeurons');
  if (neuronSlider) {
    neuronSlider.addEventListener('input', (e) => {
      document.getElementById('neuronCount').textContent = e.target.value;
      drawNeuralNetwork();
    });
  }

  const activationSelect = document.getElementById('activationFunction');
  if (activationSelect) {
    activationSelect.addEventListener('change', () => {
      drawNeuralNetwork();
    });
  }

  const predSizeSlider = document.getElementById('predSize');
  if (predSizeSlider) {
    predSizeSlider.addEventListener('input', (e) => {
      document.getElementById('predSizeValue').textContent = e.target.value;
    });
  }

  const predBedroomsSlider = document.getElementById('predBedrooms');
  if (predBedroomsSlider) {
    predBedroomsSlider.addEventListener('input', (e) => {
      document.getElementById('predBedroomsValue').textContent = e.target.value;
    });
  }
}

// MODULE 2: Data Playground
function initDataPlayground() {
  const tbody = document.getElementById('dataTableBody');
  tbody.innerHTML = houseData.map(row => `
    <tr>
      <td>${row.size}</td>
      <td>${row.bedrooms}</td>
      <td>${row.age}</td>
      <td>${row.price}</td>
    </tr>
  `).join('');

  // Calculate statistics
  const avgSize = (houseData.reduce((sum, d) => sum + d.size, 0) / houseData.length).toFixed(0);
  const avgPrice = (houseData.reduce((sum, d) => sum + d.price, 0) / houseData.length).toFixed(0);
  const prices = houseData.map(d => d.price);
  const priceRange = Math.max(...prices) - Math.min(...prices);

  document.getElementById('recordCount').textContent = houseData.length;
  document.getElementById('avgSize').textContent = avgSize;
  document.getElementById('avgPrice').textContent = `$${avgPrice}k`;
  document.getElementById('priceRange').textContent = `$${priceRange}k`;

  // Draw scatter plot
  drawDataVisualization();
}

function drawDataVisualization() {
  const canvas = document.getElementById('dataCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  // Find data ranges
  const maxSize = Math.max(...houseData.map(d => d.size));
  const maxPrice = Math.max(...houseData.map(d => d.price));
  const padding = 50;

  // Draw axes
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-border');
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(padding, padding);
  ctx.stroke();

  // Draw axis labels
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary');
  ctx.font = '12px var(--font-family-base)';
  ctx.textAlign = 'center';
  ctx.fillText('Size (sq ft)', width / 2, height - 10);
  ctx.save();
  ctx.translate(15, height / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText('Price ($1000s)', 0, 0);
  ctx.restore();

  // Draw data points
  houseData.forEach(d => {
    const x = padding + (d.size / maxSize) * (width - 2 * padding);
    const y = height - padding - (d.price / maxPrice) * (height - 2 * padding);

    ctx.fillStyle = '#1FB8CD';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#13343B';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

// MODULE 3: Training Simulator
function initTrainingSimulator() {
  const canvas = document.getElementById('trainingCanvas');
  if (!canvas) return;

  // Add sample data if empty
  if (trainingData.length === 0) {
    trainingData = [
      { x: 1, y: 2.1 }, { x: 2, y: 4.3 }, { x: 3, y: 6.2 }, { x: 4, y: 8.1 },
      { x: 5, y: 10.3 }, { x: 6, y: 12.1 }, { x: 7, y: 14.2 }, { x: 8, y: 16.1 }
    ];
  }

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const padding = 50;
    const dataX = ((x - padding) / (canvas.width - 2 * padding)) * 10;
    const dataY = ((canvas.height - padding - y) / (canvas.height - 2 * padding)) * 20;

    if (dataX >= 0 && dataX <= 10 && dataY >= 0 && dataY <= 20) {
      trainingData.push({ x: dataX, y: dataY });
      drawTrainingVisualization();
    }
  });

  drawTrainingVisualization();
  updateTrainingMetrics();
}

function drawTrainingVisualization() {
  const canvas = document.getElementById('trainingCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;

  ctx.clearRect(0, 0, width, height);

  // Draw axes
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-border');
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(padding, padding);
  ctx.stroke();

  // Draw grid
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-border').replace('0.2', '0.1');
  ctx.lineWidth = 1;
  for (let i = 0; i <= 10; i++) {
    const x = padding + (i / 10) * (width - 2 * padding);
    ctx.beginPath();
    ctx.moveTo(x, padding);
    ctx.lineTo(x, height - padding);
    ctx.stroke();
  }
  for (let i = 0; i <= 10; i++) {
    const y = height - padding - (i / 10) * (height - 2 * padding);
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Draw regression line
  if (trainingData.length > 0) {
    ctx.strokeStyle = '#E68161';
    ctx.lineWidth = 3;
    ctx.beginPath();
    const x1 = 0;
    const y1 = weight * x1 + bias;
    const x2 = 10;
    const y2 = weight * x2 + bias;
    const px1 = padding + (x1 / 10) * (width - 2 * padding);
    const py1 = height - padding - (y1 / 20) * (height - 2 * padding);
    const px2 = padding + (x2 / 10) * (width - 2 * padding);
    const py2 = height - padding - (y2 / 20) * (height - 2 * padding);
    ctx.moveTo(px1, py1);
    ctx.lineTo(px2, py2);
    ctx.stroke();
  }

  // Draw data points
  trainingData.forEach(d => {
    const x = padding + (d.x / 10) * (width - 2 * padding);
    const y = height - padding - (d.y / 20) * (height - 2 * padding);

    ctx.fillStyle = '#1FB8CD';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });
}

function trainStep() {
  if (trainingData.length === 0) return;

  let totalLoss = 0;
  let gradWeight = 0;
  let gradBias = 0;

  trainingData.forEach(point => {
    const prediction = weight * point.x + bias;
    const error = prediction - point.y;
    totalLoss += error * error;
    gradWeight += error * point.x;
    gradBias += error;
  });

  const n = trainingData.length;
  gradWeight /= n;
  gradBias /= n;
  totalLoss /= n;

  weight -= learningRate * gradWeight;
  bias -= learningRate * gradBias;
  epoch++;

  updateTrainingMetrics();
  drawTrainingVisualization();

  const explanation = document.getElementById('trainingExplanation');
  const explanationText = document.getElementById('explanationText');
  explanation.style.display = 'block';
  explanationText.textContent = `Epoch ${epoch}: The model adjusted the line by updating weight to ${weight.toFixed(3)} and bias to ${bias.toFixed(3)}. The loss decreased to ${totalLoss.toFixed(3)}.`;
}

function trainModel() {
  for (let i = 0; i < 100; i++) {
    trainStep();
  }
}

function resetTraining() {
  trainingData = [];
  weight = Math.random();
  bias = Math.random();
  epoch = 0;
  updateTrainingMetrics();
  const canvas = document.getElementById('trainingCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  document.getElementById('trainingExplanation').style.display = 'none';
  initTrainingSimulator();
}

function updateTrainingMetrics() {
  document.getElementById('epochValue').textContent = epoch;
  document.getElementById('weightValue').textContent = weight.toFixed(3);
  document.getElementById('biasValue').textContent = bias.toFixed(3);

  let totalLoss = 0;
  if (trainingData.length > 0) {
    trainingData.forEach(point => {
      const prediction = weight * point.x + bias;
      const error = prediction - point.y;
      totalLoss += error * error;
    });
    totalLoss /= trainingData.length;
  }
  document.getElementById('lossValue').textContent = totalLoss.toFixed(3);
}

// MODULE 4: Neural Networks
function initNeuralNetwork() {
  drawNeuralNetwork();
}

function drawNeuralNetwork() {
  const canvas = document.getElementById('nnCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  const hiddenNeurons = parseInt(document.getElementById('hiddenNeurons').value);
  const layers = [
    { count: 3, x: 100, label: 'Input Layer' },
    { count: hiddenNeurons, x: width / 2, label: 'Hidden Layer' },
    { count: 1, x: width - 100, label: 'Output Layer' }
  ];

  const neurons = [];

  // Calculate neuron positions
  layers.forEach((layer, layerIdx) => {
    const spacing = (height - 100) / (layer.count + 1);
    neurons[layerIdx] = [];
    for (let i = 0; i < layer.count; i++) {
      neurons[layerIdx].push({
        x: layer.x,
        y: 50 + spacing * (i + 1)
      });
    }
  });

  // Draw connections
  for (let l = 0; l < layers.length - 1; l++) {
    neurons[l].forEach(n1 => {
      neurons[l + 1].forEach(n2 => {
        const weight = Math.random() * 2 - 1;
        ctx.strokeStyle = weight > 0 ? 'rgba(31, 184, 205, 0.3)' : 'rgba(230, 129, 97, 0.3)';
        ctx.lineWidth = Math.abs(weight) * 2;
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(n2.x, n2.y);
        ctx.stroke();
      });
    });
  }

  // Draw neurons
  layers.forEach((layer, layerIdx) => {
    neurons[layerIdx].forEach((neuron, idx) => {
      ctx.fillStyle = '#1FB8CD';
      ctx.beginPath();
      ctx.arc(neuron.x, neuron.y, 20, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-surface');
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-btn-primary-text');
      ctx.font = 'bold 12px var(--font-family-base)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(idx + 1, neuron.x, neuron.y);
    });

    // Draw layer labels
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-text-secondary');
    ctx.font = '14px var(--font-family-base)';
    ctx.textAlign = 'center';
    ctx.fillText(layer.label, layer.x, 25);
  });
}

function animateForwardPass() {
  const canvas = document.getElementById('nnCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let step = 0;
  const maxSteps = 3;
  
  const interval = setInterval(() => {
    drawNeuralNetwork();
    
    // Highlight active layer
    const hiddenNeurons = parseInt(document.getElementById('hiddenNeurons').value);
    const layers = [
      { count: 3, x: 100 },
      { count: hiddenNeurons, x: canvas.width / 2 },
      { count: 1, x: canvas.width - 100 }
    ];

    if (step < layers.length) {
      const layer = layers[step];
      const spacing = (canvas.height - 100) / (layer.count + 1);
      
      for (let i = 0; i < layer.count; i++) {
        const y = 50 + spacing * (i + 1);
        
        ctx.fillStyle = 'rgba(31, 184, 205, 0.5)';
        ctx.beginPath();
        ctx.arc(layer.x, y, 25, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    step++;
    if (step > maxSteps) clearInterval(interval);
  }, 600);
}

// MODULE 5: Classification
function initClassification() {
  const canvas = document.getElementById('classCanvas');
  if (!canvas) return;

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const padding = 50;
    const dataX = ((x - padding) / (canvas.width - 2 * padding)) * 10;
    const dataY = ((canvas.height - padding - y) / (canvas.height - 2 * padding)) * 10;

    if (dataX >= 0 && dataX <= 10 && dataY >= 0 && dataY <= 10) {
      classData[currentClass].push({ x: dataX, y: dataY });
      updateClassMetrics();
      drawClassification();
    }
  });

  drawClassification();
}

function drawClassification() {
  const canvas = document.getElementById('classCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const padding = 50;

  ctx.clearRect(0, 0, width, height);

  // Draw decision boundary if trained
  if (classifierTrained) {
    ctx.strokeStyle = 'rgba(94, 82, 64, 0.5)';
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    
    // Draw boundary line: w1*x + w2*y + b = 0
    if (Math.abs(decisionBoundary.weight2) > 0.01) {
      const x1 = 0;
      const y1 = -(decisionBoundary.weight1 * x1 + decisionBoundary.bias) / decisionBoundary.weight2;
      const x2 = 10;
      const y2 = -(decisionBoundary.weight1 * x2 + decisionBoundary.bias) / decisionBoundary.weight2;
      
      const px1 = padding + (x1 / 10) * (width - 2 * padding);
      const py1 = height - padding - (y1 / 10) * (height - 2 * padding);
      const px2 = padding + (x2 / 10) * (width - 2 * padding);
      const py2 = height - padding - (y2 / 10) * (height - 2 * padding);
      
      ctx.moveTo(px1, py1);
      ctx.lineTo(px2, py2);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Draw axes
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--color-border');
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.moveTo(padding, height - padding);
  ctx.lineTo(padding, padding);
  ctx.stroke();

  // Draw red points
  classData.red.forEach(d => {
    const x = padding + (d.x / 10) * (width - 2 * padding);
    const y = height - padding - (d.y / 10) * (height - 2 * padding);

    ctx.fillStyle = '#FF5459';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw blue points
  classData.blue.forEach(d => {
    const x = padding + (d.x / 10) * (width - 2 * padding);
    const y = height - padding - (d.y / 10) * (height - 2 * padding);

    ctx.fillStyle = '#1FB8CD';
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  });
}

function toggleClass() {
  currentClass = currentClass === 'red' ? 'blue' : 'red';
  const btn = document.getElementById('classBtn');
  btn.textContent = currentClass === 'red' ? 'Add Red Points' : 'Add Blue Points';
  btn.style.backgroundColor = currentClass === 'red' ? '#FF5459' : '#1FB8CD';
}

function trainClassifier() {
  if (classData.red.length === 0 || classData.blue.length === 0) {
    alert('Please add both red and blue points first!');
    return;
  }

  // Simple perceptron training
  let w1 = Math.random() - 0.5;
  let w2 = Math.random() - 0.5;
  let b = Math.random() - 0.5;
  const lr = 0.1;
  const epochs = 100;

  for (let epoch = 0; epoch < epochs; epoch++) {
    // Train on red points (class 0)
    classData.red.forEach(point => {
      const output = w1 * point.x + w2 * point.y + b;
      const prediction = output > 0 ? 1 : 0;
      const target = 0;
      const error = target - prediction;
      
      w1 += lr * error * point.x;
      w2 += lr * error * point.y;
      b += lr * error;
    });

    // Train on blue points (class 1)
    classData.blue.forEach(point => {
      const output = w1 * point.x + w2 * point.y + b;
      const prediction = output > 0 ? 1 : 0;
      const target = 1;
      const error = target - prediction;
      
      w1 += lr * error * point.x;
      w2 += lr * error * point.y;
      b += lr * error;
    });
  }

  decisionBoundary = { weight1: w1, weight2: w2, bias: b };
  classifierTrained = true;

  // Calculate accuracy
  let correct = 0;
  let total = classData.red.length + classData.blue.length;

  classData.red.forEach(point => {
    const output = w1 * point.x + w2 * point.y + b;
    if (output <= 0) correct++;
  });

  classData.blue.forEach(point => {
    const output = w1 * point.x + w2 * point.y + b;
    if (output > 0) correct++;
  });

  const accuracy = ((correct / total) * 100).toFixed(1);
  document.getElementById('classAccuracy').textContent = `${accuracy}%`;
  document.getElementById('classEpochs').textContent = epochs;

  drawClassification();
}

function resetClassifier() {
  classData = { red: [], blue: [] };
  classifierTrained = false;
  decisionBoundary = { weight1: 0, weight2: 0, bias: 0 };
  updateClassMetrics();
  document.getElementById('classAccuracy').textContent = '0%';
  document.getElementById('classEpochs').textContent = '0';
  drawClassification();
}

function updateClassMetrics() {
  document.getElementById('redCount').textContent = classData.red.length;
  document.getElementById('blueCount').textContent = classData.blue.length;
}

// MODULE 6: Real-World Applications
function initRealWorld() {
  // Nothing specific to initialize
}

function analyzeSentiment() {
  const text = document.getElementById('sentimentInput').value.toLowerCase();
  
  // Simple sentiment analysis based on keywords
  const positiveWords = ['love', 'great', 'awesome', 'excellent', 'good', 'happy', 'wonderful', 'amazing', 'fantastic', 'best'];
  const negativeWords = ['hate', 'bad', 'terrible', 'awful', 'worst', 'horrible', 'poor', 'sad', 'disappointing', 'ugly'];

  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach(word => {
    if (text.includes(word)) positiveCount++;
  });

  negativeWords.forEach(word => {
    if (text.includes(word)) negativeCount++;
  });

  const total = positiveCount + negativeCount;
  let sentiment = 'Neutral';
  let score = 50;

  if (total > 0) {
    if (positiveCount > negativeCount) {
      sentiment = '😊 Positive';
      score = 50 + (positiveCount / total) * 50;
    } else if (negativeCount > positiveCount) {
      sentiment = '😞 Negative';
      score = 50 - (negativeCount / total) * 50;
    }
  }

  document.getElementById('sentimentLabel').textContent = sentiment;
  document.getElementById('sentimentScore').textContent = `${score.toFixed(0)}%`;
  document.getElementById('sentimentResult').style.display = 'block';
}

function predictPrice() {
  const size = parseInt(document.getElementById('predSize').value);
  const bedrooms = parseInt(document.getElementById('predBedrooms').value);

  // Simple linear model: price = 0.15 * size + 30 * bedrooms + 50
  const price = (0.15 * size + 30 * bedrooms + 50).toFixed(0);

  document.getElementById('predictedPrice').textContent = `$${price}k`;
  document.getElementById('priceResult').style.display = 'block';
}
# AI Engineering - Learning Guide

## 🎯 Goal
Become proficient in Artificial Intelligence and Machine Learning — from fundamental math to deploying production models.

---

## Prerequisites

✅ **Programming** — Python (primary), C/C++ (for understanding low-level ML libs)
✅ **Mathematics** — Linear Algebra, Calculus, Probability & Statistics
✅ **Data Handling** — CSV, JSON, SQL basics

---

## Core Concepts (in order)

1. **Python for Data Science** — NumPy, Pandas, Matplotlib
2. **Statistics & Probability** — Mean, Median, Variance, Distributions, Bayes' Theorem
3. **Linear Algebra** — Vectors, Matrices, Eigenvalues, Transformations
4. **Supervised Learning** — Linear Regression, Logistic Regression, Decision Trees, SVM
5. **Unsupervised Learning** — K-Means, DBSCAN, PCA, Hierarchical Clustering
6. **Neural Networks** — Perceptrons, Backpropagation, Activation Functions
7. **Deep Learning** — CNNs, RNNs, LSTMs, Transformers
8. **Natural Language Processing** — Tokenization, Word Embeddings, Seq2Seq, Attention
9. **Computer Vision** — Image Classification, Object Detection, Segmentation
10. **Reinforcement Learning** — Q-Learning, Policy Gradient, Deep RL
11. **MLOps & Deployment** — Model Serving, Docker, FastAPI, Cloud Deployment

---

## Quick Reference

### Setting Up Python Environment
```bash
# Install Python (use Anaconda for data science)
# Download from https://www.anaconda.com/download

# Create a virtual environment
conda create -n ai_env python=3.11
conda activate ai_env

# Install essential libraries
pip install numpy pandas matplotlib scikit-learn
pip install tensorflow keras torch torchvision
pip install jupyter notebook
```

### NumPy Basics
```python
import numpy as np

# Create arrays
a = np.array([1, 2, 3, 4, 5])
b = np.zeros((3, 3))        # 3x3 matrix of zeros
c = np.random.randn(3, 3)   # Random 3x3 matrix

# Operations
print(a.mean())       # Average
print(a.std())        # Standard deviation
print(np.dot(c, c))   # Matrix multiplication
```

### Pandas Basics
```python
import pandas as pd

# Load data
df = pd.read_csv("data.csv")

# Explore
print(df.head())         # First 5 rows
print(df.describe())     # Statistics
print(df.info())         # Column types

# Filter
adults = df[df['age'] > 18]
```

### Scikit-learn (Machine Learning)
```python
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Predict
predictions = model.predict(X_test)
print(f"MSE: {mean_squared_error(y_test, predictions)}")
```

### TensorFlow / Keras (Deep Learning)
```python
import tensorflow as tf
from tensorflow import keras

# Build a simple neural network
model = keras.Sequential([
    keras.layers.Dense(128, activation='relu', input_shape=(784,)),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dense(10, activation='softmax')
])

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

model.fit(X_train, y_train, epochs=10, batch_size=32)
```

### PyTorch Basics
```python
import torch
import torch.nn as nn

# Define a model
class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = nn.Linear(784, 128)
        self.fc2 = nn.Linear(128, 10)

    def forward(self, x):
        x = torch.relu(self.fc1(x))
        x = self.fc2(x)
        return x

model = SimpleNet()
```

---

## 🛠️ Tools & Libraries

| Category | Tools |
|----------|-------|
| **Languages** | Python 3.11+, R (optional) |
| **Data** | NumPy, Pandas, Polars |
| **Visualization** | Matplotlib, Seaborn, Plotly |
| **ML Frameworks** | Scikit-learn, XGBoost, LightGBM |
| **Deep Learning** | TensorFlow, PyTorch, Keras, JAX |
| **NLP** | Hugging Face Transformers, SpaCy, NLTK |
| **Computer Vision** | OpenCV, Pillow, torchvision |
| **Notebooks** | Jupyter, Google Colab |
| **MLOps** | MLflow, Weights & Biases, DVC |
| **Deployment** | FastAPI, Flask, Docker, AWS SageMaker |

---

## Common Mistakes to Avoid

❌ **Wrong:** Jumping straight to deep learning without learning basics
✅ **Right:** Master linear regression and decision trees first

❌ **Wrong:** Using complex models for simple problems
✅ **Right:** Start with simple models, increase complexity only if needed

❌ **Wrong:** Not splitting data into train/test sets
✅ **Right:** Always use train_test_split or cross-validation

❌ **Wrong:** Ignoring data preprocessing
✅ **Right:** Clean data, handle missing values, normalize features

❌ **Wrong:** Not understanding the math behind algorithms
✅ **Right:** Learn gradient descent, loss functions, and backpropagation conceptually

---

## Key Math You Need

### Linear Algebra
- **Vectors**: Direction & magnitude, dot product, cross product
- **Matrices**: Multiplication, transpose, inverse, determinant
- **Eigenvalues/Eigenvectors**: Used in PCA, dimensionality reduction

### Calculus
- **Derivatives**: Gradient of loss function (gradient descent)
- **Partial Derivatives**: Multivariable optimization
- **Chain Rule**: Foundation of backpropagation

### Probability & Statistics
- **Distributions**: Normal, Bernoulli, Poisson
- **Bayes' Theorem**: P(A|B) = P(B|A) * P(A) / P(B)
- **Hypothesis Testing**: p-values, confidence intervals

---

## Interview Preparation (AI/ML Roles)

### Topics Companies Test On:
- ✅ Python programming and data manipulation
- ✅ Statistical analysis and hypothesis testing
- ✅ Machine Learning algorithms (supervised & unsupervised)
- ✅ Deep Learning architectures (CNN, RNN, Transformers)
- ✅ Model evaluation metrics (accuracy, precision, recall, F1, AUC)
- ✅ Feature engineering and data preprocessing
- ✅ SQL for data querying
- ✅ System design for ML pipelines

### Tips:
1. **Build end-to-end projects** — From data collection to deployment
2. **Kaggle competitions** — Great for portfolio and practice
3. **Read research papers** — Stay updated with arxiv.org
4. **Contribute to open source** — TensorFlow, PyTorch, Hugging Face
5. **Blog about your projects** — Demonstrates understanding

---

## Recommended Learning Resources

| Resource | Type | Focus |
|----------|------|-------|
| Andrew Ng's ML Course (Coursera) | Course | ML Fundamentals |
| fast.ai | Course | Practical Deep Learning |
| 3Blue1Brown (YouTube) | Video | Math Intuition |
| Kaggle Learn | Interactive | Hands-on ML |
| Hands-On ML (Aurélien Géron) | Book | Comprehensive ML |
| Deep Learning (Ian Goodfellow) | Book | Deep Learning Theory |
| Google Colab | Platform | Free GPU for experiments |

---

## Remember:
- **Data > Algorithms** — Good data beats complex models
- **Start simple** — Linear models first, then neural networks
- **Understand the math** — Don't just call library functions blindly
- **Build projects** — Portfolio matters more than certificates
- **Stay curious** — AI evolves rapidly, keep learning

Good luck on your AI Engineering journey! 🤖

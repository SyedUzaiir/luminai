# LuminaDB: Natural Language Interface for MongoDB

LuminaDB is a modern, end-to-end full-stack web application that allows users to query a MongoDB database using **plain English** instead of complex MongoDB Query Language (MQL) syntax. 

It accomplishes this entirely **offline and locally**, utilizing an integrated Natural Language Processing (NLP) microservice built with spaCy.

![LuminaDB Concept Insight](https://img.shields.io/badge/Status-Completed-success) ![Tech Stack](https://img.shields.io/badge/Tech-React_|_Express_|_FastAPI_|_MongoDB-blue)

---

## 🏗️ Architecture Layers
This project is built using a microservices architecture, split into three distinct, decoupled modules:

1. **[`/frontend`](./frontend/README.md)**: A modern Glassmorphic React dashboard (Vite + Tailwind CSS).
2. **[`/backend`](./backend/README.md)**: An Express/Node.js orchestrator that connects to MongoDB and routes queries.
3. **[`/nlp-service`](./nlp-service/README.md)**: A Python FastAPI application running a local spaCy engine to translate English into valid MQL syntax.

---

## 🚀 How to Run the Complete Project Locally

Because LuminaDB is built with microservices, you need to start each of the three services in its own terminal window.

### Prerequisites
- Node.js installed (v16+)
- Python installed (v3.9+)
- A MongoDB Cluster (Local or Atlas URI)

### Step 1: Start the Backend Orchestrator (Terminal 1)
The backend acts as the bridge connecting your React frontend, the NLP translation brain, and your actual MongoDB Database.

```bash
cd backend
npm install
node seed.js    # (Optional) Run this once to populate your DB with sample Users/Products/Orders
node index.js
```
The Express server will start on `http://localhost:5000`.

### Step 2: Start the NLP Service (Terminal 2)
The NLP service parses plain English, detects database intents, extracts values (like prices or limits), and responds with a JSON MQL query.

```bash
cd nlp-service
python -m venv venv
# Activate the virtual environment:
# On Windows: .\venv\Scripts\activate
# On Mac/Linux: source venv/bin/activate

pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
```
The FastAPI server will start on `http://localhost:8000`. Note: No OpenAI API keys are required as all parsing is handled locally via spaCy!

### Step 3: Start the React Frontend (Terminal 3)
The frontend provides a sleek, user-friendly interface to type your queries and view the results in real-time.

```bash
cd frontend
npm install
npm run dev
```
Vite will start the UI. Open your browser and navigate to `http://localhost:5173`.

---

## 🎯 How to Use the Web Application (Examples)

Once all three terminal windows are running, open your browser to the Frontend URL (`http://localhost:5173`). 

You will see a main **Search Bar**. Try typing the following exact phrases to see the Natural Language to Database translation in action:

#### Example 1: Basic Categorization
- **Type:** `"Show me all products in the electronics category"`
- **Result:** The local NLP engine will translate this into `.find({ category: "Electronics" })` and display laptops, headphones, and mice.

#### Example 2: Aggregation and Sorting
- **Type:** `"What are the top 2 most expensive products?"`
- **Result:** The NLP engine detects a limit limit and price sort intent, generating an MQL query with `.sort({ price: -1 }).limit(2)`.

#### Example 3: Value Inequalities
- **Type:** `"Find all pending orders with an amount greater than 2000"`
- **Result:** The NLP extracts the numerical context and the `greater than` constraint to generate `.find({ status: "Pending", totalAmount: { $gt: 2000 } })`.

#### Example 4: Role-Based Filtering
- **Type:** `"List all admin users"`
- **Result:** Automatically selects the `User` collection and filters by `role: "Admin"`.

Watch as the **MQL Query Preview** box updates in real-time to show you _exactly_ what query was sent to MongoDB behind the scenes!

## 👥 Project Team

- **[Uzair](https://github.com/SyedUzaiir)** – Team Lead, Backend Development, Database
- [Chokkarapuwar Sujal](https://github.com/Chokkarapuwar-Sujal) – Frontend Development
- [Nakka Srijith](https://github.com/srijith31) – Natural Language Processing(NLP)
- [Muddam Pranay](https://github.com/Pranay-hub-cmd) – Testing & Documentation

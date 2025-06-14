## Cricket LLM
## Overview:
Cricket LLM is an AI-powered web application designed to understand and generate cricket-related insights using Large Language Models (LLMs). It integrates retrieval-augmented generation (RAG), fine-tuned BERT models, and predictive analytics to provide intelligent cricket content generation and match analysis. It also personalizes user experience by securely storing search history tied to user accounts.

 ## Features:
Cricket-Specific LLM: Tailored for understanding cricket terminologies, match formats, and player stats.

RAG + BERT Fine-tuning: For more accurate and context-rich content generation.

User Personalization: Saves user queries and preferences based on Gmail login.

Match Prediction: Uses ML models to predict likely match winners based on team/player stats.

Score Forecasting: DL models forecast total scores or innings performance.

Secure Data Handling: MongoDB stores data linked securely to each user.

## Tech Stack:
Frontend: React.js (MERN)

Backend: Node.js, Express.js

Database: MongoDB

ML/DL Models:

ML: Classification models for match outcome predictions

DL: Score forecasting

LLM:

Custom-trained LLM

BERT fine-tuning

RAG pipeline (Retrieval-Augmented Generation)

Authentication: Gmail OAuth

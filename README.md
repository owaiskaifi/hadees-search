# Hadees Search Engine

A modern, AI-powered search engine for Islamic Hadiths with question answering capabilities.
DATA SOURCE https://www.kaggle.com/datasets/fahd09/hadith-dataset
## Features

- Full-text search for Hadiths
- Natural language question answering about Islamic teachings
- Vector-based similarity search using ChromaDB
- Filter results by source, chapter, etc.
- Clean, Google-like search interface
- Responsive design for all devices

## Technical Stack

### Backend
- FastAPI for the REST API
- ChromaDB for vector storage and retrieval
- Ollama for LLM capabilities and embeddings
- Pandas for data processing

### Frontend
- React.js with functional components and hooks
- Tailwind CSS for styling
- Axios for API requests
- React Router for navigation

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- Ollama running locally (`http://localhost:11434`)
- "mxbai-embed-large:latest" model in Ollama (for embeddings)
- "gemma3:1b" model in Ollama (for question answering)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/owaiskaifi/hadees-search.git
cd hadees-search
```

2. Set up the backend:
```bash
# Install Python dependencies
pip install -r requirements.txt

# Index the hadiths in ChromaDB (one-time setup)
python main.py

# Start the backend server
cd backend
chmod +x start.sh
./start.sh
```

3. Set up the frontend:
```bash
cd frontend
npm install
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
hadees-search/
├── backend/                 # FastAPI backend
│   ├── app.py               # Main API file
│   └── start.sh             # Backend start script
├── data/                    # Data folder
│   └── all_hadiths_clean.csv # Cleaned Hadith dataset
├── frontend/                # React frontend
│   ├── public/              # Public assets
│   └── src/                 # Source code
│       ├── components/      # React components
│       ├── pages/           # Page components
│       └── services/        # API services
├── chroma_db/               # ChromaDB vector database
├── main.py                  # Indexing script
└── README.md                # This file
```

## Usage

1. Type your query in the search box or switch to "Ask a Question" mode
2. View search results with their relevance scores
3. Filter results by source, chapter, etc.
4. Click on a result to view the full Hadith
5. For question answering, read the generated answer and explore related Hadiths

## License

This project is licensed under the MIT License - see the LICENSE file for details.
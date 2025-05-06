from fastapi import FastAPI, Query, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import chromadb
import ollama
from chromadb.utils.embedding_functions.ollama_embedding_function import OllamaEmbeddingFunction
import os
import pandas as pd
import re

app = FastAPI(title="Hadees Search API", description="API for searching and answering questions about Hadees")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize embedding function
ollama_ef = OllamaEmbeddingFunction(
    url="http://localhost:11434",
    model_name="mxbai-embed-large:latest",
)

# Initialize ChromaDB client
client = chromadb.PersistentClient(path="./chroma_db")
collection = client.get_or_create_collection(
    name="hadiths_collection",
    embedding_function=ollama_ef,
    metadata={"hnsw:space": "cosine"}
)

# Load dataframe if needed for metadata lookups
# df = pd.read_csv('data/all_hadiths_clean.csv')

class SearchResult(BaseModel):
    hadith_id: str
    text: str
    score: float
    metadata: Dict[str, Any]

class AnswerResponse(BaseModel):
    answer: str
    hadiths: List[SearchResult]

@app.get("/", response_model=dict)
def read_root():
    return {"message": "Hadees Search API is running!"}

@app.get("/search", response_model=List[SearchResult])
def search_hadiths(
    query: str = Query(..., description="Search query"),
    filter_source: Optional[str] = Query(None, description="Filter by source"),
    filter_chapter: Optional[str] = Query(None, description="Filter by chapter"),
    limit: int = Query(10, description="Number of results to return")
):
    # Create metadata filter if any filters are provided
    where_clause = {}
    if filter_source:
        where_clause["source"] = filter_source
    if filter_chapter:
        where_clause["chapter"] = filter_chapter
    
    # Expand query using Ollama
    try:
        expanded_query = query
        # Optionally use Ollama to expand the query
        expanded_query = ollama.generate(model="gemma3:1b", system=f"you are a query expansion engine, expand this query for Islamic hadith search. only and only return the expanded query, nothing else:", prompt=query)
        expanded_query = expanded_query['response']
        # print(expanded_query)
    except Exception as e:
        print(f"Query expansion error: {str(e)}")
        expanded_query = query
    
    
    # Search ChromaDB
    try:
        results = collection.query(
            query_texts=[expanded_query],
            n_results=limit,
            where=where_clause if where_clause else None
        )
        
        # Format results
        search_results = []
        for i, (doc_id, doc_text, metadata, distance) in enumerate(zip(
            results['ids'][0],
            results['documents'][0],
            results['metadatas'][0],
            results['distances'][0]
        )):
            # print(distance)
            # Calculate similarity score (1 - distance), as distance is a measure of difference
            similarity = (2 - distance)/2
            search_results.append(
                SearchResult(
                    hadith_id=doc_id,
                    text=doc_text,
                    score=similarity,
                    metadata=metadata
                )
            )
        
        return search_results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")

@app.get("/answer", response_model=AnswerResponse)
def answer_question(
    question: str = Query(..., description="Question to answer"),
    limit: int = Query(5, description="Number of hadiths to consider")
):
    # Search for relevant hadiths
    try:
        results = collection.query(
            query_texts=[question],
            n_results=limit
        )
        
        # Format hadith results
        search_results = []
        context = ""
        
        for i, (doc_id, doc_text, metadata, distance) in enumerate(zip(
            results['ids'][0],
            results['documents'][0],
            results['metadatas'][0],
            results['distances'][0]
        )):
            # Calculate similarity score
            similarity = 2 - distance
            context += f"Hadith {i+1}: {doc_text}\n\n"
            
            search_results.append(
                SearchResult(
                    hadith_id=doc_id,
                    text=doc_text,
                    score=similarity,
                    metadata=metadata
                )
            )
        # print(context)
        # Generate answer using Ollama
        prompt = f"""Based on the following hadith texts, please answer the question: "{question}"
        
Context:
{context}

Answer only based on the provided hadith texts. If the answer cannot be found in the provided texts, say so clearly .answer with no formatting and as humanly as possible.
"""
        
        try:
            response = ollama.generate(
                model="gemma3:1b",
                prompt=prompt 
            )
            answer = response['response']
            
            # Remove think tags and content if present
            answer = re.sub(r'<think>.*?</think>\s*', '', answer, flags=re.DOTALL)
            
        except Exception as e:
            answer = f"Error generating answer: {str(e)}"
        
        return AnswerResponse(
            answer=answer,
            hadiths=search_results
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# Run with: uvicorn app:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True) 
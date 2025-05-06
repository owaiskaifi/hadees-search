import pandas as pd
import chromadb
from chromadb.utils.embedding_functions.ollama_embedding_function import (
    OllamaEmbeddingFunction,
)

# Load data
df = pd.read_csv('data/all_hadiths_clean.csv')
print(f"Loaded {len(df)} hadiths")

# Set up Ollama embedding function
ollama_ef = OllamaEmbeddingFunction(
    url="http://localhost:11434",
    model_name="mxbai-embed-large:latest",
)

# Initialize ChromaDB client
client = chromadb.PersistentClient(path="./chroma_db")

# Create or get collection
collection = client.get_or_create_collection(
    name="hadiths_collection",
    embedding_function=ollama_ef
)

# Index hadiths row by row
batch_size = 100
total_hadiths = len(df)
processed = 0

for i in range(0, total_hadiths, batch_size):
    batch_df = df.iloc[i:min(i+batch_size, total_hadiths)]
    
    ids = batch_df['hadith_id'].astype(str).tolist()
    texts = batch_df['text_en'].tolist()
    
    # Create metadata for each hadith
    metadatas = batch_df.apply(
        lambda row: {
            "source": row["source"],
            "chapter": row["chapter"],
            "chapter_no": row["chapter_no"],
            "hadith_no": row["hadith_no"]
        }, axis=1
    ).tolist()
    
    # Add to collection
    collection.add(
        ids=ids,
        documents=texts,
        metadatas=metadatas
    )
    
    processed += len(batch_df)
    print(f"Indexed {processed}/{total_hadiths} hadiths")

print("Indexing complete!")

# 
import pandas as pd
import chromadb
import os
import sys
import time
from tqdm import tqdm
from chromadb.utils.embedding_functions.ollama_embedding_function import (
    OllamaEmbeddingFunction,
)

def check_ollama_availability(model_name="mxbai-embed-large:latest"):
    """Check if Ollama is available and running"""
    import requests
    try:
        response = requests.get("http://localhost:11434/api/tags")
        if response.status_code == 200:
            models = [tag["name"] for tag in response.json()["models"]]
            if model_name not in models:
                print(f"Warning: '{model_name}' model not found in Ollama. Please run 'ollama pull {model_name}'")
                return False
            return True
        else:
            print(f"Error connecting to Ollama: HTTP {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("Error: Cannot connect to Ollama at http://localhost:11434")
        print("Please ensure Ollama is running on your system.")
        return False

def index_hadiths(csv_path, chroma_path="./chroma_db", batch_size=100,model_name="mxbai-embed-large:latest"):
    """Index all hadiths from CSV file into ChromaDB"""
    
    # Check if CSV file exists
    if not os.path.exists(csv_path):
        print(f"Error: CSV file not found at {csv_path}")
        return False
    
    print(f"Loading data from {csv_path}...")
    try:
        df = pd.read_csv(csv_path)
        print(f"Successfully loaded {len(df):,} hadiths")
    except Exception as e:
        print(f"Error loading CSV file: {str(e)}")
        return False
    
    # Check for required columns
    required_columns = ["hadith_id", "text_en", "source", "chapter", "chapter_no", "hadith_no"]
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        print(f"Error: The following required columns are missing from the CSV: {', '.join(missing_columns)}")
        return False
    
    # Check for empty hadith_id values
    empty_ids = df[df["hadith_id"].isna() | (df["hadith_id"] == "")].shape[0]
    if empty_ids > 0:
        print(f"Warning: Found {empty_ids} rows with empty hadith_id. These will be skipped.")
        df = df[~df["hadith_id"].isna() & (df["hadith_id"] != "")]
    
    # Set up Ollama embedding function
    print("Setting up Ollama embedding function...")
    ollama_ef = OllamaEmbeddingFunction(
        url="http://localhost:11434",
        model_name=model_name,
    )
    
    # Initialize ChromaDB client
    print(f"Initializing ChromaDB at {chroma_path}...")
    client = chromadb.PersistentClient(path=chroma_path)
    
    # Create or get collection
    collection = client.get_or_create_collection(
        name="hadiths_collection",
        embedding_function=ollama_ef
    )
    
    # Check if collection already has documents
    existing_count = collection.count()
    if existing_count > 0:
        user_input = input(f"Found {existing_count} documents already in the collection. Do you want to delete them and reindex? (y/n): ")
        if user_input.lower() == 'y':
            print("Deleting existing collection...")
            client.delete_collection("hadiths_collection")
            collection = client.create_collection(
                name="hadiths_collection",
                embedding_function=ollama_ef
            )
        else:
            print("Aborting indexing operation.")
            return False
    
    # Index hadiths in batches
    total_hadiths = len(df)
    print(f"Starting indexing of {total_hadiths:,} hadiths in batches of {batch_size}...")
    
    # Start timing
    start_time = time.time()
    
    # Use tqdm for a nice progress bar
    with tqdm(total=total_hadiths, desc="Indexing") as pbar:
        processed = 0
        for i in range(0, total_hadiths, batch_size):
            batch_df = df.iloc[i:min(i+batch_size, total_hadiths)]
            
            try:
                # Convert hadith_id to string and handle any other type conversions
                ids = batch_df['hadith_id'].astype(str).tolist()
                texts = batch_df['text_en'].tolist()
                
                # Create metadata for each hadith
                metadatas = batch_df.apply(
                    lambda row: {
                        "source": str(row["source"]) if not pd.isna(row["source"]) else "",
                        "chapter": str(row["chapter"]) if not pd.isna(row["chapter"]) else "",
                        "chapter_no": str(row["chapter_no"]) if not pd.isna(row["chapter_no"]) else "",
                        "hadith_no": str(row["hadith_no"]) if not pd.isna(row["hadith_no"]) else ""
                    }, axis=1
                ).tolist()
                
                # Add to collection
                collection.add(
                    ids=ids,
                    documents=texts,
                    metadatas=metadatas
                )
                
                processed += len(batch_df)
                pbar.update(len(batch_df))
                
            except Exception as e:
                print(f"\nError during batch processing (batch starting at index {i}): {str(e)}")
                print("Continuing with next batch...")
                continue
    
    # Calculate timing information
    elapsed_time = time.time() - start_time
    minutes, seconds = divmod(elapsed_time, 60)
    hours, minutes = divmod(minutes, 60)
    
    # Final report
    print(f"\nIndexing complete! Processed {processed:,}/{total_hadiths:,} hadiths in {int(hours)}h {int(minutes)}m {seconds:.2f}s")
    print(f"Indexing speed: {processed/elapsed_time:.2f} hadiths/second")
    print(f"ChromaDB collection: {chroma_path}/hadiths_collection")
    
    return True

if __name__ == "__main__":
    # Default CSV path
    csv_path = 'data/all_hadiths_clean.csv'
    
    # Get CSV path from command line if provided
    if len(sys.argv) > 1:
        csv_path = sys.argv[1]
    
    # Verify Ollama is running
    if not check_ollama_availability(model_name="mxbai-embed-large:latest"):
        print("Please start Ollama and ensure the model is available.")
        sys.exit(1)
    
    # Run the indexer
    if index_hadiths(csv_path):
        print("You can now run the backend server to search and query the indexed hadiths.")
    else:
        print("Indexing failed. Please check the error messages above.")
        sys.exit(1) 
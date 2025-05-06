#!/bin/bash

# Check if Ollama is running
if ! curl -s --head http://localhost:11434 > /dev/null; then
    echo "Error: Ollama is not running. Please start Ollama first."
    exit 1
fi



echo "Starting Hadees Search Engine..."

# Start the backend
cd backend
(uvicorn app:app --reload --host 0.0.0.0 --port 8000 &)
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

# Start the frontend
cd ../frontend
(npm start &)
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

# Handle cleanup on exit
trap 'kill $BACKEND_PID $FRONTEND_PID; exit 0' INT TERM

echo "Hadees Search Engine is running!"
echo "Backend: http://localhost:8000"
echo "Frontend: http://localhost:3000"
echo "Press Ctrl+C to stop both servers."

# Keep the script running
wait 
#!/bin/bash

echo "Building Voice Memos Docker image..."

docker build -t voice-memos:latest .

echo "Build completed successfully!"
echo "Run with: docker run -p 3000:80 voice-memos:latest"
echo "Or use docker-compose: docker-compose up"

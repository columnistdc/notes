#!/bin/bash

echo "Starting Voice Memos container..."

docker run -d \
  --name voice-memos-app \
  -p 3000:80 \
  --restart unless-stopped \
  voice-memos:latest

echo "Container started successfully!"
echo "Access the app at: http://localhost:3000"
echo "View logs with: docker logs voice-memos-app"
echo "Stop with: docker stop voice-memos-app"

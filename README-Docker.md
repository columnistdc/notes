# Voice Memos - Docker Setup

This is a voice memo creation application ready for Docker deployment.

## Quick Start

### With Docker Compose (recommended)

```bash
# Start the application
docker-compose up -d

# Application will be available at: http://localhost:3000
```

### With Docker directly

```bash
# Build image
docker build -t voice-memos:latest .

# Run container
docker run -d --name voice-memos-app -p 3000:80 voice-memos:latest
```

## Make Commands

```bash
# Show help
make help

# Build image
make build

# Run with docker-compose
make run

# Stop
make stop

# View logs
make logs

# Clean up
make clean

# Container status
make status
```

## Docker Files Structure

- `Dockerfile` - multi-stage build with optimization
- `nginx.conf` - nginx configuration for SPA
- `docker-compose.yml` - container orchestration
- `.dockerignore` - Docker context exclusions

## Features

- **Multi-stage build** - optimized image size
- **Nginx** - fast web server for static files
- **SPA support** - proper routing for React Router
- **Caching** - optimized static resource caching
- **HTTPS ready** - easy SSL/TLS setup

## Port

The application runs on port **3000** (mapping from internal 80).

## Environment Variables

- `NODE_ENV=production` - production mode

## Monitoring

```bash
# Container logs
docker-compose logs -f

# Resource statistics
docker stats voice-memos-app

# Access container shell
make shell
```

## Production Deployment

For production, it's recommended to:

1. Use Docker Registry
2. Configure HTTPS with Let's Encrypt
3. Add monitoring (Prometheus, Grafana)
4. Set up logging
5. Use Docker Swarm or Kubernetes

## Troubleshooting

### Port in use
```bash
# Check what's using port 3000
lsof -i :3000

# Stop container
make stop
```

### Permission issues
```bash
# Give execute permissions to scripts
chmod +x scripts/*.sh
```

### Docker cleanup
```bash
# Remove all unused images
docker system prune -a

# Remove all containers
docker container prune
```

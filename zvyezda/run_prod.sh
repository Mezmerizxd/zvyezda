# Handle the production environment, Updating, deleting old images, etc.

# If user is in the root directory, then move to zvyezda directory
if [ -d "zvyezda" ]; then
    cd zvyezda
fi

# Stop the docker-compose services
docker-compose -f docker-compose.prod.yml down

# Pull the latest images
docker-compose -f docker-compose.prod.yml pull

# Remove old images
docker image prune -f

# Start the docker-compose services
docker-compose -f docker-compose.prod.yml up -d --build

# Remove old images
docker image prune -f

# Show the logs
docker-compose -f docker-compose.prod.yml logs -f
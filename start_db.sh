#!/bin/bash

# Start Database Script
# This script starts the PostgreSQL database using Docker Compose

set -e

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Flower Vendor Database...${NC}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running!${NC}"
    echo -e "${YELLOW}Please start Docker Desktop and try again.${NC}"
    exit 1
fi

# Start the database
docker compose up -d db

# Wait for database to be ready
echo -e "${GREEN}Waiting for database to be ready...${NC}"
sleep 3

# Check if database is running
if docker ps | grep -q flower_vendor_db; then
    echo -e "${GREEN}Database started successfully!${NC}"
    echo -e "${GREEN}Database is running on: localhost:5432${NC}"
    echo -e "${GREEN}Database name: flower_vendor${NC}"
    echo -e "${GREEN}Username: flower${NC}"
    echo ""
    echo -e "${YELLOW}To stop the database, run: ./stop_db.sh${NC}"
    echo -e "${YELLOW}To view database logs, run: docker logs flower_vendor_db${NC}"
else
    echo -e "${RED}Failed to start database!${NC}"
    echo -e "${YELLOW}Check Docker logs: docker logs flower_vendor_db${NC}"
    exit 1
fi



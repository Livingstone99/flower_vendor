#!/bin/bash

# Stop Database Script
# This script stops the PostgreSQL database

set -e

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Stopping Flower Vendor Database...${NC}"

# Stop the database
docker compose stop db

echo -e "${GREEN}Database stopped successfully!${NC}"

# Optionally remove the container (uncomment if you want to remove it)
# docker compose down db



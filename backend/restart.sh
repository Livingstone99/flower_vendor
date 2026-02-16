#!/bin/bash

# Restart Backend Server Script
# This script stops and then starts the FastAPI backend server

set -e

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "Restarting Flower Vendor Backend Server..."
echo ""

# Stop the server
./stop.sh

# Wait a moment
sleep 2

# Start the server
./start.sh



#!/bin/bash

# Stop Backend Server Script
# This script stops the FastAPI backend server

set -e

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Stopping Flower Vendor Backend Server...${NC}"

# Check if PID file exists
if [ ! -f ".pid/uvicorn.pid" ]; then
    echo -e "${YELLOW}No PID file found. Searching for uvicorn processes...${NC}"
    
    # Try to find uvicorn processes
    PIDS=$(pgrep -f "uvicorn app.main:app" || true)
    
    if [ -z "$PIDS" ]; then
        echo -e "${YELLOW}No uvicorn processes found. Server may not be running.${NC}"
        exit 0
    else
        echo -e "${YELLOW}Found uvicorn processes: $PIDS${NC}"
        for PID in $PIDS; do
            echo -e "${GREEN}Stopping process $PID...${NC}"
            kill $PID 2>/dev/null || true
        done
        echo -e "${GREEN}Server stopped.${NC}"
        exit 0
    fi
fi

# Read PID from file
PID=$(cat .pid/uvicorn.pid)

# Check if process is still running
if ! ps -p $PID > /dev/null 2>&1; then
    echo -e "${YELLOW}Process $PID is not running. Removing stale PID file...${NC}"
    rm .pid/uvicorn.pid
    exit 0
fi

# Stop the process
echo -e "${GREEN}Stopping process $PID...${NC}"
kill $PID 2>/dev/null || {
    echo -e "${RED}Failed to stop process $PID${NC}"
    exit 1
}

# Wait a bit for graceful shutdown
sleep 2

# Check if process is still running (force kill if needed)
if ps -p $PID > /dev/null 2>&1; then
    echo -e "${YELLOW}Process still running, forcing termination...${NC}"
    kill -9 $PID 2>/dev/null || true
    sleep 1
fi

# Remove PID file
rm -f .pid/uvicorn.pid

# Clean up log file (optional - comment out if you want to keep logs)
# rm -f .pid/uvicorn.log

echo -e "${GREEN}Server stopped successfully!${NC}"



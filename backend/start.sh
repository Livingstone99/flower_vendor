#!/bin/bash

# Start Backend Server Script
# This script starts the FastAPI backend server using uvicorn

set -e

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Flower Vendor Backend Server...${NC}"

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo -e "${YELLOW}Virtual environment not found. Creating one...${NC}"
    python3 -m venv .venv
fi

# Activate virtual environment
echo -e "${GREEN}Activating virtual environment...${NC}"
source .venv/bin/activate

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}.env file not found. Copying from env.example...${NC}"
    cp env.example .env
    echo -e "${YELLOW}Please update .env with your configuration!${NC}"
fi

# Install/update dependencies
echo -e "${GREEN}Checking dependencies...${NC}"
pip install -q -r requirements.txt

# Check if database migrations are needed
echo -e "${GREEN}Checking database migrations...${NC}"
export PYTHONPATH=$PWD
# Load environment variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi
alembic upgrade head || echo -e "${YELLOW}Warning: Database migration check failed. Make sure your database is running.${NC}"

# Create PID file directory if it doesn't exist
mkdir -p .pid

# Check if server is already running
if [ -f ".pid/uvicorn.pid" ]; then
    PID=$(cat .pid/uvicorn.pid)
    if ps -p $PID > /dev/null 2>&1; then
        echo -e "${RED}Server is already running (PID: $PID)${NC}"
        echo -e "${YELLOW}Use ./stop.sh to stop it first${NC}"
        exit 1
    else
        # Remove stale PID file
        rm .pid/uvicorn.pid
    fi
fi

# Start the server
echo -e "${GREEN}Starting uvicorn server...${NC}"
echo -e "${GREEN}Server will be available at: http://localhost:8000${NC}"
echo -e "${GREEN}API docs will be available at: http://localhost:8000/docs${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
echo ""

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down server...${NC}"
    if [ -f ".pid/uvicorn.pid" ]; then
        PID=$(cat .pid/uvicorn.pid)
        # Kill uvicorn and tail processes
        kill $PID 2>/dev/null || true
        pkill -P $PID 2>/dev/null || true
        rm -f .pid/uvicorn.pid
    fi
    echo -e "${GREEN}Server stopped.${NC}"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start uvicorn in the background, redirecting output to log file
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > .pid/uvicorn.log 2>&1 &
UVICORN_PID=$!
echo $UVICORN_PID > .pid/uvicorn.pid

# Wait a moment to check if server started successfully
sleep 2

# Check if process is still running
if ! ps -p $UVICORN_PID > /dev/null 2>&1; then
    echo -e "${RED}Failed to start server!${NC}"
    echo -e "${YELLOW}Check .pid/uvicorn.log for error details${NC}"
    rm -f .pid/uvicorn.pid
    exit 1
fi

echo -e "${GREEN}Server started successfully!${NC}"
echo -e "${GREEN}Process ID: $UVICORN_PID${NC}"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Server logs (Press Ctrl+C to stop):${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Display logs in the terminal using tail -f
tail -f .pid/uvicorn.log


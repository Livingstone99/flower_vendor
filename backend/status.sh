#!/bin/bash

# Status Check Script for Backend Server
# This script checks if the backend server is running

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Checking Flower Vendor Backend Server Status...${NC}"
echo ""

# Check if PID file exists
if [ -f ".pid/uvicorn.pid" ]; then
    PID=$(cat .pid/uvicorn.pid)
    if ps -p $PID > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Server is running${NC}"
        echo -e "  Process ID: $PID"
        echo -e "  URL: http://localhost:8000"
        echo -e "  API Docs: http://localhost:8000/docs"
        
        # Check if server is responding
        if curl -s http://localhost:8000/health > /dev/null 2>&1; then
            echo -e "  Status: ${GREEN}Responding${NC}"
        else
            echo -e "  Status: ${YELLOW}Running but not responding${NC}"
        fi
    else
        echo -e "${RED}✗ Server is not running (stale PID file)${NC}"
        rm -f .pid/uvicorn.pid
    fi
else
    # Try to find uvicorn processes
    PIDS=$(pgrep -f "uvicorn app.main:app" || true)
    
    if [ -z "$PIDS" ]; then
        echo -e "${RED}✗ Server is not running${NC}"
    else
        echo -e "${YELLOW}⚠ Server process found but no PID file${NC}"
        echo -e "  Process IDs: $PIDS"
    fi
fi

echo ""



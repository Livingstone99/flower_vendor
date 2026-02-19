#!/bin/bash

# Setup Local PostgreSQL Database Script
# This script creates the database and user for the Flower Vendor application

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up Flower Vendor Database (Local PostgreSQL)...${NC}"
echo ""

# Check if PostgreSQL is running
if ! pg_isready > /dev/null 2>&1; then
    echo -e "${RED}Error: PostgreSQL is not running!${NC}"
    echo -e "${YELLOW}Start PostgreSQL and try again.${NC}"
    exit 1
fi

echo -e "${GREEN}PostgreSQL is running.${NC}"

# Database configuration
DB_NAME="flower_vendor"
DB_USER="flower"
DB_PASSWORD="flower"

# Check if user exists
USER_EXISTS=$(psql postgres -tAc "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'" 2>/dev/null || echo "")

if [ "$USER_EXISTS" = "1" ]; then
    echo -e "${YELLOW}User '$DB_USER' already exists.${NC}"
else
    echo -e "${GREEN}Creating user '$DB_USER'...${NC}"
    psql postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" || {
        echo -e "${RED}Failed to create user!${NC}"
        exit 1
    }
    echo -e "${GREEN}User '$DB_USER' created successfully.${NC}"
fi

# Check if database exists
DB_EXISTS=$(psql postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" 2>/dev/null || echo "")

if [ "$DB_EXISTS" = "1" ]; then
    echo -e "${YELLOW}Database '$DB_NAME' already exists.${NC}"
else
    echo -e "${GREEN}Creating database '$DB_NAME'...${NC}"
    psql postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" || {
        echo -e "${RED}Failed to create database!${NC}"
        exit 1
    }
    echo -e "${GREEN}Database '$DB_NAME' created successfully.${NC}"
fi

# Grant privileges
echo -e "${GREEN}Granting privileges...${NC}"
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" || {
    echo -e "${YELLOW}Warning: Failed to grant privileges (database may already be configured)${NC}"
}

# Test connection
echo -e "${GREEN}Testing database connection...${NC}"
PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d $DB_NAME -c "SELECT version();" > /dev/null 2>&1 || {
    echo -e "${RED}Failed to connect to database!${NC}"
    exit 1
}

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Database setup complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}Database details:${NC}"
echo -e "  Host: localhost:5432"
echo -e "  Database: $DB_NAME"
echo -e "  Username: $DB_USER"
echo -e "  Password: $DB_PASSWORD"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. cd backend"
echo -e "  2. source .venv/bin/activate"
echo -e "  3. alembic upgrade head"
echo -e "  4. python create_admin.py"
echo -e "  5. ./start.sh"
echo ""



#!/bin/bash

# ScaleBiz Deployment Script
# This script sets up and deploys the complete ScaleBiz e-commerce platform

set -e  # Exit on error

echo "==================================="
echo "ScaleBiz Deployment Script"
echo "==================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/scalebiz_backend"
STOREFRONT_DIR="$SCRIPT_DIR/merchant_scalebiz"
DASHBOARD_DIR="$SCRIPT_DIR/scalebiz"

# Configuration
DB_NAME="scalebiz_new"
DB_USER="scalebiz"
DB_PASS="ScaleBiz@2025"
DB_HOST="localhost"

echo -e "${GREEN}[1/7] Checking prerequisites...${NC}"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR] Node.js is not installed. Please install Node.js 18+${NC}"
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo -e "${RED}[ERROR] MySQL is not installed. Please install MySQL${NC}"
    exit 1
fi

echo -e "${GREEN}[2/7] Setting up database...${NC}"

# Ask for database root password
read -sp "Enter MySQL root password: " DB_ROOT_PASS
echo

# Create database and user if they don't exist
mysql -u root -p"$DB_ROOT_PASS" <<EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$DB_USER'@'localhost' IDENTIFIED BY '$DB_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'localhost';
FLUSH PRIVILEGES;
EOF

echo -e "${GREEN}[3/7] Running database schema...${NC}"
mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$BACKEND_DIR/full_schema.sql"
echo "Schema applied."

echo -e "${GREEN}[4/7] Seeding initial data...${NC}"

# Check if themes exist, if not seed them
THEME_COUNT=$(mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -N -e "SELECT COUNT(*) FROM themes;" 2>/dev/null || echo "0")
if [ "$THEME_COUNT" -eq 0 ]; then
    mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" < "$BACKEND_DIR/seed_themes_and_blocks.sql"
    echo "Themes and blocks seeded."
else
    echo "Themes already exist, skipping seed."
fi

# Optionally seed stores and other data
read -p "Do you want to seed stores and sample data? (y/N): " SEED_DATA
if [[ $SEED_DATA =~ ^[Yy]$ ]]; then
    # Check if stores table is empty
    STORE_COUNT=$(mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -N -e "SELECT COUNT(*) FROM stores;" 2>/dev/null || echo "0")
    if [ "$STORE_COUNT" -eq 0 ]; then
        # Modified seed to include theme_blocks references and proper theme_id
        # For simplicity, we'll skip full seed and just create a default store
        echo "Creating default store..."

        # Get first theme ID
        THEME_ID=$(mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" -N -e "SELECT id FROM themes LIMIT 1;")
        if [ -z "$THEME_ID" ]; then
            echo -e "${RED}No themes found. Please run theme seed first.${NC}"
            exit 1
        fi

        mysql -u "$DB_USER" -p"$DB_PASS" "$DB_NAME" <<SQL
INSERT INTO stores (theme_id, hostname, store_name, logo_url, favicon_url, status) VALUES
($THEME_ID, 'localhost:4000', 'My Store', '/logo.png', '/favicon.ico', 'trial');

INSERT INTO store_configurations (store_id, theme_settings, layout_settings, page_settings) VALUES
(LAST_INSERT_ID(),
 '{"name": "basic", "primaryColor": "#000000", "secondaryColor": "#FFFFFF"}',
 '{"announcementBar": {"enabled": true, "text": "Free shipping!"}}',
 '{"landingPage": {"components": []}}');

INSERT INTO store_theme_settings (store_id, theme_id, primary_color, secondary_color) VALUES
(LAST_INSERT_ID(), $THEME_ID, '#000000', '#FFFFFF');

INSERT INTO users (store_id, name, email, password_hash, role, account_status) VALUES
(LAST_INSERT_ID(), 'Admin', 'admin@example.com', '\$2b\$10\$NlKSj3UjqpZNVYWq3eC5.uXWFv0GNHaKXm8J/xRM7D8XLGRn0hCOK', 'owner', 'active');
SQL
        echo "Default store created."
    else
        echo "Stores already exist, skipping store seed."
    fi
fi

echo -e "${GREEN}[5/7] Building frontends (if needed)...${NC}"

# Build storefront
if [ ! -d "$STOREFRONT_DIR/dist" ] || [ ! -f "$STOREFRONT_DIR/dist/index.html" ]; then
    echo "Building storefront..."
    cd "$STOREFRONT_DIR"
    npm ci --legacy-peer-deps
    npm run build
    echo "Storefront built."
else
    echo "Storefront already built, skipping..."
fi

# Build dashboard
if [ ! -d "$DASHBOARD_DIR/dist" ] || [ ! -f "$DASHBOARD_DIR/dist/index.html" ]; then
    echo "Building dashboard..."
    cd "$DASHBOARD_DIR"
    npm ci --legacy-peer-deps
    npm run build
    echo "Dashboard built."
else
    echo "Dashboard already built, skipping..."
fi

echo -e "${GREEN}[6/7] Deploying backend service...${NC}"

# Copy systemd service file
sudo cp "$BACKEND_DIR/scalebiz-backend.service" /etc/systemd/system/
sudo systemctl daemon-reload

# Update backend .env if needed
if [ ! -f "$BACKEND_DIR/.env" ]; then
    cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env" 2>/dev/null || true
fi

# Start backend
sudo systemctl enable scalebiz-backend
sudo systemctl restart scalebiz-backend

sleep 3
if systemctl is-active --quiet scalebiz-backend; then
    echo -e "${GREEN}Backend service is running${NC}"
else
    echo -e "${RED}Backend service failed to start. Check logs:${NC}"
    echo "sudo journalctl -u scalebiz-backend -f"
    exit 1
fi

echo -e "${GREEN}[7/7] Setting up Nginx...${NC}"

# Copy nginx config
sudo cp "$SCRIPT_DIR/nginx-scalebiz.conf" /etc/nginx/sites-available/scalebiz
sudo ln -sf /etc/nginx/sites-available/scalebiz /etc/nginx/sites-enabled/scalebiz

# Test nginx config
sudo nginx -t

if [ $? -eq 0 ]; then
    sudo systemctl reload nginx
    echo -e "${GREEN}Nginx configured and reloaded${NC}"
else
    echo -e "${RED}Nginx configuration test failed${NC}"
    exit 1
fi

echo ""
echo "==================================="
echo -e "${GREEN}Deployment Complete!${NC}"
echo "==================================="
echo ""
echo "Services:"
echo "  Backend API:  http://localhost:4000/api"
echo "  Dashboard:    http://localhost/dashboard"
echo "  Storefront:   http://localhost/"
echo ""
echo "Admin access:"
echo "  URL: http://localhost/dashboard/auth/login"
echo "  Email: admin@example.com"
echo "  Password: admin123"
echo ""
echo "Next steps:"
echo "1. Change admin password in Dashboard -> Profile"
echo "2. Configure your store settings"
echo "3. Add products and create custom pages"
echo ""
echo "To view logs:"
echo "  Backend: sudo journalctl -u scalebiz-backend -f"
echo "  Nginx:   sudo journalctl -u nginx -f"
echo ""

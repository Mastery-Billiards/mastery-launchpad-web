#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SERVER_USER="mastery"
SERVER_IP="14.225.206.52"
SERVER_PATH="/app/mastery/mastery-launchpad-web"
APP_NAME="mastery-launchpad-web"

echo -e "${GREEN}Starting deployment process...${NC}"

echo -e "${GREEN}Building the application locally...${NC}"
yarn build

echo -e "${GREEN}Preparing files for deployment...${NC}"
TEMP_DIR="deploy_temp"
mkdir -p $TEMP_DIR

# Copy necessary files to temp directory
echo -e "${GREEN}Copying necessary files...${NC}"
cp -r .next $TEMP_DIR/
cp package.json $TEMP_DIR/
cp yarn.lock $TEMP_DIR/
cp next.config.js $TEMP_DIR/ 2>/dev/null || :
cp -r public $TEMP_DIR/ 2>/dev/null || :

# Create deployment script
cat > $TEMP_DIR/deploy_server.sh << 'EOL'
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}Starting server-side deployment...${NC}"

echo -e "${GREEN}Installing dependencies...${NC}"
yarn install --production

if ! command -v pm2 &> /dev/null; then
    echo -e "${GREEN}Installing PM2 globally...${NC}"
    yarn global add pm2
fi

echo -e "${GREEN}Stopping existing application...${NC}"
pm2 stop mastery-launchpad-web 2>/dev/null || true

echo -e "${GREEN}Starting the application...${NC}"
pm2 start "yarn next start" --name "mastery-launchpad-web"

echo -e "${GREEN}Saving PM2 process list...${NC}"
pm2 save

echo -e "${GREEN}Server-side deployment completed!${NC}"
EOL

chmod +x $TEMP_DIR/deploy_server.sh

# Create deployment archive
echo -e "${GREEN}Creating deployment archive...${NC}"
tar -czf deploy.tar.gz -C $TEMP_DIR .

echo -e "${GREEN}Copying files to server...${NC}"
scp deploy.tar.gz $SERVER_USER@$SERVER_IP:$SERVER_PATH/

echo -e "${GREEN}Executing deployment on server...${NC}"
ssh $SERVER_USER@$SERVER_IP "cd $SERVER_PATH && \
    tar -xzf deploy.tar.gz && \
    ./deploy_server.sh && \
    rm deploy.tar.gz"

echo -e "${GREEN}Cleaning up...${NC}"
rm -rf $TEMP_DIR deploy.tar.gz

echo -e "${GREEN}Deployment completed successfully!${NC}"
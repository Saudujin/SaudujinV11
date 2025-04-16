#!/bin/bash

# Deployment script for Falcons Supporters League website
# This script will build and deploy the website

echo "Starting deployment for Falcons Supporters League website..."
echo "==========================================================="

# Navigate to project directory
cd /home/ubuntu/falcons-supporters-league

# Install dependencies if needed
echo "Checking and installing dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "❌ Build failed. Please check the errors above."
  exit 1
fi

echo "✅ Build successful!"

# Create .env file for production
echo "Creating production environment variables..."
cat > .env.production << 'EOL'
# Production environment variables
NEXT_PUBLIC_API_URL=https://falcons-supporters-league.vercel.app/api
MONGODB_URI=${MONGODB_URI}
TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
TWILIO_VERIFY_SERVICE_SID=${TWILIO_VERIFY_SERVICE_SID}
JWT_SECRET=falcons_supporters_league_jwt_secret_2025
NEXT_PUBLIC_DEFAULT_LOCALE=en
NEXT_PUBLIC_AVAILABLE_LOCALES=en,ar
EOL

echo "✅ Environment variables created"

# Prepare for deployment
echo "Preparing for deployment..."

# Create deployment directory
mkdir -p deployment
cp -r .next deployment/
cp -r public deployment/
cp package.json deployment/
cp .env.production deployment/

# Create deployment README
cat > deployment/README.md << 'EOL'
# Falcons Supporters League Website

This is the production build of the Falcons Supporters League website, a fan engagement platform for esports team Falcons.

## Deployment Instructions

### Prerequisites
- Node.js 14.x or higher
- MongoDB database
- Twilio account for SMS verification

### Steps to Deploy

1. Install dependencies:
```
npm install --production
```

2. Set up environment variables:
Make sure all required environment variables are set in `.env.production` or in your hosting environment.

3. Start the server:
```
npm start
```

### Deployment to Vercel

For deployment to Vercel:

1. Connect your GitHub repository to Vercel
2. Set up the environment variables in the Vercel dashboard
3. Deploy using the Vercel dashboard or CLI

### Deployment to Other Platforms

The application can also be deployed to other platforms like:
- AWS Elastic Beanstalk
- Google Cloud Run
- Heroku
- DigitalOcean App Platform

Follow the platform-specific instructions for deploying Next.js applications.

## Features

- User registration and phone verification
- Multilingual support (English and Arabic)
- Loyalty circle system with rewards
- Tournament calendar with registration
- User dashboard
- Admin panel
- Responsive design with light and dark themes

## Support

For support, please contact the development team.
EOL

echo "✅ Deployment files prepared"

# Create deployment instructions
cat > DEPLOYMENT.md << 'EOL'
# Deployment Instructions for Falcons Supporters League Website

This document provides instructions for deploying the Falcons Supporters League website to production.

## Option 1: Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (can sign up with GitHub)
- MongoDB Atlas database

### Steps

1. Push the code to a GitHub repository:
```
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/falcons-supporters-league.git
git push -u origin main
```

2. Connect the repository to Vercel:
   - Go to [Vercel](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - Configure the project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: npm run build
     - Output Directory: .next

3. Set up environment variables in Vercel:
   - MONGODB_URI
   - TWILIO_ACCOUNT_SID
   - TWILIO_AUTH_TOKEN
   - TWILIO_VERIFY_SERVICE_SID
   - JWT_SECRET
   - NEXT_PUBLIC_DEFAULT_LOCALE
   - NEXT_PUBLIC_AVAILABLE_LOCALES

4. Deploy the project:
   - Click "Deploy"
   - Wait for the deployment to complete
   - Your site will be available at a Vercel URL (e.g., falcons-supporters-league.vercel.app)

5. Set up a custom domain (optional):
   - In the Vercel dashboard, go to your project
   - Click "Domains"
   - Add your custom domain and follow the instructions

## Option 2: Manual Deployment

### Prerequisites
- Node.js 14.x or higher
- MongoDB database
- Web server (e.g., Nginx)

### Steps

1. Build the project:
```
npm run build
```

2. Copy the deployment files to your server:
```
scp -r deployment/* user@your-server:/path/to/deployment
```

3. Install dependencies on the server:
```
cd /path/to/deployment
npm install --production
```

4. Set up environment variables on the server:
   - Create or edit `.env.production` with the required variables

5. Start the application:
```
npm start
```

6. Set up a web server (e.g., Nginx) to proxy requests to the Next.js application:

Example Nginx configuration:
```
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

7. Set up SSL with Let's Encrypt:
```
sudo certbot --nginx -d your-domain.com
```

## Option 3: Deploy to Docker

### Prerequisites
- Docker
- Docker Compose

### Steps

1. Create a Dockerfile:
```
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY .next ./.next
COPY public ./public
COPY .env.production ./

EXPOSE 3000

CMD ["npm", "start"]
```

2. Create a docker-compose.yml file:
```
version: '3'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: always
```

3. Build and run the Docker container:
```
docker-compose up -d
```

## Post-Deployment Steps

1. Test the deployed application:
   - Test user registration and phone verification
   - Test multilingual support
   - Test loyalty circle system
   - Test tournament calendar
   - Test user dashboard
   - Test admin panel
   - Test responsive design and themes

2. Set up monitoring (optional):
   - Use a service like New Relic, Datadog, or Sentry
   - Monitor server health, application performance, and errors

3. Set up backups for the MongoDB database

4. Set up CI/CD for automated deployments (optional)

## Troubleshooting

If you encounter issues during deployment:

1. Check the logs:
```
npm run logs
```

2. Verify environment variables are set correctly

3. Check MongoDB connection

4. Ensure Twilio credentials are valid

5. Check for any build errors in the console

For additional help, refer to the Next.js deployment documentation: https://nextjs.org/docs/deployment
EOL

echo "✅ Deployment instructions created"

# Create a ZIP file of the deployment
echo "Creating deployment ZIP file..."
cd deployment
zip -r ../falcons-supporters-league-deployment.zip .
cd ..

echo "==========================================================="
echo "Deployment preparation complete!"
echo "The deployment files are in the 'deployment' directory."
echo "A ZIP file of the deployment is available at 'falcons-supporters-league-deployment.zip'."
echo "Detailed deployment instructions are in 'DEPLOYMENT.md'."
echo "==========================================================="

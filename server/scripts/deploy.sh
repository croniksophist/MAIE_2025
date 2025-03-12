#!/bin/bash
# Automated deployment script

echo "Starting deployment..."

# Pull latest code
git pull origin master

# Install dependencies (Python example)
pip install -r requirements.txt

# Apply database migrations (if using Alembic)
alembic upgrade head

# Restart the application (modify as needed)
systemctl restart maie_app  # Adjust to your service name

echo "Deployment completed."

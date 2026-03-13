#!/bin/bash

# Threadz Environment Setup Script
# This script sets up the complete development environment using conda

set -e

echo "🚀 Setting up Threadz Development Environment..."

# Check if conda is installed
if ! command -v conda &> /dev/null; then
    echo "❌ Conda is not installed. Please install Miniconda or Anaconda first."
    echo "Visit: https://docs.conda.io/en/latest/miniconda.html"
    exit 1
fi

# Create and activate conda environment
echo "📦 Creating conda environment from environment.yml..."
conda env create -f environment.yml

# Activate the environment
echo "🔄 Activating conda environment..."
eval "$(conda shell.bash hook)"
conda activate threadz-env

# Install additional pip dependencies if any
echo "📚 Installing additional Python dependencies..."
pip install --upgrade pip

# Check if Node.js is installed, if not install it
if ! command -v node &> /dev/null; then
    echo "📦 Node.js not found. Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "✅ Node.js is already installed"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
else
    echo "✅ npm is already installed"
fi

# Setup frontend dependencies
echo "🎨 Setting up frontend dependencies..."
cd Threadz-V1/frontend
npm install

# Go back to root
cd ../..

# Copy environment files
echo "⚙️ Setting up environment configuration..."
if [ ! -f .env ]; then
    cp Threadz-V1/backend/.env.example .env
    echo "✅ Created .env file from template"
fi

if [ ! -f Threadz-V1/frontend/.env ]; then
    cp Threadz-V1/frontend/.env.example Threadz-V1/frontend/.env
    echo "✅ Created frontend .env file from template"
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p uploads
mkdir -p logs
mkdir -p ssl
mkdir -p tmp

# Run database migrations
echo "🗄️ Running database migrations..."
cd Threadz-V1/backend
alembic upgrade head || echo "⚠️ Migration failed - please check database configuration"

# Go back to root
cd ../..

echo "✅ Setup complete!"
echo ""
echo "🎉 Threadz development environment is ready!"
echo ""
echo "To start development:"
echo "1. Activate the conda environment: conda activate threadz-env"
echo "2. Start the services: npm run dev"
echo "3. Or use Docker: npm run docker:dev"
echo ""
echo "Available commands:"
echo "- npm run dev: Start both backend and frontend in development mode"
echo "- npm run test: Run all tests"
echo "- npm run lint: Run linting"
echo "- npm run docker:dev: Start with Docker"
echo ""
echo "🌐 Frontend will be available at: http://localhost:3000"
echo "🔧 Backend API will be available at: http://localhost:8000"
echo "📚 API Documentation: http://localhost:8000/docs"

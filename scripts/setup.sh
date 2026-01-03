#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Installing root dependencies (if any)..."
if [ -f package.json ]; then
  npm install || true
fi

if [ -d apps/mobile ]; then
  echo "Installing mobile dependencies..."
  cd apps/mobile
  npm install
  echo "Installing expo native deps..."
  npx expo install react-native-gesture-handler react-native-reanimated
  cd "$ROOT_DIR"
fi

if [ -d backend ]; then
  echo "Installing backend dependencies..."
  cd backend
  npm install
  cd "$ROOT_DIR"
fi

echo "Setup complete. You can run 'npm run start:mobile' from project root to start the mobile app and 'npm run start:backend' to start the backend."
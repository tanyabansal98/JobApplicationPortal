#!/bin/bash

# --- Job Application Portal: Infrastructure Readiness Check ---
# Run this script on your Mac before starting your Azure Agent.

echo "------------------------------------------------"
echo "🔍 AUDITING LOCAL INFRASTRUCTURE..."
echo "------------------------------------------------"

# 1. Check Docker
echo -n "🐳 Checking Docker Desktop... "
if docker info > /dev/null 2>&1; then
    echo "READY ✅"
else
    echo "OFFLINE ❌"
    echo "👉 ACTION: Please open 'Docker Desktop' and wait for it to start."
    exit 1
fi

# 2. Check Node.js
echo -n "🚀 Checking Node.js Version... "
NODE_VER=$(/opt/homebrew/bin/node -v 2>/dev/null)
if [[ $NODE_VER == v2* ]]; then
    echo "READY ($NODE_VER) ✅"
else
    echo "VERSION MISMATCH ❌"
    echo "👉 ACTION: Ensure Node 20+ is installed at /opt/homebrew/bin/node."
fi

# 3. Check Java (OpenJDK 17)
echo -n "☕ Checking Java 17... "
if [ -d "/opt/homebrew/Cellar/openjdk@17" ]; then
    echo "READY ✅"
else
    echo "MISSING ❌"
    echo "👉 ACTION: Please ensure OpenJDK 17 is installed via Homebrew."
fi

# 4. Check Project Structure
echo -n "📂 Checking Dockerfiles... "
if [ -f "backend/Dockerfile" ] && [ -f "frontend/Dockerfile" ]; then
    echo "READY ✅"
else
    echo "MISSING ❌"
    echo "👉 ACTION: Ensure you are running this in the root of JobApplicationPortal."
fi

echo "------------------------------------------------"
echo "✅ ALL SYSTEMS GO! You are ready to run ./run.sh"
echo "------------------------------------------------"

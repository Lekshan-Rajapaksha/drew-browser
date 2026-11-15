#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-0.2.46}"
RELEASE="${2:-1}"
PACKAGE="${3:-1}"

echo "Building Ardia for Linux (Version: ${VERSION})"

if command -v pnpm &> /dev/null; then
    pnpm install
else
    echo "Warning: pnpm not found; skipping pnpm install."
fi

if command -v pnpm &> /dev/null; then
    pnpm turbo run build --filter=@ardia/core --filter=@ardia/native-shell
fi

BUILD_DIR="apps/browser/linux/build"
if command -v cmake &> /dev/null; then
    cmake -S apps/browser/linux -B "${BUILD_DIR}" -DCMAKE_BUILD_TYPE=Release
    cmake --build "${BUILD_DIR}" --config Release
    echo "Linux host compiled: ${BUILD_DIR}/Ardia"
else
    echo "Warning: CMake not found. Install cmake to compile the native host."
fi

if [ "${PACKAGE}" -eq 1 ]; then
    if [ -f "scripts/linux/create-appimage.sh" ]; then
        bash scripts/linux/create-appimage.sh "${VERSION}"
    fi
    if [ -f "scripts/linux/create-deb.sh" ]; then
        bash scripts/linux/create-deb.sh "${VERSION}"
    fi
fi

echo "Build complete."

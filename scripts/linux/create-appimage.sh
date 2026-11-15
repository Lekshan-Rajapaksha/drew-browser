#!/usr/bin/env bash
set -euo pipefail

APP_DIR="dist/AppDir"
mkdir -p "$APP_DIR/usr/bin"
mkdir -p "$APP_DIR/usr/share/applications"
mkdir -p "$APP_DIR/usr/share/icons/hicolor/256x256/apps"

cp scripts/linux/ardia.desktop "$APP_DIR/usr/share/applications/"
cp apps/site/src/assets/app-icon.png "$APP_DIR/usr/share/icons/hicolor/256x256/apps/ardia.png" || true

echo "AppDir prepared. Run appimagetool $APP_DIR Ardia.AppImage to package."


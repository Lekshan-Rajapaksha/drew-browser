#!/usr/bin/env bash
set -euo pipefail

VERSION="${1:-0.2.46}"
DEB_DIR="dist/deb/ardia_${VERSION}_amd64"

mkdir -p "$DEB_DIR/DEBIAN"
mkdir -p "$DEB_DIR/usr/bin"
mkdir -p "$DEB_DIR/usr/share/applications"

cat <<EOF > "$DEB_DIR/DEBIAN/control"
Package: ardia
Version: ${VERSION}
Section: web
Priority: optional
Architecture: amd64
Maintainer: Ardia Browser Authors <dev@ardia.dev>
Description: Arc's sidebar and Dia's polish on real Chromium.
EOF

cp scripts/linux/ardia.desktop "$DEB_DIR/usr/share/applications/"
echo "Debian structure created. Run dpkg-deb --build $DEB_DIR to generate package."


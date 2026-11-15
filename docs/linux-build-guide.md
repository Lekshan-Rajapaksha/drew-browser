# Building Ardia on Linux

Ardia on Linux consists of the Chromium engine with ArdiaCore hooks, the native GTK4 host, and the React Native frontend bundle.

## System Prerequisites

- Ubuntu 22.04 LTS / 24.04 LTS, Debian 12, or Fedora 39+ (x86_64 or aarch64)
- Minimum 16 GB RAM (32 GB recommended for engine compilation)
- 120 GB free disk space on an SSD
- Node.js 20+ and pnpm
- Python 3.10+ and Git

## System Dependencies

Install required build packages on Debian / Ubuntu:

```bash
sudo apt-get update
sudo apt-get install -y \
  build-essential \
  clang \
  lld \
  ninja-build \
  pkg-config \
  cmake \
  libgtk-4-dev \
  libglib2.0-dev \
  libsecret-1-dev \
  libdrm-dev \
  libx11-dev \
  libxkbcommon-dev \
  libpulse-dev \
  libasound2-dev \
  libva-dev \
  libdbus-1-dev
```

## Toolchain Setup

Clone and configure depot_tools:

```bash
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git ~/depot_tools
export PATH="$HOME/depot_tools:$PATH"
echo 'export PATH="$HOME/depot_tools:$PATH"' >> ~/.bashrc
```

Verify the environment:

```bash
gclient
ninja --version
python3 --version
```

## Source Tree Configuration

```bash
mkdir -p ~/src/ardia-engine
cd ~/src/ardia-engine
fetch --no-history chromium
cd src
git checkout tags/157.0.8103.50 -b ardia-157
./build/install-build-deps.sh
```

Apply patches from the Ardia repository:

```bash
git apply /path/to/ardia/engine/patches/linux/*.patch
```

Link ArdiaCore sources:

```bash
ln -sf /path/to/ardia/engine/chromium/src/chrome/browser/ardia src/chrome/browser/ardia
ln -sf /path/to/ardia/engine/ardiacore/src/ardia/core src/ardia/core
```

## GN Compilation Configuration

Generate ninja files:

```bash
gn gen out/Release
```

Populate `out/Release/args.gn`:

```gn
target_os = "linux"
target_cpu = "x64"
is_debug = false
is_official_build = true
is_component_build = false
symbol_level = 0
blink_symbol_level = 0
proprietary_codecs = true
ffmpeg_branding = "Chrome"
enable_nacl = false
enable_widevine = true
use_sysroot = true
use_vaapi = true
use_ozone = true
ozone_platform_x11 = true
ozone_platform_wayland = true
dcheck_always_on = false
chrome_pgo_phase = 0
```

## Compiling Engine Targets

```bash
autoninja -C out/Release chrome ardia_core
```

## Building Native GTK4 Host

```bash
cd apps/browser/linux
cmake -B build -S . -DCMAKE_BUILD_TYPE=Release
cmake --build build --config Release
```

## Packaging Application Bundle

Build AppImage and Debian packages:

```bash
bash scripts/build-linux.sh
```

The output packages are generated at:

```
dist/linux/ardia-1.0.0-x86_64.AppImage
dist/linux/ardia_1.0.0_amd64.deb
```


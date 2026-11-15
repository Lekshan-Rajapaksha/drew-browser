# Building Ardia on Windows

Ardia on Windows consists of the Chromium engine with ArdiaCore hooks, the native Win32 host, and the React Native frontend bundle.

## System Prerequisites

- Windows 10 (version 21H2 or later) or Windows 11 64-bit
- Minimum 16 GB RAM (32 GB recommended for engine compilation)
- 120 GB free NTFS disk space on an SSD
- Visual Studio 2022 (v17.4 or later) with:
  - Desktop development with C++
  - Windows 11 SDK (10.0.22621.0 or newer)
  - C++ ATL support
  - C++ Clang Compiler for Windows
- Python 3.10 or later
- Git for Windows
- Node.js 20+ and pnpm

## Toolchain Setup

Add depot_tools to the start of PATH in PowerShell:

```powershell
git clone https://chromium.googlesource.com/chromium/tools/depot_tools.git C:\src\depot_tools
[Environment]::SetEnvironmentVariable("Path", "C:\src\depot_tools;" + $env:Path, "User")
[Environment]::SetEnvironmentVariable("DEPOT_TOOLS_WIN_TOOLCHAIN", "0", "User")
```

Verify the environment:

```powershell
gclient
python3 --version
git --version
ninja --version
```

## Source Tree Configuration

```powershell
mkdir C:\src\ardia-engine
cd C:\src\ardia-engine
fetch --no-history chromium
cd src
git checkout tags/157.0.8103.50 -b ardia-157
```

Apply patches from the Ardia repository:

```powershell
git apply C:\path\to\ardia\engine\patches\windows\*.patch
```

Symlink or copy ArdiaCore sources:

```powershell
New-Item -ItemType SymbolicLink -Path src\chrome\browser\ardia -Target C:\path\to\ardia\engine\chromium\src\chrome\browser\ardia
New-Item -ItemType SymbolicLink -Path src\ardia\core -Target C:\path\to\ardia\engine\ardiacore\src\ardia\core
```

## GN Compilation Configuration

Create the output directory and configure `args.gn`:

```powershell
gn gen out\Release
```

Populate `out\Release\args.gn`:

```gn
target_os = "win"
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
dcheck_always_on = false
chrome_pgo_phase = 0
```

## Compiling Engine Targets

```powershell
autoninja -C out\Release chrome ardia_core
```

## Building Native Win32 Host

```powershell
cd apps\browser\windows
cmake -B build -S . -G "Visual Studio 17 2022" -A x64
cmake --build build --config Release
```

## Packaging Application Bundle

Run the PowerShell packaging pipeline:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\build-windows.ps1
```

The output installer is generated at:

```
dist\windows\Ardia-Setup-x64.exe
```


param(
    [string]$Version = "0.2.46",
    [switch]$Release = $true,
    [switch]$Package = $true
)

$ErrorActionPreference = "Continue"

Write-Host "Building Ardia for Windows (Version: $Version)"

if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    Write-Host "Installing dependencies with pnpm..."
    pnpm install --no-frozen-lockfile
} else {
    Write-Warning "pnpm not found in PATH; skipping pnpm install."
}

$BuildDir = "apps/browser/windows/build"
if (Get-Command cmake -ErrorAction SilentlyContinue) {
    Write-Host "Configuring CMake..."
    cmake -S apps/browser/windows -B $BuildDir
    $Config = if ($Release) { "Release" } else { "Debug" }
    Write-Host "Building native host ($Config)..."
    cmake --build $BuildDir --config $Config
    
    if (Test-Path "$BuildDir/$Config/Ardia.exe") {
        Write-Host "Native host compiled successfully: $BuildDir/$Config/Ardia.exe"
    } else {
        Write-Error "Build failed: $BuildDir/$Config/Ardia.exe not found."
        exit 1
    }
} else {
    Write-Error "CMake not found in PATH. Install CMake to compile the native host."
    exit 1
}

if ($Package) {
    $Config = if ($Release) { "Release" } else { "Debug" }
    Write-Host "Packaging Windows Installer..."
    & scripts/windows/build-nsis.ps1 -Version $Version -BuildDir "$BuildDir/$Config"
}

Write-Host "Build complete."

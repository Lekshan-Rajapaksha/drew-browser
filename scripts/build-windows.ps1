param(
    [string]$Version = "0.2.46",
    [switch]$Release = $true,
    [switch]$Package = $true
)

$ErrorActionPreference = "Stop"

Write-Host "Building Ardia for Windows (Version: $Version)"

if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    pnpm install
} else {
    Write-Warning "pnpm not found in PATH; skipping pnpm install."
}

if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    pnpm turbo run build --filter=@ardia/core --filter=@ardia/native-shell
}

$BuildDir = "apps/browser/windows/build"
if (Get-Command cmake -ErrorAction SilentlyContinue) {
    cmake -S apps/browser/windows -B $BuildDir
    $Config = if ($Release) { "Release" } else { "Debug" }
    cmake --build $BuildDir --config $Config
    Write-Host "Native host compiled successfully: $BuildDir/$Config/Ardia.exe"
} else {
    Write-Warning "CMake not found in PATH. Install CMake to compile the native host."
}

if ($Package) {
    if (Get-Command makensis -ErrorAction SilentlyContinue) {
        $Config = if ($Release) { "Release" } else { "Debug" }
        & scripts/windows/build-nsis.ps1 -Version $Version -BuildDir "apps/browser/windows/build/$Config"
    } else {
        Write-Warning "makensis not found in PATH. Skipping installer creation."
    }
}

Write-Host "Build complete."

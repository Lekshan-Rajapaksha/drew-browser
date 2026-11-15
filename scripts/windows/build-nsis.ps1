param(
    [string]$Version = "0.2.46",
    [string]$BuildDir = "apps/browser/windows/build/Release",
    [string]$OutFile = "dist/windows/Ardia-Setup.exe"
)

$ErrorActionPreference = "Stop"

$OutputDir = Split-Path -Parent $OutFile
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

$ResolvedBuildDir = (Resolve-Path $BuildDir).Path
$ResolvedOutFile = [System.IO.Path]::GetFullPath($OutFile)
$NsiScript = (Resolve-Path "scripts/windows/ardia-setup.nsi").Path

& makensis "/DPRODUCT_VERSION=$Version" "/DBUILD_DIR=$ResolvedBuildDir" "/DOUT_FILE=$ResolvedOutFile" $NsiScript


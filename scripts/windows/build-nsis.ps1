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

$Makensis = if (Get-Command makensis -ErrorAction SilentlyContinue) {
    "makensis"
} elseif (Test-Path "C:\Program Files (x86)\NSIS\makensis.exe") {
    "C:\Program Files (x86)\NSIS\makensis.exe"
} elseif (Test-Path "C:\Program Files\NSIS\makensis.exe") {
    "C:\Program Files\NSIS\makensis.exe"
} else {
    Write-Error "makensis executable not found!"
    exit 1
}

Write-Host "Running $Makensis to produce $ResolvedOutFile..."
& $Makensis "/DPRODUCT_VERSION=$Version" "/DBUILD_DIR=$ResolvedBuildDir" "/DOUT_FILE=$ResolvedOutFile" $NsiScript

# Ardia Distribution Pipeline

Ardia is packaged and distributed across macOS, Windows, and Linux.

## Platform Packaging Matrix

| Platform | Format | Signing | Auto-Update | Package Manager |
|---|---|---|---|---|
| **macOS** | DMG (`.dmg`) | Apple Notarization / Developer ID | Sparkle | Homebrew tap (`brew install ardia-browser/tap/ardia`) |
| **Windows** | Nullsoft Installer (`.exe`) | Authenticode EV Certificate | Squirrel / WinSparkle | Windows Package Manager (`winget install com.ardia.Ardia`) |
| **Linux** | AppImage (`.AppImage`), `.deb` | GPG Repository Sign | AppImageUpdate / APT | Flathub (`com.ardia.Ardia`) |

---

## Windows Pipeline
- **Build script**: `scripts/build-windows.ps1`
- **Installer definition**: `scripts/windows/ardia-setup.nsi`
- **Winget manifests**: `scripts/windows/winget/`
- **CI Workflow**: `.github/workflows/windows.yml`

## Linux Pipeline
- **Build script**: `scripts/build-linux.sh`
- **Desktop Entry**: `scripts/linux/ardia.desktop`
- **AppStream Metainfo**: `scripts/linux/ardia.appdata.xml`
- **Package scripts**: `scripts/linux/create-appimage.sh`, `scripts/linux/create-deb.sh`
- **CI Workflow**: `.github/workflows/linux.yml`


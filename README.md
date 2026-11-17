<p align="center">
  <img src="apps/desktop/assets/icon.png" width="320" alt="Drew browser logo">
</p>

<h1 align="center">Drew</h1>

<p align="center">
  A clean, sidebar-first browser for Windows.<br>
  Built by <a href="https://github.com/Lekshan-Rajapaksha">Lekshan Rajapaksha</a>.
</p>

<p align="center">
  <a href="https://github.com/Lekshan-Rajapaksha/72-browser/actions/workflows/windows.yml">
    <img src="https://github.com/Lekshan-Rajapaksha/72-browser/actions/workflows/windows.yml/badge.svg" alt="Windows build status">
  </a>
  <a href="https://github.com/Lekshan-Rajapaksha/72-browser/releases">
    <img src="https://img.shields.io/github/v/release/Lekshan-Rajapaksha/72-browser?display_name=tag&label=release" alt="Latest release">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/badge/license-GPL--3.0-blue" alt="GPL-3.0 license">
  </a>
</p>

## Download Drew for Windows

1. Open the [Windows builds page](https://github.com/Lekshan-Rajapaksha/72-browser/actions/workflows/windows.yml).
2. Select the newest successful build.
3. Download the **Drew-Windows** artifact.
4. Extract it and run **Drew Setup**.

Windows may show a SmartScreen warning because development builds are not code-signed yet.

## About Drew

Drew is a modern desktop browser with an edge-to-edge interface that keeps tabs, navigation and profiles in a focused sidebar. It is designed to feel lightweight, direct and comfortable on Windows.

### Highlights

- Edge-to-edge desktop interface without a second fake window.
- Sidebar navigation, pinned sites, tab groups and profile spaces.
- Familiar Windows keyboard shortcuts using Ctrl.
- Split views for working with multiple pages.
- Built-in history, bookmarks, downloads and settings.
- Dark, polished interface with the Drew visual identity.
- Windows installer, desktop shortcut and Start menu integration.

## Keyboard shortcuts

| Action | Shortcut |
| --- | --- |
| New tab | `Ctrl+T` |
| Focus address bar | `Ctrl+L` |
| Close tab | `Ctrl+W` |
| Reopen closed tab | `Ctrl+Shift+T` |
| Reload | `Ctrl+R` or `F5` |
| Find on page | `Ctrl+F` |
| Next tab | `Ctrl+Tab` |
| Previous tab | `Ctrl+Shift+Tab` |
| Select tab | `Ctrl+1` through `Ctrl+9` |
| Toggle sidebar | `Ctrl+S` |

## Build Drew

The Windows package is built automatically by GitHub Actions. To create it locally, install Node.js 24 and pnpm 11, then run:

```powershell
pnpm install --frozen-lockfile
pnpm -C packages/demo build
Remove-Item apps/desktop/web -Recurse -Force -ErrorAction SilentlyContinue
Copy-Item packages/demo/dist apps/desktop/web -Recurse
npm --prefix apps/desktop ci
npm --prefix apps/desktop run dist:win
```

The installer is created in `apps/desktop/dist` as `Drew Setup <version>.exe`.

## Project structure

```text
apps/desktop/       Drew's Electron desktop application and packaging
apps/browser/       Browser interface and state
packages/demo/      Desktop-compatible renderer
packages/core/      URL and omnibox logic
packages/import/    Browser data import support
packages/shell/     Native shell interfaces
```

## Author

**Drew is developed and maintained by [Lekshan Rajapaksha](https://github.com/Lekshan-Rajapaksha).**

The Drew name, logo, Windows packaging and desktop adaptation are part of this project. Drew builds on open-source browser work from Ardia, Electron and Chromium. Their respective copyright notices and licenses remain included in this repository.

## License

The distributed browser is licensed under the [GNU General Public License v3](LICENSE). Source files originally provided under the [Apache License 2.0](LICENSE.Apache-2.0) retain that license. Third-party components keep their own licenses; see [NOTICE](NOTICE).

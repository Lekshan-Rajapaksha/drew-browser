# WebGPU (WGSL) Shaders for Windows and Linux

These shaders are cross-platform WGSL ports of the macOS Metal shaders:
- `oklab.wgsl`: OKLab color conversion and interpolation
- `noise.wgsl`: Simplex noise and Dave Hoskins' hash functions with triangular dither
- `window-backdrop.wgsl`: Window background procedural gradient
- `area-light.wgsl`: New Tab area light simulation

Rendered via Chromium's Dawn WebGPU backend (Direct3D 12 on Windows, Vulkan on Linux).


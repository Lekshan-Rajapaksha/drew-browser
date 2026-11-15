#ifndef UNICODE
#define UNICODE
#endif
#ifndef _UNICODE
#define _UNICODE
#endif

#include <windows.h>
#include <dwmapi.h>
#include <string>

#pragma comment(lib, "dwmapi.lib")
#pragma comment(lib, "user32.lib")
#pragma comment(lib, "gdi32.lib")

#ifndef DWMWA_USE_IMMERSIVE_DARK_MODE
#define DWMWA_USE_IMMERSIVE_DARK_MODE 20
#endif
#ifndef DWMWA_SYSTEMBACKDROP_TYPE
#define DWMWA_SYSTEMBACKDROP_TYPE 38
#endif

class ArdiaWindowHostWin {
 public:
  ArdiaWindowHostWin() : hwnd_(nullptr) {}
  ~ArdiaWindowHostWin() = default;

  bool Initialize(HINSTANCE instance, int show_cmd) {
    const wchar_t CLASS_NAME[] = L"ArdiaWindowClass";

    WNDCLASSEXW wc = {};
    wc.cbSize = sizeof(WNDCLASSEXW);
    wc.lpfnWndProc = WindowProc;
    wc.hInstance = instance;
    wc.lpszClassName = CLASS_NAME;
    wc.hCursor = LoadCursor(nullptr, IDC_ARROW);
    wc.hbrBackground = CreateSolidColorBrush(RGB(24, 24, 27));

    if (!RegisterClassExW(&wc)) {
      return false;
    }

    hwnd_ = CreateWindowExW(
        WS_EX_APPWINDOW,
        CLASS_NAME,
        L"Ardia",
        WS_OVERLAPPEDWINDOW | WS_CLIPCHILDREN | WS_CLIPSIBLINGS,
        CW_USEDEFAULT, CW_USEDEFAULT, 1280, 800,
        nullptr,
        nullptr,
        instance,
        this
    );

    if (!hwnd_) {
      return false;
    }

    // Enable Windows 10/11 Dark Mode for title bar
    BOOL dark_mode = TRUE;
    DwmSetWindowAttribute(hwnd_, DWMWA_USE_IMMERSIVE_DARK_MODE, &dark_mode, sizeof(dark_mode));

    // Enable Mica backdrop effect on Windows 11
    int backdrop_type = 2; // DWMSBT_MAINWINDOW (Mica)
    DwmSetWindowAttribute(hwnd_, DWMWA_SYSTEMBACKDROP_TYPE, &backdrop_type, sizeof(backdrop_type));

    ShowWindow(hwnd_, show_cmd);
    UpdateWindow(hwnd_);
    return true;
  }

  void RunMessageLoop() {
    MSG msg;
    while (GetMessageW(&msg, nullptr, 0, 0)) {
      TranslateMessage(&msg);
      DispatchMessageW(&msg);
    }
  }

  HWND hwnd() const { return hwnd_; }

 private:
  static LRESULT CALLBACK WindowProc(HWND hwnd, UINT uMsg, WPARAM wParam, LPARAM lParam) {
    switch (uMsg) {
      case WM_PAINT: {
        PAINTSTRUCT ps;
        HDC hdc = BeginPaint(hwnd, &ps);
        HBRUSH brush = CreateSolidColorBrush(RGB(24, 24, 27));
        FillRect(hdc, &ps.rcPaint, brush);
        DeleteObject(brush);
        EndPaint(hwnd, &ps);
        return 0;
      }
      case WM_SIZE: {
        return 0;
      }
      case WM_DESTROY: {
        PostQuitMessage(0);
        return 0;
      }
      default:
        return DefWindowProcW(hwnd, uMsg, wParam, lParam);
    }
  }

  HWND hwnd_;
};

int WINAPI wWinMain(HINSTANCE instance, HINSTANCE prev_instance, wchar_t* cmd_line, int show_cmd) {
  ArdiaWindowHostWin host;
  if (!host.Initialize(instance, show_cmd)) {
    return 1;
  }
  host.RunMessageLoop();
  return 0;
}

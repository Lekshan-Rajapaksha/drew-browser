#ifndef ARDIA_CORE_PLATFORM_WINDOWS_AC_WINDOW_HOST_WIN_H_
#define ARDIA_CORE_PLATFORM_WINDOWS_AC_WINDOW_HOST_WIN_H_

#include <string>

namespace ardia {

class ArdiaWindowHostWin {
 public:
  ArdiaWindowHostWin();
  virtual ~ArdiaWindowHostWin();

  virtual void OpenWindow(const std::string& window_id);
  virtual void CloseWindow(const std::string& window_id);
  virtual void SetTitle(const std::string& window_id, const std::string& title);
};

}  // namespace ardia

#endif  // ARDIA_CORE_PLATFORM_WINDOWS_AC_WINDOW_HOST_WIN_H_


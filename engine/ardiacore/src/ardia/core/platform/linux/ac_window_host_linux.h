#ifndef ARDIA_CORE_PLATFORM_LINUX_AC_WINDOW_HOST_LINUX_H_
#define ARDIA_CORE_PLATFORM_LINUX_AC_WINDOW_HOST_LINUX_H_

#include <string>

namespace ardia {

class ArdiaWindowHostLinux {
 public:
  ArdiaWindowHostLinux();
  virtual ~ArdiaWindowHostLinux();

  virtual void OpenWindow(const std::string& window_id);
  virtual void CloseWindow(const std::string& window_id);
  virtual void SetTitle(const std::string& window_id, const std::string& title);
};

}  // namespace ardia

#endif  // ARDIA_CORE_PLATFORM_LINUX_AC_WINDOW_HOST_LINUX_H_


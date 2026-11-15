#ifndef ARDIA_CORE_PLATFORM_WINDOWS_AC_KEYCHAIN_WIN_H_
#define ARDIA_CORE_PLATFORM_WINDOWS_AC_KEYCHAIN_WIN_H_

#include <string>

namespace ardia {

bool ac_keychain_get(const char* account, std::string* out_secret);
bool ac_keychain_set(const char* account, const char* secret);
bool ac_keychain_delete(const char* account);

}  // namespace ardia

#endif  // ARDIA_CORE_PLATFORM_WINDOWS_AC_KEYCHAIN_WIN_H_


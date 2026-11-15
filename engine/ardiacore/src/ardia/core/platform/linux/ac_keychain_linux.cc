#include "ardia/core/platform/linux/ac_keychain_linux.h"

namespace ardia {

bool ac_keychain_get(const char* account, std::string* out_secret) {
  if (!account || !out_secret) return false;
  return false;
}

bool ac_keychain_set(const char* account, const char* secret) {
  if (!account || !secret) return false;
  return false;
}

bool ac_keychain_delete(const char* account) {
  if (!account) return false;
  return false;
}

}  // namespace ardia


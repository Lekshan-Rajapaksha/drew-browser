#include "ardia/core/platform/windows/ac_keychain_win.h"

#ifdef _WIN32
#include <windows.h>
#include <wincred.h>
#endif

namespace ardia {

bool ac_keychain_get(const char* account, std::string* out_secret) {
#ifdef _WIN32
  if (!account || !out_secret) return false;
  PCREDENTIALW pcred = nullptr;
  std::wstring target = L"Ardia_" + std::wstring(account, account + strlen(account));
  if (!CredReadW(target.c_str(), CRED_TYPE_GENERIC, 0, &pcred) || !pcred) {
    return false;
  }
  out_secret->assign(reinterpret_cast<char*>(pcred->CredentialBlob), pcred->CredentialBlobSize);
  CredFree(pcred);
  return true;
#else
  return false;
#endif
}

bool ac_keychain_set(const char* account, const char* secret) {
#ifdef _WIN32
  if (!account || !secret) return false;
  std::wstring target = L"Ardia_" + std::wstring(account, account + strlen(account));
  CREDENTIALW cred = {};
  cred.Type = CRED_TYPE_GENERIC;
  cred.TargetName = const_cast<LPWSTR>(target.c_str());
  cred.CredentialBlobSize = static_cast<DWORD>(strlen(secret));
  cred.CredentialBlob = reinterpret_cast<LPBYTE>(const_cast<char*>(secret));
  cred.Persist = CRED_PERSIST_LOCAL_MACHINE;
  return CredWriteW(&cred, 0) == TRUE;
#else
  return false;
#endif
}

bool ac_keychain_delete(const char* account) {
#ifdef _WIN32
  if (!account) return false;
  std::wstring target = L"Ardia_" + std::wstring(account, account + strlen(account));
  return CredDeleteW(target.c_str(), CRED_TYPE_GENERIC, 0) == TRUE;
#else
  return false;
#endif
}

}  // namespace ardia


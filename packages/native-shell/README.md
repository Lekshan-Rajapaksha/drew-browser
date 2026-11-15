# @ardia/native-shell

Platform-switched native shell abstraction for Ardia Browser.

Provides a unified interface across macOS, Windows, and Linux for:
- Window Management (`WindowManager`)
- Native Menus (`MenuManager`)
- OS Credential Storage (`CredentialStore` -> Keychain / DPAPI / libsecret)
- Application Updates (`Updater`)
- Badging (`AppBadge`)


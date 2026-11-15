!include "MUI2.nsh"
!include "FileFunc.nsh"

!ifndef PRODUCT_VERSION
  !define PRODUCT_VERSION "0.2.46"
!endif

!ifndef BUILD_DIR
  !define BUILD_DIR "..\..\apps\browser\windows\build\Release"
!endif

!ifndef OUT_FILE
  !define OUT_FILE "..\..\dist\windows\Ardia-Setup.exe"
!endif

!define PRODUCT_NAME "Ardia"
!define PRODUCT_PUBLISHER "Ardia Browser Authors"
!define PRODUCT_WEB_SITE "https://ardia.dev"
!define PRODUCT_EXE "Ardia.exe"
!define UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\Ardia"
!define REG_APP_PATH "Software\Microsoft\Windows\CurrentVersion\App Paths\Ardia.exe"

Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "${OUT_FILE}"
InstallDir "$LOCALAPPDATA\Programs\Ardia"
InstallDirRegKey HKCU "${UNINST_KEY}" "InstallLocation"
RequestExecutionLevel user

!define MUI_ABORTWARNING
!define MUI_FINISHPAGE_RUN "$INSTDIR\${PRODUCT_EXE}"
!define MUI_FINISHPAGE_RUN_TEXT "Launch ${PRODUCT_NAME}"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  File /r "${BUILD_DIR}\*.*"

  WriteUninstaller "$INSTDIR\Uninstall.exe"

  CreateDirectory "$SMPROGRAMS\Ardia"
  CreateShortCut "$SMPROGRAMS\Ardia\Ardia.lnk" "$INSTDIR\${PRODUCT_EXE}"
  CreateShortCut "$SMPROGRAMS\Ardia\Uninstall Ardia.lnk" "$INSTDIR\Uninstall.exe"
  CreateShortCut "$DESKTOP\Ardia.lnk" "$INSTDIR\${PRODUCT_EXE}"

  WriteRegStr HKCU "${REG_APP_PATH}" "" "$INSTDIR\${PRODUCT_EXE}"
  WriteRegStr HKCU "${REG_APP_PATH}" "Path" "$INSTDIR"

  WriteRegStr HKCU "${UNINST_KEY}" "DisplayName" "${PRODUCT_NAME}"
  WriteRegStr HKCU "${UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr HKCU "${UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
  WriteRegStr HKCU "${UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegStr HKCU "${UNINST_KEY}" "DisplayIcon" "$INSTDIR\${PRODUCT_EXE},0"
  WriteRegStr HKCU "${UNINST_KEY}" "UninstallString" "$INSTDIR\Uninstall.exe"
  WriteRegStr HKCU "${UNINST_KEY}" "QuietUninstallString" "$INSTDIR\Uninstall.exe /S"
  WriteRegStr HKCU "${UNINST_KEY}" "InstallLocation" "$INSTDIR"
  WriteRegDWORD HKCU "${UNINST_KEY}" "NoModify" 1
  WriteRegDWORD HKCU "${UNINST_KEY}" "NoRepair" 1

  WriteRegStr HKCU "Software\Classes\ardia" "" "URL:Ardia Protocol"
  WriteRegStr HKCU "Software\Classes\ardia" "URL Protocol" ""
  WriteRegStr HKCU "Software\Classes\ardia\DefaultIcon" "" "$INSTDIR\${PRODUCT_EXE},0"
  WriteRegStr HKCU "Software\Classes\ardia\shell\open\command" "" '"$INSTDIR\${PRODUCT_EXE}" "%1"'
SectionEnd

Section "Uninstall"
  Delete "$DESKTOP\Ardia.lnk"
  Delete "$SMPROGRAMS\Ardia\Ardia.lnk"
  Delete "$SMPROGRAMS\Ardia\Uninstall Ardia.lnk"
  RMDir "$SMPROGRAMS\Ardia"

  Delete "$INSTDIR\Uninstall.exe"
  RMDir /r "$INSTDIR"

  DeleteRegKey HKCU "${UNINST_KEY}"
  DeleteRegKey HKCU "${REG_APP_PATH}"
  DeleteRegKey HKCU "Software\Classes\ardia"
SectionEnd

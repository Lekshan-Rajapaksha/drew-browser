[Setup]
AppName=Ardia
AppVersion=0.2.46
AppPublisher=Ardia Browser Authors
AppPublisherURL=https://ardia.dev
AppSupportURL=https://ardia.dev
AppUpdatesURL=https://ardia.dev
DefaultDirName={localappdata}\Programs\Ardia
DefaultGroupName=Ardia
OutputDir=..\..\dist\windows
OutputBaseFilename=Ardia-Setup-Inno
Compression=lzma2/ultra64
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64
PrivilegesRequired=lowest
DisableProgramGroupPage=yes
UninstallDisplayIcon={app}\Ardia.exe

[Files]
Source: "..\..\apps\browser\windows\build\Release\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[Icons]
Name: "{group}\Ardia"; Filename: "{app}\Ardia.exe"
Name: "{group}\Uninstall Ardia"; Filename: "{uninstallexe}"
Name: "{autodesktop}\Ardia"; Filename: "{app}\Ardia.exe"

[Registry]
Root: HKCU; Subkey: "Software\Classes\ardia"; ValueType: string; ValueName: ""; ValueData: "URL:Ardia Protocol"; Flags: uninsdeletekey
Root: HKCU; Subkey: "Software\Classes\ardia"; ValueType: string; ValueName: "URL Protocol"; ValueData: ""
Root: HKCU; Subkey: "Software\Classes\ardia\DefaultIcon"; ValueType: string; ValueName: ""; ValueData: "{app}\Ardia.exe,0"
Root: HKCU; Subkey: "Software\Classes\ardia\shell\open\command"; ValueType: string; ValueName: ""; ValueData: """{app}\Ardia.exe"" ""%1"""

[Run]
Filename: "{app}\Ardia.exe"; Description: "{cm:LaunchProgram,Ardia}"; Flags: nowait postinstall skipifsilent


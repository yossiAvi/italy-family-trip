@echo off
chcp 65001 > nul
echo Installing project dependencies...
call npm install
if errorlevel 1 (
  echo Installation failed. Make sure Node.js is installed and internet is available.
  pause
  exit /b 1
)
echo Starting Italy Family Trip...
call npm run dev
pause

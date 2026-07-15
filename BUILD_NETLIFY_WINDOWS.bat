@echo off
chcp 65001 > nul
echo Building Italy Family Trip for Netlify...
call npm install
if errorlevel 1 goto error
call npm run build
if errorlevel 1 goto error
echo.
echo Build completed successfully.
echo Upload the DIST folder to Netlify Deploy manually.
explorer dist
pause
exit /b 0
:error
echo Build failed. Make sure Node.js 20 is installed and internet is available.
pause
exit /b 1

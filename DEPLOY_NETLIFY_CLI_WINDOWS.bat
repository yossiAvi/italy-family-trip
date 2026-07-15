@echo off
chcp 65001 > nul
echo Building and deploying Italy Family Trip to Netlify...
call npm install
if errorlevel 1 goto error
call npm run build
if errorlevel 1 goto error
call npx netlify-cli deploy --prod --dir=dist
if errorlevel 1 goto error
echo Deployment completed.
pause
exit /b 0
:error
echo Deployment stopped or failed. Check the message above.
pause
exit /b 1

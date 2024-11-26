@echo off
setlocal EnableDelayedExpansion

REM Current directory
set BASE_DIR=%cd%

REM Kill any existing processes on ports 3000 and 5000
for /f "tokens=5" %%a in ('netstat -aon ^| find "3000" ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| find "5000" ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

REM Running frontend script
cd %BASE_DIR%\frontend
start /b cmd /c "npm run dev"

cd %BASE_DIR%

REM Starting app.py with venv
call %BASE_DIR%\venv\Scripts\activate
start /b cmd /c "python %BASE_DIR%\backend\app.py --batch"

REM Create cleanup script
echo @echo off > cleanup.bat
echo echo Cleaning up processes... >> cleanup.bat
echo for /f "tokens=5" %%%%a in ('netstat -aon ^| find "3000" ^| find "LISTENING"') do taskkill /F /PID %%%%a >> cleanup.bat
echo for /f "tokens=5" %%%%a in ('netstat -aon ^| find "5000" ^| find "LISTENING"') do taskkill /F /PID %%%%a >> cleanup.bat
echo del cleanup.bat >> cleanup.bat

echo Both React and backend apps are running. Press CTRL+C to stop.
echo.

REM Wait for Ctrl+C
:WAIT_FOR_EXIT
timeout /t 2 > nul
if errorlevel 1 (
    call cleanup.bat
    exit
)
goto WAIT_FOR_EXIT

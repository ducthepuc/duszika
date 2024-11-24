@echo off
REM Current directory
set BASE_DIR=%cd%

REM Running frontend script
cd %BASE_DIR%\frontend
start /b cmd /c "npm run dev"

cd %BASE_DIR%

REM Starting app.py with venv
call %BASE_DIR%\venv\Scripts\activate
python %BASE_DIR%\backend\app.py --batch

REM Starting console
echo Both React and backend apps are running in the same console. Press CTRL+C to stop.
pause

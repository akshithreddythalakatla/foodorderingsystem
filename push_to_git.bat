@echo off
title Push Food Ordering System to GitHub
color 0A
echo ===============================================================================
echo            PUSHING FOOD ORDERING SYSTEM TO YOUR GITHUB
echo            Target: https://github.com/akshithreddythalakatla/foodorderingsystem
echo ===============================================================================
echo.

cd /d "%~dp0"

echo Running git push -u origin main --force...
echo (If a browser window appears, click 'Authorize' to sign into your account)
echo.

git push -u origin main --force

echo.
echo ===============================================================================
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Code pushed successfully to your repository!
    echo Check it here: https://github.com/akshithreddythalakatla/foodorderingsystem
) else (
    echo [INFO] If permission was denied, ensure you are signed in as akshithreddythalakatla.
)
echo ===============================================================================
echo.
pause

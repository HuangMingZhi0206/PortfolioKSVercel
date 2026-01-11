@echo off
setlocal

set "ROOT=c:\Users\ASUS\Documents\Kode Program\Web_KS\portfolio"
set "BACKEND=%ROOT%\server"

rem Start backend (nodemon) and keep window open
start "portfolio-backend" cmd /k "cd /d %BACKEND% && npm run dev"

rem Start frontend (Vite) and keep window open
start "portfolio-frontend" cmd /k "cd /d %ROOT% && npm run dev"

endlocal

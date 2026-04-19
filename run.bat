@echo off
echo Starting the Backend Server...
cd backend
start cmd /k "npm run start"
echo Starting the Frontend Server...
cd ..
cd frontend
start cmd /k "npm run dev"

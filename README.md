# Introduction
This demo shows how to use Azure Blob container (same as S3) securely with Backend and Frontend application.
+ Upload file
+ Show list of files, click to view detail

# Backend
## Prepare .env content
Make sure to have the storage account, blob container and key ready in .env file
### `cp .env.template .env`

## Init
### `cd backend/`
### `python -m venv venv`
### `source venv/bin/activate` # On Windows use `venv\Scripts\activate` 

## Install packages
### `pip install flask azure-storage-blob load_dotenv flask-cors`

## Run the backend APIs
### `python app.py`

# Frontend
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Start
### `cd frontend/`
### `npm install`
### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.
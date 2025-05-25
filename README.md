BookStore Application
Welcome to the BookStore application! This project is a full-stack web application where users can browse books, view book details, add reviews, and admins can manage books through a dashboard. The frontend is built with React and Redux, styled with Tailwind CSS, and deployed on Vercel. The backend is built with Node.js, Express, and MongoDB, and deployed on Render.
This README provides step-by-step instructions to set up and run the application locally on your machine.
Table of Contents

Prerequisites
Project Structure
Backend Setup
Frontend Setup
Running the Application
Keeping the Backend Active Locally
Testing
Troubleshooting
Contributing
License

Prerequisites
Before setting up the application, ensure you have the following installed on your machine:

Node.js (v16.x or later): Download and install Node.js
npm (comes with Node.js) or yarn (optional): For package management
MongoDB: Either a local MongoDB instance or a cloud MongoDB instance (e.g., MongoDB Atlas)
Local MongoDB: Install MongoDB Community Edition
MongoDB Atlas: Create a free cluster on MongoDB Atlas


Git: To clone the repository Install Git
A code editor like Visual Studio Code (recommended)

You'll also need accounts for deployment (optional for local setup):

Vercel Account: For frontend deployment
Render Account: For backend deployment

Project Structure
The project is divided into two main directories:
BookStore/
│
├── backend/                # Backend code (Node.js, Express, MongoDB)
│   ├── models/             # MongoDB models (e.g., Book model)
│   ├── routes/             # API routes
│   ├── controllers/        # Route handlers
│   ├── utils/              # Utility functions (e.g., Cloudinary upload)
│   ├── server.js           # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env                # Environment variables (not committed)
│
├── frontend/               # Frontend code (React, Redux, Tailwind CSS)
│   ├── src/                # Source code
│   │   ├── pages/          # React pages (e.g., BookDetail, AdminDashboard)
│   │   ├── components/     # Reusable components (e.g., SidebarHeader)
│   │   ├── redux/          # Redux slices and store
│   │   └── App.jsx         # Main app component
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   └── .env                # Environment variables (not committed)
│
└── README.md               # This file

Backend Setup
The backend is a Node.js application using Express and MongoDB. Follow these steps to set it up locally:
1. Clone the Repository
Clone the repository to your local machine:
git clone https://github.com/your-username/bookstore.git
cd bookstore/backend

2. Install Dependencies
Install the required dependencies:
npm install

3. Set Up Environment Variables
Create a .env file in the backend/ directory and add the following variables:
# MongoDB connection string (use MongoDB Atlas URI or local URI)
MONGO_URI=mongodb://localhost:27017/bookstore

# Port for the backend server
PORT=5000

# Cloudinary credentials (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret


MONGO_URI: If using MongoDB Atlas, replace with your Atlas connection string (e.g., mongodb+srv://<username>:<password>@cluster0.mongodb.net/bookstore?retryWrites=true&w=majority). If using a local MongoDB instance, ensure MongoDB is running locally (mongod).
Cloudinary: Sign up for a free Cloudinary account at Cloudinary and get your credentials from the dashboard.

4. Start MongoDB (If Using Local Instance)
If you're using a local MongoDB instance, ensure MongoDB is running:
mongod

5. Test the Backend
Run the backend server:
npm start


The server should start on http://localhost:5000.
Visit http://localhost:5000/health in your browser or Postman. You should see:{
  "status": "OK",
  "message": "Server is awake and database is connected",
  "dbStatus": { "ok": 1 }
}



Frontend Setup
The frontend is a React application using Redux for state management and Tailwind CSS for styling. Follow these steps to set it up locally:
1. Navigate to the Frontend Directory
From the project root:
cd frontend

2. Install Dependencies
Install the required dependencies:
npm install

3. Set Up Environment Variables
Create a .env file in the frontend/ directory and add the following variable:
# Backend API URL
REACT_APP_API_URL=http://localhost:5000


REACT_APP_API_URL: This should point to your local backend server. Once deployed, update this to your Render backend URL (e.g., https://your-backend-service.onrender.com).

4. Configure Tailwind CSS (If Not Already Set Up)
Ensure Tailwind CSS is configured in your frontend. If not already set up, create a tailwind.config.js file:
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

And ensure your index.css includes:
@tailwind base;
@tailwind components;
@tailwind utilities;

Install Tailwind CSS dependencies if not already installed:
npm install -D tailwindcss
npx tailwindcss init

Running the Application
1. Start the Backend
In the backend/ directory, run:
npm start

The backend should be running on http://localhost:5000.
2. Start the Frontend
In the frontend/ directory, run:
npm start

The frontend should start on http://localhost:3000 and open in your default browser.
3. Access the Application

Visit http://localhost:3000/book/:bookId to view a book's details (replace :bookId with a valid book ID from your database).
Visit http://localhost:3000/admin-dashboard to access the admin dashboard and navigate to the book creation page.

Keeping the Backend Active Locally
When deployed on Render's free tier, the backend server goes to sleep after 15 minutes of inactivity, causing delays due to server restarts and database reconnections. Locally, you can simulate this behavior and keep the server active for testing purposes by periodically pinging the /health endpoint.
Option 1: Manual Pinging (For Testing)
Use a tool like Postman or curl to ping the /health endpoint every 10 minutes:
curl http://localhost:5000/health

Option 2: Automate Pinging with a Script
Create a simple Node.js script to ping the backend every 10 minutes. In the backend/ directory, create a file named keep-alive.js:
const fetch = require('node-fetch');

async function pingBackend() {
  try {
    const response = await fetch('http://localhost:5000/health');
    const data = await response.json();
    console.log('Pinged backend:', data);
  } catch (error) {
    console.error('Error pinging backend:', error);
  }
}

// Ping immediately
pingBackend();

// Ping every 10 minutes (600,000 ms)
setInterval(pingBackend, 600000);

Install the node-fetch dependency:
npm install node-fetch

Run the script:
node keep-alive.js

This script will keep your local backend active by hitting the /health endpoint every 10 minutes, simulating the behavior of Vercel Cron Jobs in production.
Testing

Backend Testing:

Ensure the backend is running on http://localhost:5000.
Test the /health endpoint to confirm the server and database are active.
Use Postman to test other endpoints (e.g., GET /book/books, POST /book/books/:bookId/reviews).


Frontend Testing:

Navigate to http://localhost:3000/book/:bookId and verify book details and reviews load correctly.
Add a review and ensure it appears instantly.
Visit http://localhost:3000/admin-dashboard and click the "Create New Book" button to navigate to the book creation page.


Database Connection:

Check the backend logs to confirm the MongoDB connection is active.
Ensure the /health endpoint returns a successful database ping.



Troubleshooting

MongoDB Connection Fails:

Verify your MONGO_URI in the backend .env file.
Ensure MongoDB is running locally (mongod) or your Atlas cluster is accessible.
Check for network issues if using MongoDB Atlas.


Frontend Can't Connect to Backend:

Ensure the backend is running on http://localhost:5000.
Verify REACT_APP_API_URL in the frontend .env file points to http://localhost:5000.
Check for CORS issues; the backend includes CORS middleware to allow requests from http://localhost:3000.


Tailwind CSS Not Working:

Ensure Tailwind CSS is installed and configured (tailwind.config.js and index.css).
Run npm install -D tailwindcss if missing.



Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make your changes and commit (git commit -m "Add your feature").
Push to your branch (git push origin feature/your-feature).
Open a pull request.

License
This project is licensed under the MIT License. See the LICENSE file for details.

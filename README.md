# Project Overview

The SkillBridge app is a Learning Management System (LMS) designed to empower users with the latest tech skills. With a user-friendly interface and engaging content, SkillBridge aims to foster a dynamic learning environment that prepares individuals for the demands of the modern workforce.

## Table of Contents

- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Features](#features)

## Technologies Used

This project is built using the following technologies:

- **Vite**: A fast front-end build tool.
- **Express**: A minimal and flexible Node.js web application framework.
- **MongoDB**: A NoSQL database for storing data.
- **Multer**: A middleware for handling `multipart/form-data`, used for uploading files.
- **PayPal**: A payment processing service for handling transactions for international purchases.
- **Paystack**: A payment processing service for handling transactions for local purchases in naira.
- **ExchangeRate-API**: For currency conversion to the local currency.
- **Cloudinary**: A cloud service for managing images and videos.
- **Context API**: For state management in React.
- **Tailwind CSS**: A utility-first CSS framework for styling.
- **ShadCN**: A component library for building UIs.
- **Lucide**: A collection of SVG icons for your project.

## Installation

To get started with this project, clone the repository and install the necessary dependencies.

```bash
# Clone the repository
git clone https://github.com/Mikael-duru/skillbridge.git

# Navigate into the project directory
cd skillbridge

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

Make sure to create a `.env` file in the `server` directory with the following variables:

```
# Server
  CLIENT_URL=
  PORT=
  MONGODB_URI=
  CLOUDINARY_CLOUD_NAME=
  CLOUDINARY_API_KEY=
  CLOUDINARY_API_SECRET=
  PAYPAL_CLIENT_ID=
  PAYPAL_CLIENT_SECRET_KEY=

# Client
  VITE_BACKEND_URL=
```

## Usage

To run the project in development mode, follow these steps:

### Start the Server

```bash
cd server
npm start
```

### Start the Client

```bash
cd client
npm run dev
```

Visit `http://localhost:<your_port>` in your browser to view the application.

## Features

- User authentication and authorization
- File uploads with Multer
- Payment processing with PayPal
- Image and video management with Cloudinary
- Responsive design using Tailwind CSS
- State management using Context API

# 🎓 AI Workshop Portal

A full-stack web application built with **React (frontend)**, **Node.js + Express (backend)**, and **MongoDB (database)**.  
This project is designed to manage workshops and student registrations, with separate dashboards for **students** and **admins**.

---

## 🚀 Features

- 🔐 **Authentication**
  - Student registration & login
  - Admin login with unique credentials
- 📝 **Workshops**
  - Admin can **create** and **delete** workshops
  - Students can **view** and **register** for workshops
- 📊 **Dashboards**
  - Admin dashboard → see all registered students & workshop registrations
  - Student dashboard → view personal details & registered workshops
- 💾 **MongoDB Atlas** integration for storing all data
- 🎨 Responsive **UI with TailwindCSS**

---

## 🗂️ Pages Overview

### 🔹 Home Page
- Introduction about the site  
- "About Us" section with details about the makers of the site  
- Contact card and footer with quick links  

### 🔹 Register Page
- Allows students to create an account with **name, email, and password**  
- Data stored securely in MongoDB  

### 🔹 Login Page
- Students → login using their registered credentials  
- Admin → login using predefined credentials (`admin@workshop.com / admin123`)  

### 🔹 Student Dashboard
- Displays **student’s username** in real-time  
- Shows personal details  
- Lists workshops available to register  
- Displays registered workshops  

### 🔹 Admin Dashboard
- Displays all registered students  
- Manage workshops (create & delete)  
- Track registrations for each workshop  

### 🔹 Contact Page (optional section in home)
- Contact card with team members’ info  
- Links to GitHub / social profiles  

---

## 🛠️ Tech Stack

**Frontend**
- React + Vite
- React Router DOM
- TailwindCSS

**Backend**
- Node.js
- Express.js
- Mongoose (MongoDB ODM)

**Database**
- MongoDB Atlas (Cloud)

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash

git clone https://github.com/sakethdamerla/WorkshopWebsite.git
cd WorkshopWebsite
```
## 2. Install dependencies
```bash
npm install
```
## 3. Run the development server
```bash
npm run dev
```
## 4. Open the site

Open your browser and go to:
```bash
http://localhost:5173
```
---

# Workshop Website

This project contains both frontend and backend code for a workshop management website. Follow the steps below to set up and run both parts of the application.

---

## Backend Setup

1. **Navigate to the backend folder:**
	 ```powershell
	 cd backend
	 ```
2. **Install dependencies:**
	 ```powershell
	 npm install
	 ```
3. **Start the backend server:**
	 ```powershell
	 npm start
	 ```
	 - The backend server will start on the configured port (check `server.js`).

---

## Frontend Setup

1. **Navigate to the frontend folder:**
	 ```powershell
	 cd frontend
	 ```
2. **Install dependencies:**
	 ```powershell
	 npm install
	 ```

3. **Start the frontend development server:**
	 ```powershell
	 npm run dev
	 ```
	 - The frontend will be available at [http://localhost:5173](http://localhost:5173) by default.

---


## Additional Notes

- For any issues, check the official documentation:
	- [Tailwind CSS + Vite](https://tailwindcss.com/docs/installation/using-vite)
	- [Vite](https://vitejs.dev/)
	- [React](https://react.dev/)



## Contributing

Feel free to fork the repository and make improvements. Pull requests are welcome!

## License

This project is open-source and free to use.


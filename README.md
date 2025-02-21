![home](https://github.com/user-attachments/assets/1d2387ef-d749-41d3-90f4-967f995e4fff)
Home page
![profilee](https://github.com/user-attachments/assets/bc63f73a-e975-435f-8ef8-3d869ab23a4b)
Profile page
![addposts](https://github.com/user-attachments/assets/a585157c-82e3-49a5-8384-7d642924d460)
Add Posts page
![editprofile](https://github.com/user-attachments/assets/1718ebbf-adc3-4fe7-953c-6ae8bdf5bd84)
Edit profile page
and alot more ... 
# MERN Social Media App

A full-stack social media application built using the **MERN (MongoDB, Express, React, Node.js) stack**, featuring **JWT authentication, Redux state management, Tailwind CSS for styling, and real-time chat functionality.**

## 🚀 Features
- User Authentication (JWT-based)
- Post Creation, Like, and Comment system
- Profile Page (Edit Profile, Follow/Unfollow users)
- Redux for global state management
- Real-time chat system
- Responsive UI with Tailwind CSS
- Backend with Node.js and Express
- MongoDB as the database
- Protected Routes with JWT

## 🛠 Tech Stack
### Frontend:
- React.js
- Redux Toolkit
- React Router
- Tailwind CSS

### Backend:
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing

---

---
## 🖥️ Installation & Setup
### Clone the Repository
```sh
git clone https://github.com/your-username/mern-social-media-app.git
cd mern-social-media-app
```

### Backend Setup
```sh
cd server
npm install
npm start
```
Create a **.env** file in the server directory and add:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=4000
```

### Frontend Setup
```sh
cd ../client
npm install
npm start
```

---
## 🔑 Authentication (JWT)
- Users sign up and log in using JWT-based authentication.
- Passwords are securely hashed using bcrypt.
- Protected routes are implemented using middleware.

---
## 🔄 Redux State Management
Redux is used to manage global states for authentication and posts.

---
## 📌 API Endpoints
### User Authentication
| Method | Endpoint           | Description          |
|--------|-------------------|----------------------|
| POST   | /api/auth/register | Register a new user |
| POST   | /api/auth/login    | Login user & get JWT |

### Posts
| Method | Endpoint          | Description        |
|--------|------------------|--------------------|
| GET    | /api/post        | Get all posts     |
| POST   | /api/post        | Create a new post |
| POST   | /api/post/like/:id | Like/Unlike a post |
| POST   | /api/post/comment/:id | Add a comment  |

---
## 🚀 Deployment
You can deploy the frontend on **Vercel** or **Netlify**, and the backend on **Render** or **Heroku**.

### Deploy Backend (Render/Heroku)
```sh
git init
git add .
git commit -m "Deploy backend"
git push origin main
```

### Deploy Frontend (Vercel/Netlify)
```sh
npm run build
```
Push the build folder to GitHub and connect with Vercel or Netlify.

---
## 📌 Future Improvements
- Implement notifications
- Add direct messaging feature
- Enhance UI/UX with animations

---
## 🤝 Contributing
Feel free to fork the repo and submit pull requests. Suggestions and improvements are always welcome!


---
## 📞 Contact
- **GitHub**: [pranavv04]((https://github.com/pranavv04))
- **Email**: pranavdhangar11@gmail.com

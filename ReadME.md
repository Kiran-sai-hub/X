<div align="center">
  
# Chirply

### A Full-Stack Social Media Platform Built with the MERN Stack

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Usage](#-usage) • [Tech Stack](#-tech-stack) • [API Routes](#-api-routes) • [Contributing](#-contributing)

</div>

---

## About

A fully functional Twitter (𝕏) clone that replicates the core features of the popular social media platform. This project showcases modern web development practices with a complete authentication system, real-time notifications, image uploads, and a responsive UI that works seamlessly across all devices.

## Features

### Authentication & Authorization
- Secure user registration and login with JWT
- Password encryption using bcrypt
- Protected routes with middleware authentication
- Persistent sessions with HTTP-only cookies

### User Management
- Complete user profiles with bio, avatar, and cover images
- Edit profile functionality
- Follow/Unfollow system
- View followers and following lists
- Suggested users sidebar

### Posts & Interactions
- Create posts with text and images
- Like and unlike posts
- Comment on posts
- Delete your own posts
- View posts from followed users (Feed)
- View all posts (For You section)
- View user-specific posts on profile pages

### Notifications
- Real-time notification system
- Notifications for:
  - New followers
  - Post likes
  - Post comments
- Mark notifications as read
- Delete notifications

### Media Handling
- Image upload for posts, avatars, and cover photos
- Cloudinary integration for image storage and optimization
- Image preview before upload
- Automatic image resizing

### UI/UX
- Fully responsive design (mobile, tablet, desktop)
- Modern, clean interface matching Twitter's aesthetic
- Loading skeletons for better UX
- Toast notifications for user feedback
- Dark theme UI
- Smooth animations and transitions

## Demo

[Chirply Demo](https://chirply-kzlc.onrender.com/)


## Tech Stack

### Frontend
- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **TanStack Query (React Query)** - Server state management
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Tailwind CSS component library
- **Vite** - Build tool and development server
- **React Hot Toast** - Toast notifications
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Bcrypt.js** - Password hashing
- **Cloudinary** - Image hosting and management
- **Cookie Parser** - Parse cookies

## Project Structure

```
Twitter Clone/
├── backend/
│   ├── controllers/          # Route controllers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── post.controller.js
│   │   └── notification.controller.js
│   ├── models/               # Database models
│   │   ├── user.model.js
│   │   ├── post.model.js
│   │   └── notification.model.js
│   ├── routes/               # API routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── post.routes.js
│   │   └── notification.routes.js
│   ├── middleware/           # Custom middleware
│   │   └── auth.js
│   ├── lib/utils/            # Utility functions
│   │   └── generateTokens.js
│   ├── db/                   # Database configuration
│   │   └── db.js
│   └── server.js             # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── common/
│   │   │   ├── skeletons/
│   │   │   └── svgs/
│   │   ├── pages/            # Page components
│   │   │   ├── auth/
│   │   │   ├── home/
│   │   │   ├── notification/
│   │   │   └── profile/
│   │   ├── hooks/            # Custom React hooks
│   │   ├── utils/            # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── public/               # Static assets
└── package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Clone the Repository
```bash
git clone https://github.com/Kiran-sai-hub/X.git
cd X
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=your_port
NODE_ENV=development

# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## Usage

### Development Mode

Run both frontend and backend in development mode:

```bash
# Terminal 1 - Backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

The backend will run on `http://localhost:{your_port}` and the frontend on `http://localhost:5173`

### Production Build

```bash
# Build the project
npm run build

# Start production server
npm start
```

The application will be available at `http://localhost:{your_port}`

## API Routes

### Authentication
```
POST   /api/auth/signup       - Register a new user
POST   /api/auth/login        - Login user
POST   /api/auth/logout       - Logout user
GET    /api/auth/me           - Get current user
```

### Users
```
GET    /api/users/profile/:username   - Get user profile
GET    /api/users/suggested           - Get suggested users
POST   /api/users/follow/:id          - Follow/Unfollow user
POST   /api/users/update              - Update user profile
```

### Posts
```
GET    /api/posts/all                 - Get all posts
GET    /api/posts/following           - Get posts from followed users
GET    /api/posts/likes/:id           - Get liked posts by user
GET    /api/posts/user/:username      - Get user posts
POST   /api/posts/create              - Create a new post
POST   /api/posts/like/:id            - Like/Unlike a post
POST   /api/posts/comment/:id         - Comment on a post
DELETE /api/posts/:id                 - Delete a post
```

### Notifications
```
GET    /api/notifications             - Get all notifications
DELETE /api/notifications             - Delete all notifications
DELETE /api/notifications/:id         - Delete a notification
```

## Key Features Explained

### Authentication Flow
1. User registers with username, email, and password
2. Password is hashed using bcrypt before storing
3. JWT token is generated and sent as HTTP-only cookie
4. Protected routes verify token via middleware
5. User data is fetched and cached using React Query

### Post Creation
1. User writes post text and optionally uploads an image
2. Image is uploaded to Cloudinary
3. Post is saved to MongoDB with user reference
4. Feed is invalidated and refetched to show new post

### Follow System
1. Click follow button on a user profile
2. Backend updates both users' followers/following arrays
3. Frontend optimistically updates UI
4. Suggested users and feed are automatically updated

### Notification System
1. Actions (follow, like, comment) trigger notification creation
2. Notifications are stored in MongoDB
3. Badge shows unread notification count
4. Users can view and delete notifications

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

**Sai Kiran**

- GitHub: [@Kiran-sai](https://github.com/Kiran-sai-hub)

## Acknowledgments

- Twitter/X for the design inspiration
- The MERN stack community for excellent documentation
- All open-source contributors

## Contact

For any queries or suggestions, feel free to reach out!

---

<div align="center">

### If you found this project helpful, please give it a star!

Made by Sai Kiran

</div>

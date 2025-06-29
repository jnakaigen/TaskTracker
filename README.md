# TaskTracker

A full-stack task management application built with React and Node.js, featuring role-based access control for administrators and team members.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - Secure login system with JWT tokens
- **Role-Based Access Control** - Separate dashboards for admins and team members
- **Project Management** - Create, update, and manage projects
- **Task Management** - Assign, track, and update task status
- **Team Management** - Organize users into teams
- **Real-time Updates** - Dynamic dashboard with live data

### Admin Features
- **Admin Dashboard** - Comprehensive overview with analytics
- **Project Management** - Full CRUD operations for projects
- **Task Assignment** - Assign tasks to team members
- **Team Administration** - Manage team structures and members
- **User Management** - Oversee user accounts and permissions

### Member Features
- **Member Dashboard** - Personalized task overview
- **My Tasks** - View and update assigned tasks
- **Task Status Updates** - Mark tasks as completed or in progress

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Material-UI (MUI)** - Beautiful and responsive UI components
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API communication
- **Chart.js** - Data visualization and analytics
- **Framer Motion** - Smooth animations and transitions

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
TaskTracker/
├── backend/
│   ├── controllers/     # Business logic
│   │   ├── projectController.js
│   │   ├── taskController.js
│   │   ├── teamController.js
│   │   └── userController.js
│   ├── models/         # Database schemas
│   │   ├── projectModel.js
│   │   ├── taskModel.js
│   │   ├── teamModel.js
│   │   └── userModel.js
│   ├── routes/         # API endpoints
│   │   ├── projects.js
│   │   ├── tasks.js
│   │   ├── teams.js
│   │   └── users.js
│   ├── server.js       # Express server setup
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/   # Admin-specific components
│   │   │   │   ├── AdmDash.jsx
│   │   │   │   ├── AdmDashLayout.jsx
│   │   │   │   ├── Project.jsx
│   │   │   │   ├── Task.jsx
│   │   │   │   └── Team.jsx
│   │   │   ├── member/  # Member-specific components
│   │   │   │   ├── MemDash.jsx
│   │   │   │   ├── MemDashLayout.jsx
│   │   │   │   └── MyTasks.jsx
│   │   │   ├── Front.jsx
│   │   │   └── Login.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TaskTracker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=4000
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd backend
   npm start
   # or with nodemon for development
   npx nodemon server.js
   ```

2. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## 📚 API Endpoints

### Authentication
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create new team
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Users
- `GET /api/users` - Get all users
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🔧 Development

### Available Scripts

**Backend:**
- `npm start` - Start the server
- `npm test` - Run tests (placeholder)

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Style
- ESLint configuration for consistent code formatting
- React hooks and functional components
- Modular component architecture

## 🎨 UI/UX Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Material Design** - Clean and modern interface
- **Dark/Light Theme** - Customizable appearance
- **Smooth Animations** - Enhanced user experience
- **Data Visualization** - Charts and analytics for insights

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for password security
- **CORS Protection** - Cross-origin request handling
- **Input Validation** - Server-side data validation
- **Role-Based Access** - Protected routes and features

## 📊 Database Schema

The application uses MongoDB with the following main collections:
- **Users** - User accounts and authentication
- **Projects** - Project information and metadata
- **Tasks** - Task details, assignments, and status
- **Teams** - Team structures and member associations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Built with ❤️ using React, Node.js, and MongoDB**

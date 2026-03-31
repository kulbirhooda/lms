# 📚 Learning Management System (LMS)

A full-stack web application that allows instructors to create courses, upload learning materials and videos, manage students, and track learning progress. Students can browse courses, enroll, submit assignments, and track their progress.

---

## 🛠 Tech Stack

### Backend
- **Node.js** with **Express.js**
- **PostgreSQL** (hosted on Neon)
- **Prisma ORM**
- **JWT** for authentication
- **Cloudinary** for video storage
- **Multer** for file uploads
- **Bcrypt** for password hashing
- **Zod** for schema validation

### Frontend
- **React.js** with **Vite**
- **React Router** for navigation
- **Axios** for API calls

---

## 👥 User Roles

| Role | Description |
|------|-------------|
| **Student** | Browse courses, enroll, view lessons, submit assignments, track progress |
| **Instructor** | Create courses, add lessons with video upload, create assignments with PDF questions |

---

## ✨ Features

### Authentication
- Separate signup flows for students and instructors
- Shared signin page with role-based redirect
- JWT-based authentication
- Passwords hashed with bcrypt

### Instructor
- Create and manage courses
- Add lessons with video upload (Cloudinary)
- Create assignments with optional question PDF
- View student enrollment counts and submission counts

### Student
- Browse all available courses
- Enroll in courses
- View lessons with video player
- Mark lessons as complete
- Submit assignments as PDF/doc files
- Track course progress with a progress bar

---

## 🗂 Project Structure

```
lms/
├── backend/
│   ├── http/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── course.controller.js
│   │   │   ├── assignment.controller.js
│   │   │   └── progress.controller.js
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── course.service.js
│   │   │   ├── assignment.service.js
│   │   │   └── progress.service.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── course.routes.js
│   │   │   ├── assignment.routes.js
│   │   │   └── progress.routes.js
│   │   ├── middlewares/
│   │   │   ├── requireAuth.js
│   │   │   ├── requireInstructor.js
│   │   │   ├── requireStudent.js
│   │   │   └── upload.js
│   │   └── schemas/
│   │       ├── auth.schemas.js
│   │       └── course.schemas.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── env.js
│   └── app.js
│
└── client/
    └── src/
        ├── api/
        │   ├── axios.jsx
        │   ├── authApi.jsx
        │   ├── courseApi.jsx
        │   ├── assignmentApi.jsx
        │   └── progressApi.jsx
        ├── context/
        │   └── authContext.jsx
        ├── lib/
        │   └── auth.jsx
        ├── Pages/
        │   ├── Signup.jsx
        │   ├── InstructorSignup.jsx
        │   ├── Signin.jsx
        │   ├── instructor/
        │   │   ├── InstructorDashboard.jsx
        │   │   └── CourseDetail.jsx
        │   └── student/
        │       ├── Dashboard.jsx
        │       └── CourseView.jsx
        ├── App.jsx
        └── main.jsx
```

---

## 🗄 Database Schema

- **User** — id, name, email, password, role (STUDENT | INSTRUCTOR | ADMIN)
- **Course** — id, title, description, thumbnail, instructorId
- **Lesson** — id, title, videoUrl, order, courseId
- **Enrollment** — id, userId, courseId
- **Progress** — id, userId, lessonId, completed, completedAt
- **Assignment** — id, title, description, deadline, questionFileUrl, courseId
- **Submission** — id, fileUrl, note, grade, assignmentId, userId

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL database (Neon recommended)
- Cloudinary account

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```
DATABASE_URL=your_neon_postgresql_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=http://localhost:5173
PORT=4444
```

Run database migrations:
```bash
npx prisma migrate dev
```

Start the backend:
```bash
nodemon app.js
```

### Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Student signup |
| POST | `/api/auth/signup/instructor` | Instructor signup |
| POST | `/api/auth/signin` | Signin (both roles) |

### Courses
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/courses/all` | Get all courses | Authenticated |
| GET | `/api/courses` | Get instructor's courses | Instructor |
| POST | `/api/courses` | Create course | Instructor |
| GET | `/api/courses/:courseId/lessons` | Get lessons | Authenticated |
| POST | `/api/courses/:courseId/lessons` | Add lesson with video | Instructor |
| POST | `/api/courses/:courseId/enroll` | Enroll in course | Student |
| GET | `/api/courses/enrolled` | Get enrolled courses | Student |

### Assignments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/courses/:courseId/assignments` | Get assignments | Authenticated |
| POST | `/api/courses/:courseId/assignments` | Create assignment | Instructor |
| POST | `/api/assignments/:assignmentId/submit` | Submit assignment | Student |
| GET | `/api/assignments/submissions` | Get my submissions | Student |

### Progress
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/lessons/:lessonId/complete` | Mark lesson complete | Student |
| GET | `/api/courses/:courseId/progress` | Get course progress | Student |

---

## 🌐 Application Routes

| Route | Page | Access |
|-------|------|--------|
| `/signup` | Student signup | Public |
| `/instructor/signup` | Instructor signup | Public |
| `/signin` | Signin | Public |
| `/dashboard` | Student dashboard | Student |
| `/student/courses/:courseId` | Course view | Student |
| `/instructor/dashboard` | Instructor dashboard | Instructor |
| `/instructor/courses/:courseId` | Course detail | Instructor |

---

## 📦 Future Improvements

- Video upload directly to AWS S3 in production
- Instructor grading and feedback on submissions
- Assignment grade tracking for students
- Admin dashboard
- Email notifications for deadlines
- Search and filter courses

---

## 👨‍💻 Author

Developed as an internship major project.

# Simplearn

Simplearn is a Learning Management System (LMS) built with a microservice architecture to manage academies, courses, users, and media.

> Note: The student role is currently under development.

## Features

- **Authentication**: Role-based access control (Admin, Instructor, Student) managed by an independent user service.
- **Management**: Comprehensive creation and organization of academies, courses, and structured lessons.
- **Media**: Dedicated service for handling course uploads and content serving.
- **Architecture**: Decoupled backend microservices communicating via REST APIs with a Next.js App Router frontend.

## Tech Stack

- **Frontend**: Next.js (React 19), TypeScript, Tailwind CSS v4, Zustand, Axios, Shadcn UI
- **Backend**: Node.js, Express, TypeScript, MongoDB, PostgreSQL, RabbitMQ
- **Testing**: Vitest, Playwright

## Project Structure

```text
.
├── frontend/
│   ├── app/            # Next.js App Router
│   ├── components/     # Reusable UI including Shadcn
│   └── store/          # Zustand state management
└── backend/
    ├── user-service/   # Microservice
    ├── academy-service/# Microservice
    ├── course-service/ # Microservice
    └── media-service/  # Microservice
```

## Getting Started

### Backend Services

Each microservice must be run independently. Repeat this process for each service in the `backend/` directory:

```bash
cd backend/user-service
npm install
npm run dev
```

### Frontend Application

```bash
cd frontend
npm install
npm run dev
```

The platform will be available at `http://localhost:3000`.

## Author

GitHub: [NQB37](https://github.com/NQB37)

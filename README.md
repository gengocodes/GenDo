# GenDo - Next.js Task Management App

A modern task management application built with Next.js, React, TypeScript, and MongoDB.

## Features

- User authentication and registration
- Task creation, editing, and deletion
- Real-time task management
- Responsive design
- MongoDB database integration
- JWT-based authentication

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB
- **Authentication**: JWT tokens
- **Styling**: Tailwind CSS + Custom CSS

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gendo
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── todos/         # Todo management endpoints
│   │   └── users/         # User management endpoints
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── login/             # Login page
│   ├── dashboard/         # Dashboard page
│   └── settings/          # Settings page
├── src/                   # Source files
│   ├── components/        # React components
│   ├── context/           # React context providers
│   └── types/             # TypeScript type definitions
└── public/                # Static assets
```

## Available Scripts

- `npm run dev` - Start Next.js development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## API Endpoints

### Authentication
- `POST /api/auth` - User registration
- `POST /api/auth/login` - User login

### Todos
- `GET /api/todos` - Get user's todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/[id]` - Update a todo
- `DELETE /api/todos/[id]` - Delete a todo

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/gendo

# JWT Secret for authentication
JWT_SECRET=your-super-secret-jwt-key-here
```

## Deployment

The application can be deployed to platforms that support Next.js:

- **Vercel** (Recommended)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License. 
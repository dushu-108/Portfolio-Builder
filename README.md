# Portfolio Builder

A full-stack application that allows users to create and manage their professional portfolios.

## Features

- Create and manage your portfolio with a user-friendly form
- View portfolio in a markdown format
- Auto-generate a beautiful, responsive portfolio website
- Edit and delete portfolio information

## How it works

1. Users fill out their portfolio information in the form
2. The backend saves the data and generates two versions:
   - A markdown version for quick preview
   - A complete portfolio website with modern UI

## Generated Portfolio Websites

When a user saves their portfolio, a complete React-based portfolio website is automatically generated in the `generated-portfolios` directory. Each user gets their own subdirectory named after their user ID.

The generated portfolio website features:
- Modern, responsive design using Tailwind CSS
- Clean typography with Inter font
- Sections for About, Skills, and Projects
- Mobile-friendly layout

## Project Structure

```
portfolio-builder/
├── frontend/           # React frontend application
├── backend/           # Express.js backend server
├── generated-portfolios/ # Generated portfolio websites
└── package.json      # Root package.json for project management
```

## Development

1. Install dependencies for both frontend and backend:
   ```bash
   npm run install-all
   ```

2. Start the backend server:
   ```bash
   npm start
   ```

3. In a new terminal, start the frontend development server:
   ```bash
   npm run dev
   ```

4. Access the application at http://localhost:5173

## Environment Variables

Backend:
- `PORT`: Server port (default: 4000)
- `CLIENT_URL`: Frontend URL (default: http://localhost:5173)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `GEMINI_API_KEY`: Google's Gemini AI API key for portfolio generation

## Scripts

- `npm start`: Start the backend server
- `npm run dev`: Start the frontend development server
- `npm run build`: Build the frontend for production
- `npm run install-all`: Install dependencies for both frontend and backend

## Generated Portfolio Structure

Each generated portfolio consists of:
- `index.html`: The main HTML file
- `app.js`: React component with the portfolio data and UI

## Technologies Used

- Frontend:
  - React
  - Vite
  - Tailwind CSS
  - React Router
  - Axios
  - React Markdown

- Backend:
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication
  - Google's Gemini AI API

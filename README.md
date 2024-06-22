# Task Manager App

## Description
The Task Manager App is a web-based application designed to help users manage their tasks efficiently. It allows users to register, log in, and manage their tasks by adding, viewing, and removing tasks. The app ensures that only authenticated users can access their tasks, providing a secure environment for task management.

## Features
- User Authentication: Secure user registration and login using bcrypt for password hashing and Passport.js for authentication.
- Task Management: Users can add, view, and remove tasks.
- Session Management: User sessions are managed to maintain the login state.
- Database Integration: Tasks and user information are stored in a PostgreSQL database.

## Tech Stack
1. Frontend
- Templating Engine: HTML + EJS (Embedded JavaScript)
- Styling: CSS + Bootstrap
2. Backend:
- Runtime Environment: Node.js
- Framework: Express.js
3. Database:
- Database: PostgreSQL
- Database Client: pg (node-postgres)
4. Authentication:
- Password Hashing: bcrypt
- Authentication Middleware: Passport.js
- Passport Strategy: passport-local
5. Middleware:
- Body Parsing: body-parser
- Session Management: express-session
6. Environment Management:
- Environment Variables: dotenv
7. Miscellaneous
- Static File Serving: express.static

## Installation
Prerequisites:
- Node.js and npm installed.
- PostgreSQL database set up.

Steps:
1. Clone the repository:
```
git clone <repository-url>
```
2. Navigate to the project directory:
```
cd task-manager-app
```
3. Install dependencies:
```
npm install
```
4. Set up environment variables:
- Create a .env file to encrypt your data in the root directory and add the following:
```
PG_USER=<your_postgres_user>
PG_HOST=<your_postgres_host>
PG_DATABASE=<your_database_name>
PG_PASSWORD=<your_postgres_password>
PG_PORT=<your_postgres_port>
SESSION_SECRET=<your_session_secret>
```
5. Start the server:
```
npm start
```
6. Open your browser and navigate to:
```   
http://localhost:3000
```
## Contributing
1. Fork the repository.
2. Create a new branch (git checkout -b feature-branch).
3. Make your changes.
4. Commit your changes (git commit -m 'Add some feature').
5. Push to the branch (git push origin feature-branch).
6. Open a pull request.

## Contact
Haseeb Mirza - h.mirza98@hotmail.com

## Acknowledgements
Icons provided by Font Awesome

© Haseeb Mirza - 2024

# Threads Backend

This project implements the backend for the Threads application, allowing users to create and manage threads, exchange messages, and interact with other users. The project is built using Node.js with Express.js, MongoDB for data storage, and other modern technologies.

## Features
- **User Registration and Authentication**: Supports user sign-up, login/logout with JWT authentication.
- **Thread Management**: Users can create, edit, and delete threads.
- **Messaging**: Users can send messages in threads, with real-time support via WebSocket.
- **Search and Filtering**: Implemented search by keywords and filtering by various parameters.
- **Admin Panel**: Tools for content moderation and user management.

## Technology Stack
- **Node.js**: Server-side framework.
- **Express.js**: Lightweight and flexible platform for building web applications.
- **JWT**: Authentication using JSON Web Tokens.
- **Docker**: Containerization of the application for simplified deployment.

## Installation and Setup
1. **Clone the repository:**
    ```bash
    git clone https://github.com/VitrikushIhor/threads-backend.git
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Configure environment variables:**
    Create a `.env` file and add the necessary variables (see `.env.example` for reference).
4. **Start the project:**
    ```bash
    npm start
    ```

## Contribution
Contributions are welcome! Feel free to open a pull request or create an issue to discuss new features or bug fixes.

## License
This project is licensed under the [MIT License](LICENSE).

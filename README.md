# Task Management App

A Task Management App Like Trello built with React.js on the frontend and Node.js with Express.js on the backend.

## Features

- **Task Creation & Management**: Create, update, and delete tasks with ease.
- **Drag-and-Drop**: Organize tasks by dragging and dropping them across different lists.
- **User Authentication**: Secure user login and registration.
- **Real-Time Updates**: Stay updated with real-time changes in task status.
- **Responsive Design**: Fully responsive for both desktop and mobile devices.

## Technologies Used

- **Frontend**: React.js, Tailwind CSS, Dnd-Kit, Zod, React Hook Form, Shad CN
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT Tokens
- **Deployment**: Vercel and Render

## Installation

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)

### Frontend

1. Clone the repository:

   ```bash
   git clone https://github.com/officiallysidsingh/task-management-app.git
   ```

2. Go into the client directory

   ```bash
   cd task-management-app/client
   ```

3. Install dependencies

   ```bash
   npm install
   ```

4. Run the client application

   ```bash
   npm run dev
   ```

   or

   ```bash
   npm run build && npm run preview
   ```

### Backend

1. Clone the repository (NOTE: Skip this if already cloned):

   ```bash
   git clone https://github.com/officiallysidsingh/task-management-app.git
   ```

2. Go into the client directory

   ```bash
   cd task-management-app/server
   ```

3. Install dependencies

   ```bash
   npm install
   ```

4. Run the server application

   ```bash
   npm run dev
   ```

   or

   ```bash
   npm run build && npm run start
   ```

## Future Enhancement

1. Refresh Token Implementation: Implement a refresh token mechanism in the backend authentication system. This will allow users to obtain a new access token when the current one expires, ensuring uninterrupted access to the application while maintaining security.

2. Notifications and Alerts: Implement real-time notifications and alerts for task updates, deadlines, and other important events to keep users informed.

3. Sorting by Due Date and Recent Updates: Implement sorting options for tasks by due date and recent updates. This will allow users to view tasks based on their urgency or most recent changes, improving task management efficiency.

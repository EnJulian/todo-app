 # Here's an outline of the necessary endpoints and their functionality:

## Authentication
1. Register
Endpoint: POST /api/register
Description: Register a new user.
Request Body:

{
  "username": "string",
  "password": "string"
}


2. Login
Endpoint: POST /api/login
Description: Authenticate a user and provide a token.
Request Body:
```
{
  "username": "string",
  "password": "string"
}
```
```
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (token) {
    jwt.verify(token, 'your_secret_key', (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export default authenticateJWT;
```

## Task Management
4. Create a Task
Endpoint: POST /api/tasks
Description: Create a new task.
Request Body:

```
{
  "task": "string",
  "priority": "number"
}
```

```Authorization: Bearer <token>```


5. Get All Tasks
Endpoint: GET /api/tasks
Description: Get all tasks created by the authenticated user.
Query Params:

priority: Optional, filter tasks by priority.
completed: Optional, filter tasks by completion status.
Headers:

makefile
``` Authorization: Bearer <token>```





## Get all tasks

Endpoint: GET /tasks
Request Headers:
json
Copy code
{
  "Authorization": "Bearer JWT_TOKEN"
}
Query Parameters:
search (optional): A string to search within task descriptions.
priority (optional): A number to filter tasks by priority.
completed (optional): A boolean to filter completed or incomplete tasks.
Response:
json
Copy code
[
  {
    "id": 1,
    "task": "string",
    "priority": 1,
    "completed": false,
    "userId": 1
  },
  ...
]
## Edit a task

Endpoint: PUT /tasks/:id
Request Headers:
json
Copy code
{
  "Authorization": "Bearer JWT_TOKEN"
}
Request Body:
json
Copy code
{
  "task": "string",
  "priority": 1
}
Response:
json
Copy code
{
  "message": "Task updated successfully",
  "task": {
    "id": 1,
    "task": "string",
    "priority": 1,
    "completed": false,
    "userId": 1
  }
}
## Delete a task

Endpoint: DELETE /tasks/:id
Request Headers:
json
Copy code
{
  "Authorization": "Bearer JWT_TOKEN"
}
Response:
json
Copy code
{
  "message": "Task deleted successfully"
}
Toggle task completion

Endpoint: PATCH /tasks/:id/toggle
Request Headers:
json
Copy code
{
  "Authorization": "Bearer JWT_TOKEN"
}
Response:
json
Copy code
{
  "message": "Task completion toggled",
  "task": {
    "id": 1,
    "task": "string",
    "priority": 1,
    "completed": true,
    "userId": 1
  }
}
## Database Schema
We will need two main tables: users and tasks.

users table
sql
```
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);
```
tasks table
sql
```
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  task VARCHAR(255) NOT NULL,
  priority INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  user_id INT REFERENCES users(id) ON DELETE CASCADE
);
```
Authentication Middleware
Create a middleware to protect the routes and validate the JWT token:

typescript
```
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.userId = decoded.id;
    next();
  });
};
export default authMiddleware;
```
## Express Routes
Here is an example of how to set up the routes using Express:

typescript
```
import express from 'express';
import authMiddleware from './middleware/authMiddleware';
import { createTask, getTasks, editTask, deleteTask, toggleTaskCompletion } from './controllers/taskController';
import { register, login } from './controllers/authController';

const router = express.Router();
```
## Authentication Routes
```
router.post('/auth/register', register);
router.post('/auth/login', login);
```
## Task Routes
```
router.post('/tasks', authMiddleware, createTask);
router.get('/tasks', authMiddleware, getTasks);
router.put('/tasks/:id', authMiddleware, editTask);
router.delete('/tasks/:id', authMiddleware, deleteTask);
router.patch('/tasks/:id/toggle', authMiddleware, toggleTaskCompletion);

export default router;
```
This setup provides a comprehensive set of endpoints and basic security with JWT authentication, allowing users to manage their TODO tasks effectively. You can expand upon this foundation to include additional features or further refine the existing ones.










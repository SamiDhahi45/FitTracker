# FitTracker
Node.js
MongoDB
## About ##
FitTrack is a full-stack web application designed to help users manage and monitor their personal fitness journey. The app allows users to log and track their workouts, manage exercises, and view their progress over time through an interactive dashboard.

## How To Run? ##
1. Start Server
```javascript
  cd server
  npx nodemod index.js
```
2. Start Client( Frontend )
```javascript
  cd client
  npm start
```

## Running Account ##
| Name | Email | Password |
|----------|----------|----------|
| Sami  | sami@gmail.com  | 1234  |
| Ahmed  | Ahmed@yahoo.om  | 1234A  |

## Features ##
| # | Feature | Description |
|---|---------|-------------|
| 1 | User Registration | Create a new account with name, email, password, age, weight, height, and fitness goal |
| 2 | User Login | Secure login with bcrypt password encryption |
| 3 | Persistent Session | User stays logged in after page refresh using localStorage |
| 4 | Logout | Clears session from Redux state and localStorage |
| 5 | Dashboard | Displays total workouts, total volume, hours trained, and current streak |
| 6 | Progress Chart | Area chart showing workout volume over the last 10 sessions |
| 7 | Workout Logging | Create workouts with title, duration, notes, and exercises |
| 8 | Exercise Sets | Add multiple exercises and sets (reps + weight) per workout |
| 9 | Volume Calculation | Server automatically calculates total volume (reps × weight) per workout |
| 10 | Edit Workout | Update any existing workout details |
| 11 | Delete Workout | Remove a workout permanently |
| 12 | Exercise Library | Browse 10 built-in global exercises filtered by category |
| 13 | Custom Exercises | Add, edit, and delete your own personal exercises |
| 14 | Search & Filter | Search exercises by name and filter by muscle category |
| 15 | Profile Management | Update name, age, weight, height, and fitness goal |
| 16 | BMI Calculator | Automatically calculates BMI and displays category |
| 17 | Profile Picture | Upload and display a profile photo |
| 18 | Input Validation | Server-side and client-side validation on all forms using Yup |
| 19 | Containerization | Full Docker setup with docker-compose for client, server, and MongoDB |

## API Endpoints ##
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /registerUser | Register a new user |
| POST | /login | Login with email and password |
| POST | /logout | Logout current user |
| GET | /getProfile/:userId | Get user profile + BMI |
| PUT | /updateProfile/:userId | Update user profile |
| POST | /uploadProfilePic/:userId | Upload profile picture |
| GET | /getExercises/:userId | Get all exercises |
| POST | /addExercise | Add a custom exercise |
| PUT | /updateExercise/:exerciseId | Update a custom exercise |
| DELETE | /deleteExercise/:exerciseId | Delete a custom exercise |
| GET | /getWorkouts/:userId | Get all workouts |
| GET | /getWorkoutStats/:userId | Get stats and streak |
| POST | /addWorkout | Create a new workout |
| PUT | /updateWorkout/:workoutId | Update a workout |
| DELETE | /deleteWorkout/:workoutId | Delete a workout |
| GET | /getNearbyGyms?lat=&lng= | Get nearest gym by location |

## Tech Stack ##
| Category | Technology |
|----------|------------|
| Frontend | React.js |
| UI Framework | Reactstrap (Bootstrap 5) |
| State Management | Redux Toolkit |
| Charts | Recharts |
| Maps | Leaflet / OpenStreetMap |
| Form Handling | Formik |
| Validation | Yup |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Password Encryption | Bcrypt |
| HTTP Requests | Axios |
| Containerization | Docker + Docker Compose |
| Testing | React Testing Library |
| Version Control | GitHub |

## Database Collections ##
| Collection | Fields |
|------------|--------|
| userInfos | name, email, password, age, weight, height, goal, profilePic, isActive, createdAt |
| exercises | name, category, muscleGroup, equipment, difficulty, description, isCustom, createdBy, createdAt |
| workouts | userId, title, date, exercises, totalVolume, duration, isCompleted, notes |


fittrack/
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── Components/
│   │   │   ├── AppNavbar.js        ← Top navigation bar with logout
│   │   │   ├── ExerciseCard.js     ← Reusable exercise card component
│   │   │   ├── Exercises.js        ← Exercise library with full CRUD
│   │   │   ├── Home.js             ← Dashboard with stats and charts
│   │   │   ├── Login.js            ← Login page
│   │   │   ├── NearbyGyms.js       ← Nearest gym with interactive map
│   │   │   ├── Profile.js          ← User profile and BMI calculator
│   │   │   ├── ProgressChart.js    ← Recharts area chart component
│   │   │   ├── Register.js         ← Register/signup page
│   │   │   ├── WorkoutCard.js      ← Reusable workout card component
│   │   │   └── Workouts.js         ← Workout list with full CRUD
│   │   ├── Features/
│   │   │   ├── ExerciseSlice.js    ← Exercise state and thunks
│   │   │   ├── UserSlice.js        ← Auth state and thunks
│   │   │   └── WorkoutSlice.js     ← Workout state and thunks
│   │   ├── Store/
│   │   │   └── store.js            ← Combines all reducers
│   │   ├── Validations/
│   │   │   ├── UserValidations.js  ← Register, login, profile schemas
│   │   │   └── WorkoutValidations.js ← Workout and exercise schemas
│   │   ├── __tests__/
│   │   │   ├── ExerciseCard.test.js  ← ExerciseCard component tests
│   │   │   ├── Login.test.js         ← Login form tests
│   │   │   ├── ProgressChart.test.js ← ProgressChart component tests
│   │   │   └── WorkoutCard.test.js   ← WorkoutCard component tests
│   │   └── App.js              ← Main router and route definitions
│   │   ├── index.css
│   │   └── index.js
│   ├── Dockerfile
│   └── package.json
│
└── server/
    ├── Models/
    │   ├── ExerciseModel.js        ← Exercise schema
    │   ├── UserModel.js            ← User schema
    │   └── WorkoutModel.js         ← Workout schema
    ├── uploads/                    ← Profile picture uploads
    ├── Dockerfile
    ├── index.js                    ← Express app and all API routes
    ├── package.json
    └── seed.js                     ← Database seeding script

## Developers ##
| Name | Role |
|----------|------------|
| Waseem Mohammed | Full Stack Dev |
| Said Nasser | Full Stack Dev |
| Sami Dhahi | Full Stack Dev |

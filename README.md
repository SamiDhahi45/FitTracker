# 💪 FitTrack — Full Stack Fitness Tracker
FitTrack is a full-stack web application designed to help users manage and monitor their personal fitness journey. The app allows users to log and track their workouts, manage exercises, and view their progress over time through an interactive dashboard.

## Getting Started
Note: First Extract zip file "client+server.zip" in same folder
### Docker (recommended)
```bash
docker-compose up --build

# Seed database (in a new terminal)
docker exec fittrack-server node seed.js
```

Open: http://localhost:3000  
Login: `alice@fittrack.com` / `password123`

### Local Development
```bash
# Terminal 1 — Server
cd server && npm install && npm run dev

# Terminal 2 — Client
cd client && npm install && npm start
```

### Run Tests
```bash
cd client && npm test
```

---

## API Endpoints (all in server/index.js)

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| POST   | /registerUser                   | Register                 |
| POST   | /login                          | Login                    |
| POST   | /logout                         | Logout                   |
| GET    | /getProfile/:userId             | Get profile + BMI        |
| PUT    | /updateProfile/:userId          | Update profile           |
| GET    | /getExercises/:userId           | Get exercise library     |
| POST   | /addExercise                    | Add custom exercise      |
| PUT    | /updateExercise/:exerciseId     | Update exercise          |
| DELETE | /deleteExercise/:exerciseId     | Delete exercise          |
| GET    | /getWorkouts/:userId            | Get all workouts         |
| GET    | /getWorkoutStats/:userId        | Stats + streak           |
| POST   | /addWorkout                     | Create workout           |
| PUT    | /updateWorkout/:workoutId       | Update workout           |
| DELETE | /deleteWorkout/:workoutId       | Delete workout           |
| GET    | /getNearbyGyms?lat=&lng=        | Nearby gyms              |

---

## Criteria Coverage

| Criterion              | How it's covered |
|------------------------|-----------------|
| Prototype              | Figma: Login, Dashboard, Workouts, Exercises, Profile, NearbyGyms |
| React UI Framework     | Reactstrap throughout all components |
| CRUD (8 marks)         | Full CRUD on Workouts + Exercises |
| Business Logic         | Volume calc, BMI, streak, server-side validation |
| MongoDB Collections    | users, exercises, workouts — 5+ docs, mixed types |
| Testing (4 cases)      | Login, WorkoutCard, ProgressChart, ExerciseCard |
| Location Service       | Geolocation + Leaflet map + /getNearbyGyms |
| GitHub                 | fittrack-client + fittrack-server |
| Docker                 | docker-compose with 3 services |
| Deployment             | Client → Vercel, Server → Render |
| Creativity             | Streak tracker, BMI calculator, volume charts |

---

## Project Structure

```
fittrack/
├── docker-compose.yml
│
├── server/
│   ├── index.js                  ← Express app + ALL routes
│   ├── Dockerfile
│   ├── package.json
│   ├── seed.js                   ← Seed script (5 users, 10 exercises, 3 workouts)
│   └── Models/
│       ├── UserModel.js
│       ├── ExerciseModel.js
│       └── WorkoutModel.js
│
└── client/
    ├── Dockerfile
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js              ← Entry point with Redux Provider
        ├── index.css
        │
        ├── Components/           ← All pages and UI components
        │   ├── App.js
        │   ├── AppNavbar.js
        │   ├── Login.js
        │   ├── Register.js
        │   ├── Home.js           ← Dashboard
        │   ├── Workouts.js
        │   ├── Exercises.js
        │   ├── Profile.js
        │   ├── NearbyGyms.js
        │   ├── WorkoutCard.js
        │   ├── ExerciseCard.js
        │   └── ProgressChart.js
        │
        ├── Features/             ← Redux Toolkit slices (createAsyncThunk)
        │   ├── UserSlice.js
        │   ├── WorkoutSlice.js
        │   └── ExerciseSlice.js
        │
        ├── Store/
        │   └── store.js          ← Redux store (configureStore)
        │
        ├── Validations/          ← Yup validation schemas
        │   ├── UserValidations.js
        │   └── WorkoutValidations.js
        │
        ├── Images/               ← Place your images here
        │
        └── __tests__/            ← React Testing Library
            ├── Login.test.js
            ├── WorkoutCard.test.js
            ├── ProgressChart.test.js
            └── ExerciseCard.test.js
```

---


## Developers

| Name | Role |
|------------------------|-----------------|
| Waseem | Full Stack Dev |
| Said | Full Stack Dev |
| Sami | Full Stack Dev |

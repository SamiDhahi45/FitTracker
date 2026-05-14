import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Row, Col, Card, CardBody, Spinner } from "reactstrap";
import { getWorkouts, getWorkoutStats } from "../Features/WorkoutSlice";
import ProgressChart from "./ProgressChart";
import WorkoutCard   from "./WorkoutCard";
import { deleteWorkout } from "../Features/WorkoutSlice";

const Home = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const email     = useSelector((state) => state.users.user.email);
 // const userId    = useSelector((state) => state.users.user._id);
 const userFromRedux = useSelector((state) => state.users.user);
  const saved = JSON.parse(localStorage.getItem("fittrack_user") || "{}");
  const userId = userFromRedux._id || saved._id;

  const userName  = useSelector((state) => state.users.user.name);
  const workouts  = useSelector((state) => state.workouts.workouts);
  const stats     = useSelector((state) => state.workouts.stats);
  const isLoading = useSelector((state) => state.workouts.isLoading);

  // Redirect to login if not authenticated — same as teacher's Home.js
  useEffect(() => {
    const saved = localStorage.getItem("fittrack_user");
    if (!email && !saved) {
      navigate("/login");
    }
  }, [email]);

  // Fetch workouts and stats when user is available
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("fittrack_user") || "{}");
    const id = userId || savedUser._id;
    if (id) {
      dispatch(getWorkouts(id));
      dispatch(getWorkoutStats(id));
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner color="primary" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Workouts", value: stats?.totalWorkouts ?? 0, icon: "🏋️", color: "primary" },
    { label: "Total Volume",   value: `${(stats?.totalVolume ?? 0).toLocaleString()} kg`, icon: "📦", color: "success" },
    { label: "Hours Trained",  value: `${Math.round((stats?.totalDuration ?? 0) / 60)}h`, icon: "⏱️", color: "info"    },
    { label: "Current Streak", value: `${stats?.streak ?? 0} days`, icon: "🔥", color: "warning" },
  ];
  
  const handleDelete = (id) => {
    if (!window.confirm("Delete this workout?")) return;
    dispatch(deleteWorkout(id));
  };

  return (
    <>
      <h4 className="mb-1">Welcome back</h4>
      <p className="text-muted mb-4">Here's your fitness overview</p>

      <Row className="g-3 mb-4">
        {statCards.map((s) => (
          <Col xs={6} md={3} key={s.label}>
            <Card className={`stat-card border-0 bg-${s.color} bg-opacity-10`}>
              <CardBody className="text-center py-3">
                <div style={{ fontSize: "1.8rem" }}>{s.icon}</div>
                <div className={`fw-bold fs-5 text-${s.color}`}>{s.value}</div>
                <small className="text-muted">{s.label}</small>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      {workouts.length > 1 && (
        <Card className="stat-card mb-4">
          <CardBody>
            <ProgressChart workouts={workouts} />
          </CardBody>
        </Card>
      )}

      <h5 className="mb-3">Recent Workouts</h5>
      {workouts.length === 0 ? (
        <Card className="stat-card">
          <CardBody className="text-center py-5 text-muted">
            <div style={{ fontSize: "3rem" }}>🏋️</div>
            <p>No workouts yet. <a href="/workouts">Log your first workout!</a></p>
          </CardBody>
        </Card>
      ) : (
        <Row className="g-2">
          {workouts.slice(0, 4).map((w) => (
            <Col md={6} key={w._id}>
              <WorkoutCard workout={w} onEdit={() => navigate("/workouts")} onDelete={handleDelete} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default Home;

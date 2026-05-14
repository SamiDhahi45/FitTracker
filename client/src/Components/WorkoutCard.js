import { Card, CardBody, CardTitle, Badge, Button } from "reactstrap";

const WorkoutCard = ({ workout, onEdit, onDelete }) => {
  const date = new Date(workout.date).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });

  return (
    <Card className="workout-card mb-3" data-testid="workout-card">
      <CardBody>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <CardTitle tag="h6" className="mb-1 fw-bold">{workout.title}</CardTitle>
            <small className="text-muted">{date}</small>
          </div>
          <Badge color={workout.isCompleted ? "success" : "warning"} pill>
            {workout.isCompleted ? "✓ Done" : "In Progress"}
          </Badge>
        </div>
        <div className="mt-2 d-flex gap-3">
          <small className="text-muted">🏋️ {workout.exercises?.length || 0} exercises</small>
          <small className="text-muted">📦 {workout.totalVolume?.toLocaleString()} kg</small>
          {workout.duration && <small className="text-muted">⏱️ {workout.duration} min</small>}
        </div>
        <div className="mt-3 d-flex gap-2">
          <Button size="sm" color="outline-primary" onClick={() => onEdit(workout)}>Edit</Button>
          <Button size="sm" color="outline-danger"  onClick={() => onDelete(workout._id)}>Delete</Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default WorkoutCard;

import { Card, CardBody, Badge, Button } from "reactstrap";

const categoryColors = {
  chest: "danger", back: "primary", legs: "success",
  shoulders: "warning", arms: "info", core: "secondary", cardio: "dark",
};

const ExerciseCard = ({ exercise, onEdit, onDelete }) => {
  const color = categoryColors[exercise.category] || "secondary";

  return (
    <Card className="workout-card mb-2" data-testid="exercise-card">
      <CardBody className="py-2 px-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <span className="fw-semibold">{exercise.name}</span>
            <div className="mt-1">
              <Badge color={color} className="me-1" style={{ fontSize: "0.7rem" }}>
                {exercise.category}
              </Badge>
              <small className="text-muted">{exercise.muscleGroup}</small>
              {exercise.equipment && (
                <small className="text-muted ms-2">· {exercise.equipment}</small>
              )}
            </div>
          </div>
          {exercise.isCustom && (
            <div className="d-flex gap-1">
              <Button size="sm" color="outline-primary" onClick={() => onEdit(exercise)}>Edit</Button>
              <Button size="sm" color="outline-danger"  onClick={() => onDelete(exercise._id)}>Delete</Button>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

export default ExerciseCard;

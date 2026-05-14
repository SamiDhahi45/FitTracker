import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Input, Alert, Spinner, Badge
} from "reactstrap";
import {
  getWorkouts, addWorkout, updateWorkout, deleteWorkout,
} from "../Features/WorkoutSlice";
import { getExercises } from "../Features/ExerciseSlice";
import WorkoutCard from "./WorkoutCard";

const emptyForm = { title: "", duration: "", notes: "", exercises: [] };

const Workouts = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const email     = useSelector((state) => state.users.user.email);
  //const userId    = useSelector((state) => state.users.user._id);
  const userFromRedux = useSelector((state) => state.users.user);
  const saved = JSON.parse(localStorage.getItem("fittrack_user") || "{}");
  const userId = userFromRedux._id || saved._id;

  const workouts  = useSelector((state) => state.workouts.workouts);
  const exercises = useSelector((state) => state.exercises.exercises);
  const isLoading = useSelector((state) => state.workouts.isLoading);

  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(emptyForm);
  const [error,   setError]   = useState("");

  // Redirect if not logged in
  useEffect(() => {
    const saved = localStorage.getItem("fittrack_user");
    if (!email && !saved) {
      navigate("/login");
    }
  }, [email]);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("fittrack_user") || "{}");
    const id = userId || savedUser._id;
    if (id) {
      dispatch(getWorkouts(id));
      dispatch(getExercises(id));
    }
  }, [userId]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(""); setModal(true); };
  const openEdit   = (w) => {
    setEditing(w);
    setForm({
      title:     w.title,
      duration:  w.duration || "",
      notes:     w.notes    || "",
      exercises: w.exercises.map((ex) => ({
        exercise: ex.exercise?._id || ex.exercise,
        sets:     ex.sets,
        notes:    ex.notes || "",
      })),
    });
    setError("");
    setModal(true);
  };

  const addExerciseRow = () =>
    setForm((f) => ({
      ...f,
      exercises: [...f.exercises, { exercise: exercises[0]?._id || "", sets: [{ reps: 10, weight: 0 }], notes: "" }],
    }));

  const addSet = (exIdx) => {
    const updated = form.exercises.map((ex, i) => {
      if (i === exIdx) {
        return { ...ex, sets: [...ex.sets, { reps: 10, weight: 0 }] };
      }
      return ex;
    });
    setForm({ ...form, exercises: updated });
  };

  const updateSet = (exIdx, setIdx, field, value) => {
    const updated = form.exercises.map((ex, i) => {
      if (i === exIdx) {
        const newSets = ex.sets.map((set, j) =>
          j === setIdx ? { ...set, [field]: Number(value) } : set
        );
        return { ...ex, sets: newSets };
      }
      return ex;
    });
    setForm({ ...form, exercises: updated });
  };

  const removeExercise = (idx) =>
    setForm({ ...form, exercises: form.exercises.filter((_, i) => i !== idx) });

  const handleSubmit = async () => {
    setError("");
    if (!form.title.trim())          return setError("Title is required.");
    if (form.exercises.length === 0) return setError("Add at least one exercise.");

    const payload = { ...form, userId, duration: form.duration ? Number(form.duration) : undefined };

    if (editing) {
      await dispatch(updateWorkout({ workoutId: editing._id, workoutData: payload }));
    } else {
      await dispatch(addWorkout(payload));
    }
    setModal(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this workout?")) return;
    dispatch(deleteWorkout(id));
  };

  if (isLoading) return <div className="text-center py-5"><Spinner color="primary" /></div>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">My Workouts</h4>
        <Button color="primary" onClick={openCreate}>+ New Workout</Button>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <div style={{ fontSize: "3rem" }}>📋</div>
          <p>No workouts yet. Create your first one!</p>
        </div>
      ) : (
        <Row className="g-3">
          {workouts.map((w) => (
            <Col md={6} key={w._id}>
              <WorkoutCard workout={w} onEdit={openEdit} onDelete={handleDelete} />
            </Col>
          ))}
        </Row>
      )}

      {/* Create / Edit Modal */}
      <Modal isOpen={modal} toggle={() => setModal(false)} size="lg">
        <ModalHeader toggle={() => setModal(false)}>
          {editing ? "Edit Workout" : "New Workout"}
        </ModalHeader>
        <ModalBody>
          {error && <Alert color="danger">{error}</Alert>}
          <Form>
            <Row>
              <Col md={8}>
                <FormGroup>
                  <Label>Workout Title *</Label>
                  <Input value={form.title} placeholder="e.g. Push Day A"
                    onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </FormGroup>
              </Col>
              <Col md={4}>
                <FormGroup>
                  <Label>Duration (min)</Label>
                  <Input type="number" value={form.duration} placeholder="45"
                    onChange={(e) => setForm({ ...form, duration: e.target.value })} />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label>Notes</Label>
              <Input type="textarea" value={form.notes} rows={2}
                onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </FormGroup>
            <hr />
            <div className="d-flex justify-content-between align-items-center mb-2">
              <Label className="mb-0 fw-bold">Exercises</Label>
              <Button size="sm" color="outline-primary" type="button" onClick={addExerciseRow}>+ Add Exercise</Button>
            </div>
            {form.exercises.map((ex, exIdx) => (
              <div key={exIdx} className="border rounded p-3 mb-3 bg-light">
                <div className="d-flex justify-content-between mb-2">
                  <Input type="select" value={ex.exercise} style={{ width: "70%" }}
                    onChange={(e) => {
                      const updated = [...form.exercises];
                      updated[exIdx].exercise = e.target.value;
                      setForm({ ...form, exercises: updated });
                    }}>
                    {exercises.map((e) => <option key={e._id} value={e._id}>{e.name}</option>)}
                  </Input>
                  <Button size="sm" color="outline-danger" type="button" onClick={() => removeExercise(exIdx)}>Remove</Button>
                </div>
                {ex.sets.map((set, setIdx) => (
                  <Row key={setIdx} className="g-2 mb-1 align-items-center">
                    <Col xs="auto"><Badge color="secondary">Set {setIdx + 1}</Badge></Col>
                    <Col xs={4}>
                      <Input type="number" size="sm" placeholder="Reps" value={set.reps}
                        onChange={(e) => updateSet(exIdx, setIdx, "reps", e.target.value)} />
                    </Col>
                    <Col xs={4}>
                      <Input type="number" size="sm" placeholder="Weight (kg)" value={set.weight}
                        onChange={(e) => updateSet(exIdx, setIdx, "weight", e.target.value)} />
                    </Col>
                  </Row>
                ))}
                <Button size="sm" color="link" type="button" onClick={() => addSet(exIdx)}>+ Add Set</Button>
              </div>
            ))}
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModal(false)}>Cancel</Button>
          <Button color="primary" onClick={handleSubmit}>
            {editing ? "Save Changes" : "Create Workout"}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Workouts;

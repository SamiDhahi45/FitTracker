import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Row, Col, Input, Button, Modal, ModalHeader, ModalBody, ModalFooter,
  Form, FormGroup, Label, Alert, Spinner,
} from "reactstrap";
import {
  getExercises, addExercise, updateExercise, deleteExercise,
} from "../Features/ExerciseSlice";
import ExerciseCard from "./ExerciseCard";

const CATEGORIES   = ["chest","back","legs","shoulders","arms","core","cardio"];
const DIFFICULTIES = ["beginner","intermediate","advanced"];
const emptyForm    = { name:"", category:"chest", muscleGroup:"", equipment:"", difficulty:"beginner", description:"" };

const Exercises = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const email     = useSelector((state) => state.users.user.email);
  //const userId    = useSelector((state) => state.users.user._id);
  const userFromRedux = useSelector((state) => state.users.user);
  const saved = JSON.parse(localStorage.getItem("fittrack_user") || "{}");
  const userId = userFromRedux._id || saved._id;

  const exercises = useSelector((state) => state.exercises.exercises);
  const isLoading = useSelector((state) => state.exercises.isLoading);

  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("all");
  const [modal,   setModal]   = useState(false);
  const [editing, setEditing] = useState(null);
  const [form,    setForm]    = useState(emptyForm);
  const [error,   setError]   = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const saved = localStorage.getItem("fittrack_user");
    if (!email && !saved) {
      navigate("/login");
    }
  }, [email]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("fittrack_user") || "{}");
    const id = userId || savedUser._id;
    if (id) dispatch(getExercises(id));
  }, [userId]);

  const filtered = exercises.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || e.category === filter;
    return matchSearch && matchFilter;
  });

  const openCreate = () => { setEditing(null); setForm(emptyForm); setError(""); setModal(true); };
  const openEdit   = (e) => {
    setEditing(e);
    setForm({ name: e.name, category: e.category, muscleGroup: e.muscleGroup, equipment: e.equipment || "", difficulty: e.difficulty || "beginner", description: e.description || "" });
    setError("");
    setModal(true);
  };

  const handleSubmit = async () => {
    setError("");
    if (!form.name.trim() || !form.muscleGroup.trim())
      return setError("Name and muscle group are required.");
    if (editing) {
      await dispatch(updateExercise({ exerciseId: editing._id, exerciseData: form }));
    } else {
      await dispatch(addExercise({ ...form, userId }));
    }
    setModal(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this exercise?")) return;
    dispatch(deleteExercise(id));
  };

  if (isLoading) return <div className="text-center py-5"><Spinner color="primary" /></div>;

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">Exercise Library</h4>
        <Button color="primary" onClick={openCreate}>+ Custom Exercise</Button>
      </div>

      <Row className="g-2 mb-3">
        <Col md={6}>
          <Input placeholder="Search exercises…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </Col>
        <Col md={6}>
          <Input type="select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
          </Input>
        </Col>
      </Row>

      <p className="text-muted small">{filtered.length} exercises found</p>
      {filtered.map((e) => (
        <ExerciseCard key={e._id} exercise={e} onEdit={openEdit} onDelete={handleDelete} />
      ))}

      <Modal isOpen={modal} toggle={() => setModal(false)}>
        <ModalHeader toggle={() => setModal(false)}>
          {editing ? "Edit Exercise" : "New Custom Exercise"}
        </ModalHeader>
        <ModalBody>
          {error && <Alert color="danger">{error}</Alert>}
          <Form>
            <FormGroup>
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </FormGroup>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label>Category *</Label>
                  <Input type="select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label>Difficulty</Label>
                  <Input type="select" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
                    {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label>Muscle Group *</Label>
              <Input value={form.muscleGroup} placeholder="e.g. Quadriceps"
                onChange={(e) => setForm({ ...form, muscleGroup: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Equipment</Label>
              <Input value={form.equipment} placeholder="e.g. Barbell, Dumbbell, None"
                onChange={(e) => setForm({ ...form, equipment: e.target.value })} />
            </FormGroup>
            <FormGroup>
              <Label>Description</Label>
              <Input type="textarea" value={form.description} rows={3}
                onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setModal(false)}>Cancel</Button>
          <Button color="primary" onClick={handleSubmit}>{editing ? "Save" : "Create"}</Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Exercises;

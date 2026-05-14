import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import {
  Row, Col, Card, CardBody, CardTitle,
  Form, FormGroup, Label, Input, Button, Alert, Spinner, Badge
} from "reactstrap";
import { getProfile, updateProfile } from "../Features/UserSlice";
import { profileSchemaValidation } from "../Validations/UserValidations";
import { uploadProfilePic } from "../Features/UserSlice";

const goalLabels = { lose_weight: "Lose Weight", build_muscle: "Build Muscle", maintain: "Maintain" };
const bmiColors  = { Underweight: "info", "Normal weight": "success", Overweight: "warning", Obese: "danger" };

const Profile = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const email     = useSelector((state) => state.users.user.email);
  //const userId    = useSelector((state) => state.users.user._id);
  const userFromRedux = useSelector((state) => state.users.user);
  const saved = JSON.parse(localStorage.getItem("fittrack_user") || "{}");
  const userId = userFromRedux._id || saved._id;

  const profile   = useSelector((state) => state.users.profile);
  const isLoading = useSelector((state) => state.users.isLoading);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const saved = localStorage.getItem("fittrack_user");
    if (!email && !saved) {
      navigate("/login");
    }
  }, [email]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (userId) dispatch(getProfile(userId));
  }, [userId]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name:   profile?.name   || "",
      age:    profile?.age    || "",
      weight: profile?.weight || "",
      height: profile?.height || "",
      goal:   profile?.goal   || "maintain",
    },
    validationSchema: profileSchemaValidation,
    onSubmit: async (values, { setStatus }) => {
      const result = await dispatch(updateProfile({ userId, profileData: values }));
      if (result.meta.requestStatus === "fulfilled") {
        setStatus("success");
        dispatch(getProfile(userId)); // refresh BMI
      } else {
        setStatus("error");
      }
    },
  });

  const handlePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await dispatch(uploadProfilePic({ userId, file }));
    dispatch(getProfile(userId));
  };

  if (isLoading) return <div className="text-center py-5"><Spinner color="primary" /></div>;

  return (
    <>
      <h4 className="mb-4">My Profile</h4>
      <Row className="g-4">
        
        <Col md={4}>
          <Card className="stat-card mb-3">
            <CardBody className="text-center py-4">
              <div style={{ position: "relative", width: 70, height: 70, margin: "0 auto 12px" }}>
                {profile?.profilePic ? (
                  <img
                    src={profile.profilePic}
                    alt="profile"
                    style={{ width: 70, height: 70, borderRadius: "50%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ width: 70, height: 70, borderRadius: "50%", background: "#0d6efd", color: "#fff", fontSize: "1.8rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {profile?.name?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <label style={{ position: "absolute", bottom: 0, right: 0, background: "#0d6efd", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <span style={{ color: "#fff", fontSize: "0.7rem" }}>✏️</span>
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={handlePicUpload} />
                </label>
              </div>
              <h5 className="mb-0">{profile?.name}</h5>
              <small className="text-muted">{profile?.email}</small>
              <div className="mt-2">
                <Badge color="primary">{goalLabels[profile?.goal]}</Badge>
              </div>
            </CardBody>
          </Card>

          {profile?.bmi && (
            <Card className="stat-card">
              <CardBody>
                <CardTitle tag="h6">BMI Calculator</CardTitle>
                <div className="text-center py-2">
                  <div className="display-6 fw-bold">{profile.bmi}</div>
                  <Badge color={bmiColors[profile.bmiCategory] || "secondary"} className="mt-1">
                    {profile.bmiCategory}
                  </Badge>
                </div>
                <small className="text-muted d-block mt-2">
                  Based on {profile.weight}kg / {profile.height}cm
                </small>
              </CardBody>
            </Card>
          )}
        </Col>

        <Col md={8}>
          <Card className="stat-card">
            <CardBody className="p-4">
              <CardTitle tag="h6" className="mb-3">Edit Profile</CardTitle>
              {formik.status === "success" && <Alert color="success">Profile updated!</Alert>}
              {formik.status === "error"   && <Alert color="danger">Update failed.</Alert>}
              <Form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Full Name</Label>
                      <Input name="name" value={formik.values.name} onChange={formik.handleChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Age</Label>
                      <Input type="number" name="age" value={formik.values.age} onChange={formik.handleChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Weight (kg)</Label>
                      <Input type="number" name="weight" value={formik.values.weight} onChange={formik.handleChange} />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label>Height (cm)</Label>
                      <Input type="number" name="height" value={formik.values.height} onChange={formik.handleChange} />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label>Fitness Goal</Label>
                  <Input type="select" name="goal" value={formik.values.goal} onChange={formik.handleChange}>
                    <option value="lose_weight">Lose Weight</option>
                    <option value="build_muscle">Build Muscle</option>
                    <option value="maintain">Maintain Fitness</option>
                  </Input>
                </FormGroup>
                <Button color="primary" type="submit" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? "Saving…" : "Save Changes"}
                </Button>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Profile;

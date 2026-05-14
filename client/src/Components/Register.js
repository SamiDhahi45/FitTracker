import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import {
  Container, Card, CardBody, Form, FormGroup,
  Label, Input, Button, Alert, FormFeedback, Row, Col
} from "reactstrap";
import { registerUser } from "../Features/UserSlice";
import { registerSchemaValidation } from "../Validations/UserValidations";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "", email: "", password: "", confirmPassword: "",
      age: "", weight: "", height: "", goal: "maintain",
    },
    validationSchema: registerSchemaValidation,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const result = await dispatch(registerUser(values));
        if (result.meta.requestStatus === "fulfilled") {
          alert("Account created! Please log in.");
          navigate("/login");
        } else {
          setStatus("Registration failed. Email may already be in use.");
        }
      } catch (error) {
        setStatus("Registration failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light py-4">
      <Container style={{ maxWidth: 520 }}>
        <div className="text-center mb-4">
          <h1 style={{ fontSize: "2.5rem" }}>💪</h1>
          <h3 className="fw-bold">Create Account</h3>
        </div>
        <Card className="stat-card">
          <CardBody className="p-4">
            {formik.status && <Alert color="danger">{formik.status}</Alert>}
            <Form onSubmit={formik.handleSubmit}>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Full Name *</Label>
                    <Input name="name" placeholder="John Doe"
                      value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      invalid={formik.touched.name && !!formik.errors.name} />
                    <FormFeedback>{formik.errors.name}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Email *</Label>
                    <Input type="email" name="email" placeholder="you@example.com"
                      value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      invalid={formik.touched.email && !!formik.errors.email} />
                    <FormFeedback>{formik.errors.email}</FormFeedback>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <FormGroup>
                    <Label>Password *</Label>
                    <Input type="password" name="password" placeholder="Min 4 characters"
                      value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      invalid={formik.touched.password && !!formik.errors.password} />
                    <FormFeedback>{formik.errors.password}</FormFeedback>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label>Confirm Password *</Label>
                    <Input type="password" name="confirmPassword" placeholder="Re-enter password"
                      value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur}
                      invalid={formik.touched.confirmPassword && !!formik.errors.confirmPassword} />
                    <FormFeedback>{formik.errors.confirmPassword}</FormFeedback>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md={4}>
                  <FormGroup>
                    <Label>Age</Label>
                    <Input type="number" name="age" placeholder="25"
                      value={formik.values.age} onChange={formik.handleChange} />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>Weight (kg)</Label>
                    <Input type="number" name="weight" placeholder="70"
                      value={formik.values.weight} onChange={formik.handleChange} />
                  </FormGroup>
                </Col>
                <Col md={4}>
                  <FormGroup>
                    <Label>Height (cm)</Label>
                    <Input type="number" name="height" placeholder="175"
                      value={formik.values.height} onChange={formik.handleChange} />
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
              <Button color="primary" block type="submit" disabled={formik.isSubmitting} className="mt-2">
                {formik.isSubmitting ? "Creating account…" : "Create Account"}
              </Button>
            </Form>
            <p className="text-center mt-3 mb-0 text-muted small">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Register;

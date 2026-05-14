import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useFormik } from "formik";
import {
  Container, Card, CardBody, Form, FormGroup,
  Label, Input, Button, Alert, FormFeedback
} from "reactstrap";
import { login } from "../Features/UserSlice";
import { loginSchemaValidation } from "../Validations/UserValidations";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchemaValidation,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        const result = await dispatch(login(values));
        if (result.meta.requestStatus === "fulfilled") {
          navigate("/");
        } else {
          setStatus("Invalid credentials. Please try again.");
        }
      } catch (error) {
        setStatus("Login failed. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Container style={{ maxWidth: 420 }}>
        <div className="text-center mb-4">
          <h1 style={{ fontSize: "2.5rem" }}>💪</h1>
          <h3 className="fw-bold">FitTrack</h3>
          <p className="text-muted">Sign in to your account</p>
        </div>
        <Card className="stat-card">
          <CardBody className="p-4">
            {formik.status && <Alert color="danger">{formik.status}</Alert>}
            <Form onSubmit={formik.handleSubmit}>
              <FormGroup>
                <Label for="email">Email</Label>
                <Input
                  type="email" id="email" name="email"
                  placeholder="you@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.email && !!formik.errors.email}
                />
                <FormFeedback>{formik.errors.email}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  type="password" id="password" name="password"
                  placeholder="••••••••"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  invalid={formik.touched.password && !!formik.errors.password}
                />
                <FormFeedback>{formik.errors.password}</FormFeedback>
              </FormGroup>
              <Button color="primary" block type="submit" disabled={formik.isSubmitting}>
                {formik.isSubmitting ? "Signing in…" : "Sign In"}
              </Button>
            </Form>
            <p className="text-center mt-3 mb-0 text-muted small">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </CardBody>
        </Card>
      </Container>
    </div>
  );
};

export default Login;

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Form, Button } from "react-bootstrap";
import "./LoginRegister.css";
import { registerUser } from "../Store/AuthSlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { RootState } from "../Store/Store";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

type RegisterFormsInputs = {
  email: string;
  userName: string;
  password: string;
};

const validation = Yup.object().shape({
  email: Yup.string().required("Email is required").email("Invalid email address"),
  userName: Yup.string().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/\d/, "Password must contain at least one number")
    .matches(/[@$!%*?&]/, "Password must contain at least one special character (@$!%*?&)")
});

const Register = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status } = useAppSelector((state: RootState) => state.auth);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormsInputs>({ resolver: yupResolver(validation) });

  const handleRegister = async (form: RegisterFormsInputs) => {
    dispatch(registerUser({ email: form.email, username: form.userName, password: form.password }));
  };

  useEffect(() => {
    if (status === 'succeeded') {
      navigate("/");
    }
  }, [status, navigate]);

  return (
    <div className="login-container">
      <h2>Sign Up</h2>
      <Form onSubmit={handleSubmit(handleRegister)} className="form-container">
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            {...register("email")}
            className="form-input"
          />
          {errors.email && (
            <Form.Text className="text-danger">
              {errors.email.message}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            {...register("userName")}
            className="form-input"
          />
          {errors.userName && (
            <Form.Text className="text-danger">
              {errors.userName.message}
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            {...register("password")}
            className="form-input"
          />
          {errors.password && (
            <Form.Text className="text-danger">
              {errors.password.message}
            </Form.Text>
          )}
        </Form.Group>

        <Button variant="primary" type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Signing up...' : 'Sign Up'}
        </Button>
      </Form>
      <p className="register-link">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

export default Register;

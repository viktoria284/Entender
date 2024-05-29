import * as Yup from "yup";
import { Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import "./LoginRegister.css";
import { RootState } from "../Store/Store";
import { loginUser } from "../Store/AuthSlice";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { useEffect } from "react";

type LoginFormsInputs = {
  userName: string;
  password: string;
};

const validation = Yup.object().shape({
  userName: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status } = useAppSelector((state: RootState) => state.auth);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormsInputs>({ resolver: yupResolver(validation) });

  const handleLogin = (form: LoginFormsInputs) => {
    dispatch(loginUser({ username: form.userName, password: form.password }));
  };

  useEffect(() => {
    if (status === 'succeeded') {
      navigate("/");
    }
  }, [status, navigate]);

  return (
    <div className="login-container">
      <h2>Sign In</h2>
      <Form onSubmit={handleSubmit(handleLogin)} className="form-container">
        <Form.Group controlId="formBasicEmail">
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
          {status === 'loading' ? 'Signing In...' : 'Sign In'}
        </Button>
      </Form>
      <p className="register-link">
        Don’t have an account yet? <Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;

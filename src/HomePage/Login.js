import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Link,
  Divider,
} from "@mui/material";
import Register from "./Register";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const Login = ({ onClose }) => {
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    otp: "",
  });

  const [errors, setErrors] = useState({});
  const [showOTPField, setShowOTPField] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [loginWithPassword, setLoginWithPassword] = useState(true);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const API_URL =
    "https://virtullearning.cloudjiffy.net/BitStreamIOLMSWeb/login/v1/userLogin";

  const validateInput = (userName, password) => {
    const inputErrors = {};

    if (!userName.trim()) {
      inputErrors.userName = "Username is required";
    }

    if (!password.trim() && !showOTPField) {
      inputErrors.password = "Password is required";
    }

    return inputErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const userName = data.get("userName");
    const password = data.get("password");
    const otp = data.get("otp");
    const inputErrors = validateInput(userName, password);

    if (!loginWithPassword && otp) {
      // Handle OTP verification
      // You may need to modify this part based on your OTP verification logic
    } else if (Object.keys(inputErrors).length === 0) {
      // Handle password login
      axios
        .post(API_URL, {
          userName: userName,
          password: password,
        })
        .then((response) => {
          if (response.data.status === "FAILED") {
            onClose();
            navigate("/");
            Swal.fire("Login FAILED");
          } else {
            sessionStorage.setItem("user", JSON.stringify(response.data));
            Swal.fire("Login Successful");
            navigate("/dashboard");
            setFormData({ userName: "", password: "" });
          }
        })
        .catch((error) => {
          console.error("API error:", error);
          onClose();
          Swal.fire("Bad Credentials");
        });
    } else {
      setErrors(inputErrors);
    }
  };

  const handleToggleLoginMethod = () => {
    setLoginWithPassword(!loginWithPassword);
    setFormData({ ...formData, otp: "" });
  };

  const handleLoginWithOTP = () => {
    setShowOTPField(true);
  };

  const handleToggleRegister = () => {
    setShowRegister(!showRegister);
  };

  const handleRegisterClose = () => {
    setShowRegister(false);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: -2,
          mb: 2,
          fontSize: "22px",
          "@media (max-width: 600px)": { fontSize: "21px" },
        }}
      >
        Welcome to BitStreamIO
        <Close
          onClick={onClose}
          sx={{
            display: "flex",
            ml: "350px",
            mt: "-28px",
            cursor: "pointer",
            "@media (max-width: 600px)": { ml: "280px" },
          }}
        />
      </Typography>
      <Divider />
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {showRegister ? (
          <Register onClose={handleRegisterClose} />
        ) : (
          <>
            <Typography component="h1" variant="h5">
              {loginWithPassword ? "Login" : "Login"}
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 2 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="userName"
                label="Username"
                name="userName"
                autoComplete="userName"
                autoFocus
                value={formData.userName}
                onChange={handleChange}
                error={Boolean(errors.userName)}
                helperText={errors.userName}
              />
              {loginWithPassword ? (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  error={Boolean(errors.password)}
                  helperText={errors.password}
                />
              ) : (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="otp"
                  label="Enter OTP"
                  type="text"
                  id="otp"
                  autoComplete="off"
                  value={formData.otp}
                  onChange={handleChange}
                  error={Boolean(errors.otp)}
                  helperText={errors.otp}
                />
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 1 }}
              >
                {loginWithPassword ? "Login" : "Login"}
              </Button>

              {!showOTPField && (
                <>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, mb: 1 }}
                    onClick={handleToggleLoginMethod}
                  >
                    {loginWithPassword
                      ? "Login with OTP"
                      : "Login with Password"}
                  </Button>
                  {/* <Link href="#" variant="body2" onClick={handleToggleRegister}>
                    Don't have an account? Register
                  </Link> */}
                </>
              )}
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
};

export default Login;

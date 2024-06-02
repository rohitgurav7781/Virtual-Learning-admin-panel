import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Link,
} from "@mui/material";

const Register = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    mobile: "",
    otp: "",
  });

  const [errors, setErrors] = useState({});
  const [registerWithPassword, setRegisterWithPassword] = useState(true);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!formData.username.trim()) {
      validationErrors.username = "Username is required";
    }

    if (!formData.mobile.trim()) {
      validationErrors.mobile = "Mobile number is required";
    }

    if (!registerWithPassword && !formData.otp.trim()) {
      validationErrors.otp = "OTP is required";
    }

    if (registerWithPassword && !formData.password.trim()) {
      validationErrors.password = "Password is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log("Registration successful!", formData);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <>
          <Typography component="h1" variant="h5">
            Register
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
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={formData.username}
              onChange={handleChange}
              error={Boolean(errors.username)}
              helperText={errors.username}
              sx={{ width: "100%" }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="mobile"
              label="Mobile Number"
              name="mobile"
              autoComplete="mobile"
              value={formData.mobile}
              onChange={handleChange}
              error={Boolean(errors.mobile)}
              helperText={errors.mobile}
              sx={{ width: "100%" }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              sx={{ width: "100%" }}
            />
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
              sx={{ width: "100%" }}
            />
            <Button sx={{ color: "white" }} variant="contained">
              Send OTP
            </Button>
            {/* <Button variant="contained" sx={{ color: "white", ml: 4 }}>
              verify otp
            </Button> */}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 1 }}
            >
              Register
            </Button>
            <>
              <Link href="#" variant="body2" onClick={onClose}>
                Already have an account? Login
              </Link>
            </>
          </Box>
        </>
      </Box>
    </Container>
  );
};

export default Register;

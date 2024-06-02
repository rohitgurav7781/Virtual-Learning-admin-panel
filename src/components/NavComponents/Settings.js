import { Box, Breadcrumbs, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

const Settings = () => {
  return (
    <>
      <Box sx={{ height: { md: "69vh", xs: "80vh", sm: "83.7vh" } }}>
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Settings
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" to="/dashboard">
            Home
          </Link>
          <Typography color="#51678f">Settings</Typography>
        </Breadcrumbs>
      </Box>
    </>
  );
};

export default Settings;

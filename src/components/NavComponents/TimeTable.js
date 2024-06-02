import { Box, Breadcrumbs, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import BasicTable from "./Table";
import Footer from "./Footer";

const TimeTable = () => {
  return (
    <>
      <Box sx={{ height: { md: "70vh", xs: "75vh", sm: "83.7vh" } }}>
        <Typography
          sx={{ mb: 0, fontSize: "24px", color: "#012970" }}
          variant="h4"
        >
          Timetable
        </Typography>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="#899bbd" to="/dashboard">
            Home
          </Link>
          <Typography color="#51678f">Timetable</Typography>
        </Breadcrumbs>
      </Box>
    </>
  );
};

export default TimeTable;
